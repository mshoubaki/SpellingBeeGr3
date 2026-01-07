
import React from 'react';

const StartScreen = ({ onStart }) => {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center p-8 text-center bg-pastel-pink">
      <div className="mb-8 transform hover:scale-110 transition-transform">
        <h1 className="text-6xl md:text-8xl font-bold text-kitty-dark mb-2">Kitty Speller</h1>
        <p className="text-xl md:text-2xl text-purple-600 font-semibold italic">Meow-velous Learning!</p>
      </div>

      <div className="relative mb-12">
        <div className="text-9xl">🐱</div>
        <div className="absolute -top-4 -right-4 text-4xl animate-bounce">✨</div>
      </div>

      <button 
        onClick={onStart}
        className="group relative bg-pink-500 hover:bg-pink-600 text-white px-12 py-6 rounded-3xl text-3xl md:text-4xl font-bold shadow-2xl transition-all hover:scale-105 active:scale-95 border-b-8 border-pink-700"
      >
        TAP TO START
      </button>
      <p className="mt-8 text-pink-700 font-medium">100 Fun Words to Learn!</p>
    </div>
  );
};

export default StartScreen;
