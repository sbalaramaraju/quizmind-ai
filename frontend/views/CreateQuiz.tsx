
import React, { useState } from 'react';
import { Difficulty, CreateQuizParams, QuizRoom, Player } from '../src/types';
import { socket } from '../src/socket';

interface CreateQuizProps {
  onCreated: (room: QuizRoom, player: Player) => void;
  onBack: () => void;
}

export const CreateQuiz: React.FC<CreateQuizProps> = ({ onCreated, onBack }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateQuizParams>({
    topic: '',
    numQuestions: 5,
    numOptions: 4,
    difficulty: Difficulty.MEDIUM,
    timePerQuestion: 15,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    socket.emit('create_room', formData, (response: any) => {
      setLoading(false);
      if (response.success) onCreated(response.room, response.player);
      else alert(response.error);
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center space-y-8 glass rounded-3xl">
        <div className="w-24 h-24 relative">
          <div className="absolute inset-0 border-4 border-indigo-500/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <h2 className="text-3xl font-bold gradient-text">Creating your quiz...</h2>
      </div>
    );
  }

  return (
    <div className="glass rounded-3xl p-8 space-y-6 animate-in slide-in-from-bottom-8 duration-500">
      <div className="flex items-center gap-4 mb-2">
        <button onClick={onBack} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </button>
        <h2 className="text-2xl font-bold">Quiz Configuration</h2>
      </div>
      <form onSubmit={handleSubmit} className="space-y-5">
        <input required type="text" placeholder="Topic" className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3" value={formData.topic} onChange={e => setFormData({...formData, topic: e.target.value})} />
        <div className="grid grid-cols-2 gap-4">
          <select className="bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3" value={formData.numQuestions} onChange={e => setFormData({...formData, numQuestions: parseInt(e.target.value)})}>
            {[3, 5, 10].map(n => <option key={n} value={n}>{n} Questions</option>)}
          </select>
          <select className="bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3" value={formData.difficulty} onChange={e => setFormData({...formData, difficulty: e.target.value as Difficulty})}>
            {Object.values(Difficulty).map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <button type="submit" className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20 hover:scale-[1.01] transition-transform">Generate Quiz</button>
      </form>
    </div>
  );
};
