
import React from 'react';
import { QuizRoom, Player } from '../src/types';

interface LobbyProps {
  room: QuizRoom;
  player: Player;
  onStart: () => void;
}

export const Lobby: React.FC<LobbyProps> = ({ room, player, onStart }) => {
  const copyRoomId = () => {
    navigator.clipboard.writeText(room.id);
    alert('Room ID copied!');
  };

  return (
    <div className="glass rounded-3xl p-8 space-y-8 animate-in zoom-in-95 duration-500">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-extrabold">{room.topic}</h2>
        <div className="flex items-center justify-center gap-2">
          <span className="text-slate-400">Room Code:</span>
          <button onClick={copyRoomId} className="text-2xl font-mono font-bold tracking-[0.2em] bg-white/5 border border-white/10 px-4 py-1 rounded-xl hover:bg-white/10">{room.id}</button>
        </div>
      </div>
      <div className="space-y-4">
        <div className="flex justify-between items-center text-sm">
          <span className="text-slate-400">Players Joined ({room.players.length})</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {room.players.map((p) => (
            <div key={p.id} className={`p-3 rounded-2xl border ${p.isHost ? 'border-indigo-500/50 bg-indigo-500/10' : 'border-slate-700 bg-slate-800/30'}`}>
              <span className="font-semibold">{p.name} {p.isHost && '(Host)'}</span>
            </div>
          ))}
        </div>
      </div>
      {player.isHost ? (
        <button onClick={onStart} className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl pulse">Start Quiz Now</button>
      ) : (
        <div className="text-center p-4 bg-slate-800/40 rounded-2xl text-slate-400">Waiting for host to start...</div>
      )}
    </div>
  );
};
