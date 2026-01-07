
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { WORD_LIST, CELEBRATION_DELAY } from './constants.js';
import { GameState } from './types.js';
import { generateTilePool, shuffle } from './utils.js';
import Header from './components/Header.js';
import GameBoard from './components/GameBoard.js';
import StartScreen from './components/StartScreen.js';
import SummaryScreen from './components/SummaryScreen.js';
import Confetti from './components/Confetti.js';

const App = () => {
  const [gameState, setGameState] = useState(GameState.START);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [tiles, setTiles] = useState([]);
  const [spelledLetters, setSpelledLetters] = useState([]);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [wordStartTime, setWordStartTime] = useState(0);
  const [gameHistory, setGameHistory] = useState([]);
  
  const audioRef = useRef(null);
  const sfxRef = useRef(null);

  const currentWordData = WORD_LIST[currentWordIndex];

  const playWordAudio = useCallback(() => {
    if (audioRef.current && currentWordData) {
      // Automatically map word to audio path in the /audio folder
      const audioPath = `audio/${currentWordData.word.toLowerCase()}.mp3`;
      audioRef.current.src = audioPath;
      audioRef.current.play().catch(e => console.log("Audio file missing at: " + audioPath, e));
    }
  }, [currentWordData]);

  const playSfx = (type) => {
    const msg = new SpeechSynthesisUtterance();
    if (type === 'wrong') {
      msg.text = "Try again!";
      window.speechSynthesis.speak(msg);
    }
  };

  const startNewWord = useCallback((index) => {
    const wordData = WORD_LIST[index];
    setTiles(generateTilePool(wordData.word));
    setSpelledLetters([]);
    setWrongAttempts(0);
    setWordStartTime(Date.now());
    setGameState(GameState.PLAYING);
    setTimeout(() => playWordAudio(), 500);
  }, [playWordAudio]);

  const handleStartGame = () => {
    setCurrentWordIndex(0);
    setGameHistory([]);
    setTotalTime(0);
    startNewWord(0);
  };

  const handleTileTap = (tile) => {
    if (gameState !== GameState.PLAYING) return;
    
    const targetLetter = currentWordData.word[spelledLetters.length].toUpperCase();
    
    if (tile.letter === targetLetter) {
      setSpelledLetters(prev => [...prev, tile.letter]);
      setTiles(prev => prev.map(t => t.id === tile.id ? { ...t, isUsed: true } : t));
      
      if (spelledLetters.length + 1 === currentWordData.word.length) {
        completeWord();
      }
    } else {
      setWrongAttempts(prev => prev + 1);
      playSfx('wrong');
    }
  };

  const handleUndo = () => {
    if (spelledLetters.length === 0 || gameState !== GameState.PLAYING) return;
    
    const lastLetter = spelledLetters[spelledLetters.length - 1];
    setSpelledLetters(prev => prev.slice(0, -1));
    
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

      <div className="absolute bottom-0 left-0 w-full flex justify-center pointer-events-none opacity-40">
        <span className="text-6xl">🐱🌸✨</span>
      </div>
    </div>
  );
};

export default App;
