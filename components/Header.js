
import React from 'react';

const Header = ({ currentIndex, total, attempts }) => {
  const progress = ((currentIndex) / total) * 100;

  return (
    <div className="w-full p-4 md:p-6 flex flex-col gap-2 max-w-2xl">
      <div className="flex justify-between items-end mb-1">
        <h2 className="text-kitty-dark font-bold text-lg md:text-2xl">
          Word {currentIndex + 1} of {total}
        </h2>
        <div className="bg-white/50 px-3 py-1 rounded-full text-sm md:text-base border border-pink-200">
          Errors: <span className="font-bold text-red-500">{attempts}</span>
        </div>
      </div>
      
      <div className="w-full bg-white rounded-full h-4 overflow-hidden border-2 border-pink-200 shadow-inner">
        <div 
          className="h-full bg-pink-400 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default Header;
