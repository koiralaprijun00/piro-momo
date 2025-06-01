// ====== From src/types/index.ts ======
export type WordDifficulty = 'easy' | 'medium' | 'difficult';

export interface Word {
  id: number;
  nepali: string;
  roman: string;
  meaning_nepali: string;
  meaning_english: string;
  difficulty: WordDifficulty;
}

// ====== From src/types/game.ts ======
// import type { Word, WordDifficulty } from './index'; // No longer needed as types are in the same file

export interface GameState {
  // Game configuration
  difficulty: WordDifficulty;
  timerDuration: number;
  sessionStarted: boolean;
  
  // Current game state
  currentWord: Word | null;
  timeLeft: number;
  isTimerRunning: boolean;
  meaningsVisible: boolean;
  assessmentDone: boolean;
  
  // UI state
  isLoadingWord: boolean;
  isClientMounted: boolean;
  showEndSessionConfirm: boolean;
  totalWords: number;
  knownWords: number;
  unknownWords: number;
}

export type GameAction = 
  | { type: 'START_SESSION'; payload: { duration: number; difficulty: WordDifficulty } }
  | { type: 'SELECT_NEXT_WORD' }
  | { type: 'SET_CURRENT_WORD'; payload: { word: Word } }
  | { type: 'START_TIMER' }
  | { type: 'TIMER_TICK' }
  | { type: 'SHOW_MEANINGS' }
  | { type: 'FINALIZE_ASSESSMENT'; payload: { knewIt: boolean } }
  | { type: 'SET_CLIENT_MOUNTED'; payload: { mounted: boolean } }
  | { type: 'SET_LOADING'; payload: { loading: boolean } }
  | { type: 'SHOW_END_SESSION_CONFIRM'; payload: { show: boolean } }
  | { type: 'END_SESSION' }
  | { type: 'RESET_WORD_STATE' }
  | { type: 'SET_TOTAL_WORDS'; payload: { count: number } }
  | { type: 'INCREMENT_KNOWN_WORDS' }
  | { type: 'INCREMENT_UNKNOWN_WORDS' };

export interface GameActions {
  startSession: (duration: number, difficulty: WordDifficulty) => void;
  selectNextWord: () => void;
  setCurrentWord: (word: Word) => void;
  startTimer: () => void;
  tick: () => void;
  showMeanings: () => void;
  finalizeAssessment: (knewIt: boolean) => void;
  setClientMounted: (mounted: boolean) => void;
  setLoading: (loading: boolean) => void;
  showEndSessionConfirm: (show: boolean) => void;
  endSession: () => void;
  resetWordState: () => void;
  setTotalWords: (count: number) => void;
  incrementKnownWords: () => void;
  incrementUnknownWords: () => void;
} 