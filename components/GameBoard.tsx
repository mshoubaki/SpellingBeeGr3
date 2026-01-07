
import React, { useState } from 'react';
import { TileItem } from '../types';

interface GameBoardProps {
  word: string;
  spelledLetters: string[];
  tiles: TileItem[];
  onTileTap: (tile: TileItem) => void;
  onUndo: () => void;
  onReplayAudio: () => void;
  isCelebrating: boolean;
}

const GameBoard: React.FC<GameBoardProps> = ({ 
  word, 
  spelledLetters, 
  tiles, 
  onTileTap, 
  onUndo, 
  onReplayAudio,
  isCelebrating 
}) => {
  const [shakeId, setShakeId] = useState<string | null>(null);

  const handleTileClick = (tile: TileItem) => {
    if (tile.isUsed) return;
    
    const targetLetter = word[spelledLetters.length].toUpperCase();
    if (tile.letter !== targetLetter) {
      setShakeId(tile.id);
      setTimeout(() => setShakeId(null), 500);
    }
    onTileTap(tile);
  };

  return (
    <div className="flex-1 w-full flex flex-col items-center justify-center p-4 gap-8 max-w-4xl">
      
      {/* Answer Slots */}
      <div className="flex flex-wrap justify-center gap-2 md:gap-4">
        {word.split('').map((char, idx) => {
          // Handle special characters (spaces/hyphens) automatically
          const isSpecial = !/[A-Z]/i.test(char);
          const filledLetter = isSpecial ? char : spelledLetters[idx];

          return (
            <div 
              key={`slot-${idx}`}
              className={`
                w-10 h-10 md:w-16 md:h-16 rounded-xl flex items-center justify-center text-2xl md:text-4xl font-bold shadow-md
                ${filledLetter ? 'bg-white text-kitty-dark border-2 border-pink-300' : 'bg-pink-100 border-2 border-dashed border-pink-300 text-transparent'}
                transition-all duration-300 transform ${isCelebrating ? 'scale-110' : 'scale-100'}
              `}
            >
              {filledLetter}
            </div>
          );
        })}
      </div>

      {/* Controls */}
      <div className="flex gap-4">
        <button 
          onClick={onReplayAudio}
          className="bg-purple-400 hover:bg-purple-500 text-white p-4 rounded-full shadow-lg transition-transform active:scale-95 text-2xl"
          aria-label="Replay Audio"
        >
          🔊
        </button>
        <button 
          onClick={onUndo}
          disabled={spelledLetters.length === 0}
          className="bg-yellow-400 hover:bg-yellow-500 text-white p-4 rounded-full shadow-lg transition-transform active:scale-95 disabled:opacity-50 disabled:scale-100 text-2xl"
          aria-label="Undo"
        >
          🔙
        </button>
      </div>

      {/* Letter Tile Pool */}
      <div className="flex flex-wrap justify-center gap-3 md:gap-6 max-w-2xl px-2">
        {tiles.map((tile) => (
          <button
            key={tile.id}
            onClick={() => handleTileClick(tile)}
            disabled={tile.isUsed}
            className={`
              w-12 h-12 md:w-20 md:h-20 rounded-2xl flex items-center justify-center text-2xl md:text-4xl font-bold
              transition-all duration-300 shadow-lg border-b-4 active:border-b-0 active:translate-y-1
              ${tile.isUsed ? 'opacity-0 scale-75 pointer-events-none' : 'opacity-100 scale-100'}
              ${shakeId === tile.id ? 'tile-shake bg-red-200 border-red-400' : 'bg-white border-pink-200 text-kitty-dark'}
            `}
            style={{ minWidth: '44px', minHeight: '44px' }}
          >
            {tile.letter}
          </button>
        ))}
      </div>
    </div>
  );
};

export default GameBoard;
