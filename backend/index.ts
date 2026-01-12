
import 'dotenv/config';
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';
import cors from 'cors';
import { QuizRoom, Player } from './types';
import { generateQuiz } from './gemini';

const app = express();
app.use(cors());

const httpServer = createServer(app);

// Initialize Redis Clients
// In production, these would use your Redis URL (e.g., from AWS ElastiCache or Redis Labs)
const pubClient = createClient({ url: process.env.REDIS_URL || 'redis://localhost:6379' });
const subClient = pubClient.duplicate();
const redisClient = pubClient.duplicate();

await Promise.all([
  pubClient.connect(),
  subClient.connect(),
  redisClient.connect()
]).catch(err => {
  console.error('Redis Connection Error:', err);
  process.exit(1);
});

const io = new Server(httpServer, {
  cors: { origin: "*", methods: ["GET", "POST"] },
  adapter: createAdapter(pubClient, subClient)
});

/**
 * REDIS SCHEMA STRATEGY:
 * 1. Room Data: Hash `room:{roomId}` stores the JSON-stringified room config.
 * 2. Leaderboard: Sorted Set `leaderboard:{roomId}` stores player scores for O(log N) ranking.
 * 3. TTL: All keys set to expire after 1 hour of inactivity.
 */

io.on('connection', (socket) => {
  console.log('Node connected socket:', socket.id);

  socket.on('create_room', async (params, callback) => {
    try {
      const questions = await generateQuiz(params);
      const roomId = Math.random().toString(36).substr(2, 6).toUpperCase();
      
      const host: Player = {
        id: `p-${socket.id}`,
        socketId: socket.id,
        name: 'Host',
        score: 0,
        isHost: true
      };

      const room: QuizRoom = {
        id: roomId,
        ...params,
        questions,
        players: [host],
        status: 'waiting',
        currentQuestionIndex: 0,
        timeLeft: params.timePerQuestion,
        createdAt: Date.now(),
      };

      // Store in Redis with 1 hour TTL
      await redisClient.setEx(`room:${roomId}`, 3600, JSON.stringify(room));
      
      socket.join(roomId);
      callback({ success: true, room, player: host });
    } catch (error: any) {
      console.error('Quiz creation failed:', error);
      callback({ success: false, error: 'AI Generation failed. Try again.' });
    }
  });

  socket.on('join_room', async ({ roomId, name }, callback) => {
    const rId = roomId.toUpperCase();
    const roomData = await redisClient.get(`room:${rId}`);
    
    if (!roomData) {
      return callback({ success: false, message: 'Room not found' });
    }

    // Fix: Ensure roomData is treated as a string before parsing as it could be a Buffer
    const room: QuizRoom = JSON.parse(roomData.toString());
    const player: Player = {
      id: `p-${socket.id}`,
      socketId: socket.id,
      name,
      score: 0,
      isHost: false
    };

    room.players.push(player);
    
    // Atomic score tracking in Redis Sorted Set
    await redisClient.zAdd(`scores:${rId}`, { score: 0, value: player.id });
    // Update main room state
    await redisClient.setEx(`room:${rId}`, 3600, JSON.stringify(room));

    socket.join(rId);
    io.to(rId).emit('room_update', room);
    callback({ success: true, room, player });
  });

  socket.on('start_quiz', async (roomId) => {
    const roomData = await redisClient.get(`room:${roomId}`);
    if (roomData) {
      // Fix: Ensure roomData is treated as a string before parsing as it could be a Buffer
      const room: QuizRoom = JSON.parse(roomData.toString());
      if (room.status === 'waiting') {
        room.status = 'active';
        await redisClient.setEx(`room:${roomId}`, 3600, JSON.stringify(room));
        startDistributedTimer(roomId);
        io.to(roomId).emit('room_update', room);
      }
    }
  });

  socket.on('submit_answer', async ({ roomId, scoreGain }) => {
    const roomData = await redisClient.get(`room:${roomId}`);
    if (!roomData) return;

    // Fix: Ensure roomData is treated as a string before parsing as it could be a Buffer
    const room: QuizRoom = JSON.parse(roomData.toString());
    const player = room.players.find(p => p.socketId === socket.id);
    
    if (player) {
      player.score += scoreGain;
      // Sync to Sorted Set for massive scale leaderboard performance
      await redisClient.zIncrBy(`scores:${roomId}`, scoreGain, player.id);
      await redisClient.setEx(`room:${roomId}`, 3600, JSON.stringify(room));
      io.to(roomId).emit('room_update', room);
    }
  });
});

/**
 * SCALE NOTE: 
 * In a multi-node environment, only ONE server should run the timer for a room.
 * We use Redis setNX (set if not exists) as a simple distributed lock.
 */
async function startDistributedTimer(roomId: string) {
  const timerKey = `timer_lock:${roomId}`;
  const lockAcquired = await redisClient.set(timerKey, 'locked', { NX: true, EX: 3600 });
  
  if (!lockAcquired) return; // Another node is already timing this room

  const interval = setInterval(async () => {
    const roomData = await redisClient.get(`room:${roomId}`);
    if (!roomData) {
      clearInterval(interval);
      await redisClient.del(timerKey);
      return;
    }

    // Fix: Ensure roomData is treated as a string before parsing as it could be a Buffer
    const room: QuizRoom = JSON.parse(roomData.toString());
    if (room.status !== 'active') {
      clearInterval(interval);
      await redisClient.del(timerKey);
      return;
    }

    room.timeLeft -= 1;

    if (room.timeLeft <= 0) {
      const isLast = room.currentQuestionIndex === room.questions.length - 1;
      if (isLast) {
        room.status = 'completed';
        room.completedAt = Date.now();
        clearInterval(interval);
        await redisClient.del(timerKey);
        // Clean up Redis after 30 mins
        setTimeout(() => {
            redisClient.del(`room:${roomId}`);
            redisClient.del(`scores:${roomId}`);
        }, 30 * 60 * 1000);
      } else {
        room.currentQuestionIndex += 1;
        room.timeLeft = room.timePerQuestion;
      }
    }

    await redisClient.setEx(`room:${roomId}`, 3600, JSON.stringify(room));
    io.to(roomId).emit('room_update', room);
  }, 1000);
}

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => console.log(`🚀 Scalable Backend running on port ${PORT}`));
