
export interface WordData {
  word: string;
  audio: string;
}

export interface GameStats {
  attempts: number;
  timeSpent: number;
  isCorrect: boolean;
}

export interface TileItem {
  id: string;
  letter: string;
  isUsed: boolean;
  isExtra: boolean;
}

export enum GameState {
  START = 'START',
  PLAYING = 'PLAYING',
  CELEBRATING = 'CELEBRATING',
  SUMMARY = 'SUMMARY'
}
