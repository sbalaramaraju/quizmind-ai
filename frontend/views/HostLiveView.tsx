
import React from 'react';
import { QuizRoom } from '../src/types';

interface HostLiveViewProps {
  room: QuizRoom;
}

export const HostLiveView: React.FC<HostLiveViewProps> = ({ room }) => {
  const currentQuestion = room.questions[room.currentQuestionIndex];
  const participants = room.players
    .filter(p => !p.isHost)
    .sort((a, b) => b.score - a.score);

  const progress = (room.timeLeft / room.timePerQuestion) * 100;

  return (
    <div className="glass rounded-3xl p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center border-b border-white/10 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-emerald-400 text-xs font-bold uppercase tracking-widest">Live Dashboard</span>
          </div>
          <h2 className="text-2xl font-bold">{room.topic}</h2>
          <p className="text-slate-400 text-sm">Question {room.currentQuestionIndex + 1} of {room.questions.length}</p>
        </div>
        <div className="text-right">
          <div className={`text-4xl font-black tabular-nums ${room.timeLeft < 5 ? 'text-rose-500' : 'text-indigo-400'}`}>
            {room.timeLeft}s
          </div>
          <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Time Remaining</span>
        </div>
      </div>

      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
        <div 
          className="h-full bg-indigo-500 transition-all duration-1000 ease-linear"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <div className="bg-white/5 rounded-2xl p-6 border border-white/5">
        <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-3">Current Question</h3>
        <p className="text-xl font-medium leading-relaxed">
          {currentQuestion.text}
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest">Live Standings</h3>
          <span className="text-xs text-slate-500">{participants.length} Participants</span>
        </div>
        <div className="space-y-2">
          {participants.length > 0 ? (
            participants.map((p, idx) => (
              <div 
                key={p.id} 
                className="flex justify-between items-center p-4 bg-slate-800/30 border border-slate-700/50 rounded-2xl animate-in slide-in-from-left-4"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <div className="flex items-center gap-4">
                  <span className={`w-6 text-sm font-bold ${idx === 0 ? 'text-yellow-400' : 'text-slate-500'}`}>
                    #{idx + 1}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold">
                    {p.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-semibold">{p.name}</span>
                </div>
                <span className="font-mono text-indigo-400 font-bold">{p.score} pts</span>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-slate-500 italic">
              No players have joined the session.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
