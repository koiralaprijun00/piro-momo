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
      
    case 'TIMER_TICK':
      const newTimeLeft = Math.max(0, state.timeLeft - 1);
      return {
        ...state,
        timeLeft: newTimeLeft,
        ...(newTimeLeft === 0 && {
          isTimerRunning: false,
          meaningsVisible: true,
        }),
      };
      
    case 'SHOW_MEANINGS':
      return {
        ...state,
        isTimerRunning: false,
        meaningsVisible: true,
      };
      
    case 'FINALIZE_ASSESSMENT': // MAKE_EARLY_ASSESSMENT case is missing, which is good.
      return {
        ...state,
        assessmentDone: true,
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