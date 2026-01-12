
import React, { useState } from 'react';
import { QuizRoom, Player } from '../src/types';
import { socket } from '../src/socket';

interface JoinRoomProps {
  onJoined: (room: QuizRoom, player: Player) => void;
  onBack: () => void;
}

export const JoinRoom: React.FC<JoinRoomProps> = ({ onJoined, onBack }) => {
  const [roomId, setRoomId] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    socket.emit('join_room', { roomId, name }, (response: any) => {
      if (response.success) onJoined(response.room, response.player);
      else setError(response.message);
    });
  };

  return (
    <div className="glass rounded-3xl p-8 space-y-6 animate-in slide-in-from-bottom-8 duration-500">
      <div className="flex items-center gap-4 mb-2">
        <button onClick={onBack} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </button>
        <h2 className="text-2xl font-bold">Join Room</h2>
      </div>
      <form onSubmit={handleJoin} className="space-y-5">
        <input required type="text" placeholder="Your Name" className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3" value={name} onChange={e => setName(e.target.value)} />
        <input required type="text" placeholder="Room ID" className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 uppercase" value={roomId} onChange={e => setRoomId(e.target.value)} />
        {error && <div className="text-rose-400 text-sm font-medium">{error}</div>}
        <button type="submit" className="w-full py-4 bg-rose-600 text-white font-bold rounded-xl shadow-lg shadow-rose-600/20 transition-all">Join Game</button>
      </form>
    </div>
  );
};
