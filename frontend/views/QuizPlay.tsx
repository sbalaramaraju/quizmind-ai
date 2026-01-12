
import React, { useState, useEffect } from 'react';
import { QuizRoom, Player } from '../src/types';
import { socket } from '../src/socket';

interface QuizPlayProps {
  room: QuizRoom;
  player: Player;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const QuizPlay: React.FC<QuizPlayProps> = ({ room, player }) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const currentQuestion = room.questions[room.currentQuestionIndex];

  useEffect(() => {
    setSelectedOption(null);
    setHasAnswered(false);
  }, [room.currentQuestionIndex]);

  const handleAnswer = (index: number) => {
    if (hasAnswered || room.timeLeft <= 0) return;
    setSelectedOption(index);
    setHasAnswered(true);
    const isCorrect = index === currentQuestion.correctAnswerIndex;
    const scoreGain = isCorrect ? Math.round(100 + (room.timeLeft / room.timePerQuestion) * 50) : 0;
    socket.emit('submit_answer', { roomId: room.id, scoreGain });
  };

  const progress = (room.timeLeft / room.timePerQuestion) * 100;

  return (
    <div className="glass rounded-3xl p-8 space-y-8 animate-in slide-in-from-right-8 duration-500">
      <div className="flex justify-between items-end">
        <div>
          <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Question {room.currentQuestionIndex + 1}/{room.questions.length}</span>
          <h2 className="text-xl font-bold">{room.topic}</h2>
        </div>
        <div className="text-3xl font-black text-indigo-400 tabular-nums">{room.timeLeft}s</div>
      </div>
      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-indigo-500 to-rose-500 transition-all duration-1000 ease-linear" style={{ width: `${progress}%` }}></div>
      </div>
      <div>
        <h3 className="text-2xl font-bold mb-8">{currentQuestion.text}</h3>
        <div className="grid grid-cols-1 gap-4">
          {currentQuestion.options.map((option, idx) => {
            const isCorrect = idx === currentQuestion.correctAnswerIndex;
            let borderClass = 'border-slate-700 bg-slate-800/30';
            if (hasAnswered) {
              if (isCorrect) borderClass = 'border-emerald-500 bg-emerald-500/20';
              else if (selectedOption === idx) borderClass = 'border-rose-500 bg-rose-500/20';
              else borderClass = 'opacity-50';
            }
            return (
              <button key={idx} disabled={hasAnswered} onClick={() => handleAnswer(idx)} className={`w-full text-left p-5 rounded-2xl border-2 transition-all ${borderClass}`}>
                <span className="font-medium">{option}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
