import type { GameState, GameAction } from './types'; // Updated path

export const initialGameState: GameState = {
  // Game configuration
  difficulty: 'medium',
  timerDuration: 10,
  sessionStarted: false,
  
  // Current game state
  currentWord: null,
  timeLeft: 10,
  isTimerRunning: false,
  meaningsVisible: false,
  assessmentDone: true,
  
  // UI state
  isLoadingWord: false,
  isClientMounted: false,
  showEndSessionConfirm: false,
  totalWords: 0,
  knownWords: 0,
  unknownWords: 0,
};

/**
 * The phase of the current word, worked out from the reducer's flags:
 *
 *   setup ──START_SESSION──▶ idle ──SELECT_NEXT_WORD──▶ loading ──SET_CURRENT_WORD──▶ timing
 *   timing ──timer hits 0 | SHOW_MEANINGS──▶ assessing ──FINALIZE_ASSESSMENT──▶ idle
 *
 * Actions that don't fit the current phase are ignored, so a double click or a late
 * timer tick can't count a word twice.
 */
export type WordPhase = 'setup' | 'idle' | 'loading' | 'timing' | 'assessing';

export function getWordPhase(state: GameState): WordPhase {
  if (!state.sessionStarted) return 'setup';
  if (state.isLoadingWord) return 'loading';
  if (!state.currentWord || state.assessmentDone) return 'idle';
  if (state.meaningsVisible) return 'assessing';
  return 'timing';
}

export const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'START_SESSION':
      return {
        ...state,
        sessionStarted: true,
        timerDuration: action.payload.duration,
        difficulty: action.payload.difficulty,
        timeLeft: action.payload.duration,
        currentWord: null,
        meaningsVisible: false,
        assessmentDone: true,
        isTimerRunning: false,
        isLoadingWord: false,
        knownWords: 0,
        unknownWords: 0,
      };
      
    case 'SELECT_NEXT_WORD':
      return {
        ...state,
        isLoadingWord: true,
        meaningsVisible: false,
        assessmentDone: false,
      };
      
    case 'SET_CURRENT_WORD':
      return {
        ...state,
        currentWord: action.payload.word,
        isLoadingWord: false,
        timeLeft: state.timerDuration,
        isTimerRunning: true,
      };
      
    case 'START_TIMER':
      return {
        ...state,
        isTimerRunning: true,
        timeLeft: state.timerDuration,
      };
      
    case 'TIMER_TICK': {
      // A tick only counts while the timer is running for a word.
      if (getWordPhase(state) !== 'timing') return state;
      const newTimeLeft = Math.max(0, state.timeLeft - 1);
      return {
        ...state,
        timeLeft: newTimeLeft,
        ...(newTimeLeft === 0 && {
          isTimerRunning: false,
          meaningsVisible: true,
        }),
      };
    }
      
    case 'SHOW_MEANINGS':
      if (getWordPhase(state) !== 'timing') return state;
      return {
        ...state,
        isTimerRunning: false,
        meaningsVisible: true,
      };
      
    case 'FINALIZE_ASSESSMENT':
      // Each word is assessed exactly once, and only after its meanings are shown.
      if (getWordPhase(state) !== 'assessing') return state;
      return {
        ...state,
        assessmentDone: true,
        knownWords: state.knownWords + (action.payload.knewIt ? 1 : 0),
        unknownWords: state.unknownWords + (action.payload.knewIt ? 0 : 1),
      };
      
    case 'SET_CLIENT_MOUNTED':
      return {
        ...state,
        isClientMounted: action.payload.mounted,
      };
      
    case 'SET_LOADING':
      return {
        ...state,
        isLoadingWord: action.payload.loading,
      };
      
    case 'SHOW_END_SESSION_CONFIRM':
      return {
        ...state,
        showEndSessionConfirm: action.payload.show,
      };
      
    case 'END_SESSION':
      return {
        ...initialGameState,
        isClientMounted: state.isClientMounted,
        totalWords: 0, // These were not in the original END_SESSION, but make sense to reset.
        knownWords: 0,
        unknownWords: 0,
      };
      
    case 'RESET_WORD_STATE':
      return {
        ...state,
        currentWord: null,
        meaningsVisible: false,
        assessmentDone: true,
        isTimerRunning: false,
        timeLeft: state.timerDuration,
      };
      
    case 'SET_TOTAL_WORDS':
      return {
        ...state,
        totalWords: action.payload.count,
      };

    case 'INCREMENT_KNOWN_WORDS':
      return {
        ...state,
        knownWords: state.knownWords + 1,
      };

    case 'INCREMENT_UNKNOWN_WORDS':
      return {
        ...state,
        unknownWords: state.unknownWords + 1,
      };

    // MAKE_EARLY_ASSESSMENT is removed from actions in types.ts, so no case needed here.

    default:
      return state;
  }
}; 