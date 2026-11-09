import { useReducer, useEffect, useCallback, useRef } from 'react';
import { Logo } from '@/app/data/logo-quiz/getLogos';
import { STORAGE_KEYS, readSaved, writeSaved, clearSaved } from '@/lib/storage';

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
/** Same rule as the mobile app: three wrong guesses per logo. */
export const MAX_ATTEMPTS = 3;

/**
 * The quiz's phases, worked out from its state:
 *
 *   loading ──INITIALIZE──▶ playing ⇄ paused (TOGGLE_TIMER)
 *                              │
 *                              └── time runs out | SUBMIT_GAME ──▶ finished
 */
export type LogoQuizPhase = 'loading' | 'playing' | 'paused' | 'finished';

export function getLogoQuizPhase(
  state: Pick<GameState, 'isInitialized' | 'showResults' | 'timerActive' | 'timeLeft'>
): LogoQuizPhase {
  if (!state.isInitialized) return 'loading';
  if (state.showResults || state.timeLeft <= 0) return 'finished';
  return state.timerActive ? 'playing' : 'paused';
}

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
        timeLeft: savedState?.timeLeft ?? INITIAL_TIME,
        currentPage: savedState?.currentPage || 0,
        timerActive: (savedState?.timerActive ?? true) && !savedState?.showResults,
        // A saved game whose clock already reached 0 is finished (older versions could save it frozen at 0:00).
        showResults:
          Boolean(savedState?.showResults) ||
          (typeof savedState?.timeLeft === 'number' && savedState.timeLeft <= 0),
        isInitialized: true,
      };
    }

    case 'UPDATE_ANSWER':
      // Prevent updates if already correct or out of attempts
      if (state.showResults || state.correctAnswers[action.logoId] || (state.attemptCounts[action.logoId] || 0) >= MAX_ATTEMPTS) {
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
      if (state.showResults || state.correctAnswers[logoId] || currentAttempts >= MAX_ATTEMPTS) {
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

    case 'TICK': {
      // Ticks only count while the clock is running.
      if (getLogoQuizPhase(state) !== 'playing') return state;
      const timeLeft = Math.max(0, state.timeLeft - 1);
      // Reaching 0 ends the game in the same step, so the clock can never freeze at 0:00.
      if (timeLeft === 0) {
        return { ...state, timeLeft: 0, timerActive: false, showResults: true };
      }
      return { ...state, timeLeft };
    }

    case 'TOGGLE_TIMER':
      if (state.showResults || state.timeLeft <= 0) return state;
      return { ...state, timerActive: !state.timerActive };

    case 'SET_PAGE':
      return { ...state, currentPage: action.page };

    case 'SUBMIT_GAME':
      if (state.showResults) return state;
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

  // Load from localStorage (a corrupted save starts a fresh game instead of crashing)
  useEffect(() => {
    const saved = readSaved<GameState>(STORAGE_KEYS.logoQuiz(locale));
    dispatch({ type: 'INITIALIZE', logos: initialLogos, savedState: saved ?? undefined });
  }, [initialLogos, locale]);

  // Save to localStorage
  useEffect(() => {
    if (state.isInitialized) {
      writeSaved(STORAGE_KEYS.logoQuiz(locale), state);
    }
  }, [state, locale]);

  const phase = getLogoQuizPhase(state);

  // Timer: one interval while playing. The reducer decides when time is up.
  useEffect(() => {
    if (phase !== 'playing') return;
    timerRef.current = setInterval(() => {
      dispatch({ type: 'TICK' });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase]);

  const updateAnswer = useCallback((logoId: string, value: string) => {
    dispatch({ type: 'UPDATE_ANSWER', logoId, value });
  }, []);

  const checkAnswer = useCallback((logoId: string) => {
    // Enforcement: stop checking if already correct or out of attempts
    if (state.showResults || state.correctAnswers[logoId] || (state.attemptCounts[logoId] || 0) >= MAX_ATTEMPTS) return;

    const logo = state.logos.find(l => l.id === logoId);
    if (!logo) return;

    const userAnswer = state.answers[logoId]?.trim().toLowerCase();
    if (!userAnswer) return;

    const isCorrect = logo.acceptableAnswers.some(a => a.toLowerCase() === userAnswer) ||
                      logo.name.toLowerCase() === userAnswer;

    dispatch({ type: 'CHECK_ANSWER', logoId, isCorrect, feedback: isCorrect ? 'Correct!' : 'Incorrect' });
  }, [state.answers, state.correctAnswers, state.attemptCounts, state.logos, state.showResults]);

  const toggleTimer = useCallback(() => dispatch({ type: 'TOGGLE_TIMER' }), []);
  const setPage = useCallback((page: number) => dispatch({ type: 'SET_PAGE', page }), []);
  const submitGame = useCallback(() => dispatch({ type: 'SUBMIT_GAME' }), []);
  
  const resetGame = useCallback((newLogos: Logo[]) => {
    clearSaved(STORAGE_KEYS.logoQuiz(locale));
    dispatch({ type: 'INITIALIZE', logos: newLogos });
  }, [locale]);

  return {
    state,
    phase,
    updateAnswer,
    checkAnswer,
    toggleTimer,
    setPage,
    submitGame,
    resetGame,
  };
};
