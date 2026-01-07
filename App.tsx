
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { WORD_LIST, CELEBRATION_DELAY } from './constants';
import { GameState, TileItem, GameStats } from './types';
import { generateTilePool, shuffle } from './utils';
import Header from './components/Header';
import GameBoard from './components/GameBoard';
import StartScreen from './components/StartScreen';
import SummaryScreen from './components/SummaryScreen';
import Confetti from './components/Confetti';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.START);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [tiles, setTiles] = useState<TileItem[]>([]);
  const [spelledLetters, setSpelledLetters] = useState<string[]>([]);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [wordStartTime, setWordStartTime] = useState(0);
  const [gameHistory, setGameHistory] = useState<GameStats[]>([]);
  
  // Audio handling
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const sfxRef = useRef<HTMLAudioElement | null>(null);

  const currentWordData = WORD_LIST[currentWordIndex];

  const playWordAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.src = currentWordData.audio;
      audioRef.current.play().catch(e => console.log("Autoplay blocked or audio missing", e));
    }
  }, [currentWordData]);

  const playSfx = (type: 'correct' | 'wrong' | 'celebrate') => {
    // Note: In a real app, you'd have these files. 
    // Here we use browser TTS as a fallback or simple logic.
    const msg = new SpeechSynthesisUtterance();
    if (type === 'wrong') {
      msg.text = "Try again!";
      window.speechSynthesis.speak(msg);
    }
  };

  const startNewWord = useCallback((index: number) => {
    const wordData = WORD_LIST[index];
    setTiles(generateTilePool(wordData.word));
    setSpelledLetters([]);
    setWrongAttempts(0);
    setWordStartTime(Date.now());
    setGameState(GameState.PLAYING);
    // Slight delay to let UI settle before audio
    setTimeout(() => playWordAudio(), 500);
  }, [playWordAudio]);

  const handleStartGame = () => {
    setCurrentWordIndex(0);
    setGameHistory([]);
    setTotalTime(0);
    startNewWord(0);
  };

  const handleTileTap = (tile: TileItem) => {
    if (gameState !== GameState.PLAYING) return;
    
    const targetLetter = currentWordData.word[spelledLetters.length].toUpperCase();
    
    if (tile.letter === targetLetter) {
      // Correct tap
      setSpelledLetters(prev => [...prev, tile.letter]);
      setTiles(prev => prev.map(t => t.id === tile.id ? { ...t, isUsed: true } : t));
      
      // Check if word completed
      if (spelledLetters.length + 1 === currentWordData.word.length) {
        completeWord();
      }
    } else {
      // Wrong tap
      setWrongAttempts(prev => prev + 1);
      playSfx('wrong');
      // Trigger visual shake via a temporary state or class logic inside the component
    }
  };

  const handleUndo = () => {
    if (spelledLetters.length === 0 || gameState !== GameState.PLAYING) return;
    
    const lastLetter = spelledLetters[spelledLetters.length - 1];
    setSpelledLetters(prev => prev.slice(0, -1));
    
    // Find the tile that was most recently used for this letter and mark as not used
    // This is a bit tricky if multiple tiles have same letter, we pick the first 'used' one found
    let restored = false;
    setTiles(prev => prev.map(t => {
      if (!restored && t.letter === lastLetter && t.isUsed) {
        restored = true;
        return { ...t, isUsed: false };
      }
      return t;
    }));
  };

  const completeWord = () => {
    const duration = Math.floor((Date.now() - wordStartTime) / 1000);
    setGameHistory(prev => [...prev, {
      attempts: wrongAttempts,
      timeSpent: duration,
      isCorrect: true
    }]);
    setTotalTime(prev => prev + duration);
    setGameState(GameState.CELEBRATING);
    
    setTimeout(() => {
      if (currentWordIndex + 1 < WORD_LIST.length) {
        const nextIdx = currentWordIndex + 1;
        setCurrentWordIndex(nextIdx);
        startNewWord(nextIdx);
      } else {
        setGameState(GameState.SUMMARY);
      }
    }, CELEBRATION_DELAY);
  };

  return (
    <div className="h-screen w-full flex flex-col items-center justify-between overflow-hidden relative">
      {/* Hidden Audio Elements */}
      <audio ref={audioRef} className="hidden" />
      <audio ref={sfxRef} className="hidden" />

      {gameState === GameState.START && (
        <StartScreen onStart={handleStartGame} />
      )}

      {(gameState === GameState.PLAYING || gameState === GameState.CELEBRATING) && (
        <>
          <Header 
            currentIndex={currentWordIndex} 
            total={WORD_LIST.length} 
            attempts={wrongAttempts}
          />
          
          <GameBoard 
            word={currentWordData.word}
            spelledLetters={spelledLetters}
            tiles={tiles}
            onTileTap={handleTileTap}
            onUndo={handleUndo}
            onReplayAudio={playWordAudio}
            isCelebrating={gameState === GameState.CELEBRATING}
          />

          {gameState === GameState.CELEBRATING && <Confetti />}
        </>
      )}

      {gameState === GameState.SUMMARY && (
        <SummaryScreen 
          history={gameHistory} 
          totalTime={totalTime} 
          onRestart={handleStartGame} 
        />
      )}

      {/* Kitty Footer decoration */}
      <div className="absolute bottom-0 left-0 w-full flex justify-center pointer-events-none opacity-40">
        <span className="text-6xl">🐱🌸✨</span>
      </div>
    </div>
  );
};

export default App;
