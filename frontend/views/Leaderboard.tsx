
import React from 'react';
import { QuizRoom } from '../src/types';

interface LeaderboardProps {
  room: QuizRoom;
  onBack: () => void;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ room, onBack }) => {
  const sortedPlayers = [...room.players]
    .filter(p => !p.isHost) // The host doesn't play
    .sort((a, b) => b.score - a.score);

  return (
    <div className="glass rounded-3xl p-8 space-y-8 animate-in zoom-in-95 duration-700">
      <div className="text-center space-y-2">
        <h2 className="text-5xl font-black gradient-text">Results</h2>
        <p className="text-slate-400">{room.topic}</p>
      </div>
      
      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        {sortedPlayers.length > 0 ? (
          sortedPlayers.map((p, i) => (
            <div 
              key={p.id} 
              className={`flex justify-between items-center p-4 glass rounded-2xl border ${i === 0 ? 'border-yellow-500/50 bg-yellow-500/5' : 'border-white/10'}`}
            >
              <div className="flex items-center gap-4">
                <span className={`text-xl font-black w-8 ${i === 0 ? 'text-yellow-400' : 'text-slate-500'}`}>
                  {i + 1}
                </span>
                <span className="font-semibold text-lg">{p.name}</span>
              </div>
              <span className="font-mono text-indigo-400 font-bold text-lg">{p.score} pts</span>
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-slate-500">
            No contestants finished the quiz.
          </div>
        )}
      </div>

      <div className="pt-4 space-y-4">
        <button 
          onClick={onBack} 
          className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold transition-all shadow-lg shadow-indigo-600/20"
        >
          Back to Home
        </button>
        <p className="text-center text-slate-500 text-[10px] uppercase tracking-widest">
          This room will expire in 30 minutes
        </p>
      </div>
    </div>
  );
};
