
import React from 'react';
import { GameStats } from '../types';
import { formatTime } from '../utils';

interface SummaryScreenProps {
  history: GameStats[];
  totalTime: number;
  onRestart: () => void;
}

const SummaryScreen: React.FC<SummaryScreenProps> = ({ history, totalTime, onRestart }) => {
  const totalAttempts = history.reduce((acc, curr) => acc + curr.attempts, 0);
  const accuracy = Math.round((history.length / (history.length + totalAttempts)) * 100);

  return (
    <div className="h-full w-full flex flex-col items-center justify-center p-6 text-center bg-pastel-purple animate-in fade-in duration-700">
      <h2 className="text-5xl md:text-7xl font-bold text-kitty-dark mb-8">Great Job! 🥳</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl mb-12">
        <div className="bg-white p-6 rounded-3xl shadow-xl border-4 border-pink-200">
          <p className="text-lg text-purple-600 font-bold uppercase mb-2">Words Done</p>
          <p className="text-4xl md:text-5xl font-bold text-kitty-dark">{history.length}</p>
        </div>
        
        <div className="bg-white p-6 rounded-3xl shadow-xl border-4 border-pink-200">
          <p className="text-lg text-purple-600 font-bold uppercase mb-2">Accuracy</p>
          <p className="text-4xl md:text-5xl font-bold text-kitty-dark">{accuracy}%</p>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-xl border-4 border-pink-200">
          <p className="text-lg text-purple-600 font-bold uppercase mb-2">Total Time</p>
          <p className="text-4xl md:text-5xl font-bold text-kitty-dark">{formatTime(totalTime)}</p>
        </div>
      </div>

      <div className="bg-white/50 p-6 rounded-2xl mb-8 max-w-md">
        <p className="text-lg text-kitty-dark leading-relaxed">
          You spelled every word correctly! You're becoming a spelling super star! ✨
        </p>
      </div>

      <button 
        onClick={onRestart}
        className="bg-kitty-dark hover:bg-black text-white px-12 py-5 rounded-3xl text-2xl md:text-3xl font-bold shadow-xl transition-all hover:scale-105 active:scale-95"
      >
        PLAY AGAIN 🔄
      </button>
    </div>
  );
};

export default SummaryScreen;
