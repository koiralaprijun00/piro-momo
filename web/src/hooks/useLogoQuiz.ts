import { useReducer, useEffect, useCallback, useRef } from 'react';
import { Logo } from '@/app/data/logo-quiz/getLogos';

export interface GameState {
  logos: Logo[];
  answers: Record<string, string>;
  correctAnswers: Record<string, boolean>;
  attemptCounts: Record<string, number>;
  score: number;
  timeLeft: number;
  currentPage: number;
  timerActive: boolean;
  showResults: boolean;
  isInitialized: boolean;
}

export type GameAction =
  | { type: 'INITIALIZE'; logos: Logo[]; savedState?: Partial<GameState> }
  | { type: 'SET_LOGOS_PER_PAGE'; count: number }
  | { type: 'UPDATE_ANSWER'; logoId: string; value: string }
  | { type: 'CHECK_ANSWER'; logoId: string; isCorrect: boolean; feedback: string }
  | { type: 'TICK' }
  | { type: 'TOGGLE_TIMER' }
  | { type: 'SET_PAGE'; page: number }
  | { type: 'SUBMIT_GAME' }
  | { type: 'RESET_GAME'; logos: Logo[] };

const INITIAL_TIME = 300;

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'INITIALIZE': {
      const { logos, savedState } = action;
      const initialAnswers: Record<string, string> = {};
      const initialAttemptCounts: Record<string, number> = {};
      const initialCorrectAnswers: Record<string, boolean> = {};

      logos.forEach((logo) => {
        initialAnswers[logo.id] = '';
        initialAttemptCounts[logo.id] = 0;
        initialCorrectAnswers[logo.id] = false;
      });

      return {
        ...state,
        logos,
        answers: { ...initialAnswers, ...(savedState?.answers || {}) },
        correctAnswers: { ...initialCorrectAnswers, ...(savedState?.correctAnswers || {}) },
        attemptCounts: { ...initialAttemptCounts, ...(savedState?.attemptCounts || {}) },
        score: savedState?.score || 0,
        timeLeft: savedState?.timeLeft || INITIAL_TIME,
        currentPage: savedState?.currentPage || 0,
        timerActive: savedState?.timerActive ?? true,
        showResults: savedState?.showResults || false,
        isInitialized: true,
      };
    }

    case 'UPDATE_ANSWER':
      // Prevent updates if already correct or out of attempts
      if (state.correctAnswers[action.logoId] || (state.attemptCounts[action.logoId] || 0) >= 3) {
        return state;
      }
      return {
        ...state,
        answers: { ...state.answers, [action.logoId]: action.value }
      };

    case 'CHECK_ANSWER': {
      const { logoId, isCorrect } = action;
      const currentAttempts = state.attemptCounts[logoId] || 0;
      
      // Safety: don't check if already correct or max attempts reached
      if (state.correctAnswers[logoId] || currentAttempts >= 3) {
        return state;
      }

      const newAttemptCount = isCorrect ? currentAttempts : currentAttempts + 1;

      return {
        ...state,
        correctAnswers: { ...state.correctAnswers, [logoId]: isCorrect },
        attemptCounts: { ...state.attemptCounts, [logoId]: newAttemptCount },
        score: isCorrect && !state.correctAnswers[logoId] ? state.score + 1 : state.score,
      };
    }

    case 'TICK':
      if (state.timeLeft <= 0) {
        return { ...state, timerActive: false, showResults: true };
      }
      return { ...state, timeLeft: state.timeLeft - 1 };

    case 'TOGGLE_TIMER':
      return { ...state, timerActive: !state.timerActive };

    case 'SET_PAGE':
      return { ...state, currentPage: action.page };

    case 'SUBMIT_GAME':
      return { ...state, showResults: true, timerActive: false };

    case 'RESET_GAME':
      return initialState; // Reducer needs a way to get fresh shuffled logos, handled by re-initializing

    default:
      return state;
  }
}

const initialState: GameState = {
  logos: [],
  answers: {},
  correctAnswers: {},
  attemptCounts: {},
  score: 0,
  timeLeft: INITIAL_TIME,
  currentPage: 0,
  timerActive: true,
  showResults: false,
  isInitialized: false,
};

export const useLogoQuiz = (initialLogos: Logo[], locale: string) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`logoQuizState_${locale}`);
    if (saved) {
      const parsed = JSON.parse(saved);
      dispatch({ type: 'INITIALIZE', logos: initialLogos, savedState: parsed });
    } else {
      dispatch({ type: 'INITIALIZE', logos: initialLogos });
    }
  }, [initialLogos, locale]);

  // Save to localStorage
  useEffect(() => {
    if (state.isInitialized) {
      localStorage.setItem(`logoQuizState_${locale}`, JSON.stringify(state));
    }
  }, [state, locale]);

  // Timer logic
  useEffect(() => {
    if (state.timerActive && state.timeLeft > 0 && !state.showResults) {
      timerRef.current = setInterval(() => {
        dispatch({ type: 'TICK' });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [state.timerActive, state.timeLeft, state.showResults]);

  const updateAnswer = useCallback((logoId: string, value: string) => {
    dispatch({ type: 'UPDATE_ANSWER', logoId, value });
  }, []);

  const checkAnswer = useCallback((logoId: string) => {
    // Enforcement: stop checking if already correct or out of attempts
    if (state.correctAnswers[logoId] || (state.attemptCounts[logoId] || 0) >= 3) return;

    const logo = state.logos.find(l => l.id === logoId);
    if (!logo) return;

    const userAnswer = state.answers[logoId]?.trim().toLowerCase();
    if (!userAnswer) return;

    const isCorrect = logo.acceptableAnswers.some(a => a.toLowerCase() === userAnswer) ||
                      logo.name.toLowerCase() === userAnswer;

    dispatch({ type: 'CHECK_ANSWER', logoId, isCorrect, feedback: isCorrect ? 'Correct!' : 'Incorrect' });
  }, [state.answers, state.correctAnswers, state.attemptCounts, state.logos]);

  const toggleTimer = useCallback(() => dispatch({ type: 'TOGGLE_TIMER' }), []);
  const setPage = useCallback((page: number) => dispatch({ type: 'SET_PAGE', page }), []);
  const submitGame = useCallback(() => dispatch({ type: 'SUBMIT_GAME' }), []);
  
  const resetGame = useCallback((newLogos: Logo[]) => {
    localStorage.removeItem(`logoQuizState_${locale}`);
    dispatch({ type: 'INITIALIZE', logos: newLogos });
  }, [locale]);

  return {
    state,
    updateAnswer,
    checkAnswer,
    toggleTimer,
    setPage,
    submitGame,
    resetGame,
  };
};
