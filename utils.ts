
import { TileItem } from './types';
import { EXTRA_LETTERS_COUNT } from './constants';

export const shuffle = <T,>(array: T[]): T[] => {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

export const generateTilePool = (word: string): TileItem[] => {
  const upperWord = word.toUpperCase();
  const wordLetters = upperWord.split('').filter(l => /[A-Z]/.test(l));
  
  // Create tiles for the word
  const pool: TileItem[] = wordLetters.map((letter, idx) => ({
    id: `word-${idx}-${letter}`,
    letter,
    isUsed: false,
    isExtra: false,
  }));

  // Add extra letters
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');
  const usedLettersSet = new Set(wordLetters);
  const availableExtras = alphabet.filter(l => !usedLettersSet.has(l));
  
  const selectedExtras = shuffle(availableExtras).slice(0, EXTRA_LETTERS_COUNT);
  
  selectedExtras.forEach((letter, idx) => {
    pool.push({
      id: `extra-${idx}-${letter}`,
      letter,
      isUsed: false,
      isExtra: true,
    });
  });

  return shuffle(pool);
};

export const formatTime = (seconds: number): string => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
};
