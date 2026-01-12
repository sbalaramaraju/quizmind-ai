
import React from 'react';

interface HomeProps {
  onCreate: () => void;
  onJoin: () => void;
}

export const Home: React.FC<HomeProps> = ({ onCreate, onJoin }) => {
  return (
    <div className="text-center space-y-8 animate-in fade-in duration-700">
      <div className="space-y-4">
        <h1 className="text-6xl font-extrabold tracking-tighter">
          <span className="gradient-text">QuizMind AI</span>
        </h1>
        <p className="text-slate-400 text-lg max-w-md mx-auto">
          Challenge your friends with AI-generated quizzes on any topic in seconds.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        <button onClick={onCreate} className="group relative flex flex-col items-center justify-center p-8 glass rounded-3xl hover:border-indigo-500/50 transition-all duration-300 hover:scale-[1.02]">
          <div className="w-16 h-16 bg-indigo-500/20 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-indigo-500/30 transition-colors">
            <svg className="w-8 h-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
          </div>
          <h3 className="text-xl font-bold">Create Quiz</h3>
          <p className="text-slate-500 text-sm mt-1">Host a new game room</p>
        </button>
        <button onClick={onJoin} className="group relative flex flex-col items-center justify-center p-8 glass rounded-3xl hover:border-rose-500/50 transition-all duration-300 hover:scale-[1.02]">
          <div className="w-16 h-16 bg-rose-500/20 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-rose-500/30 transition-colors">
            <svg className="w-8 h-8 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
          </div>
          <h3 className="text-xl font-bold">Join Room</h3>
          <p className="text-slate-500 text-sm mt-1">Enter a room code to play</p>
        </button>
      </div>
    </div>
  );
};
