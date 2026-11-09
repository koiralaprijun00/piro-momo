/**
 * Nepal General Knowledge quiz — explicit state machine.
 *
 *   asking ──GUESS──▶ revealed ──NEXT──▶ asking
 *     └──GUESS on the last question──▶ finished ──NEW_DECK (restart / category)──▶ asking
 *
 * NEXT changes the question and clears the answer in one step, so the previous
 * question can never be shown again in an unanswered, clickable state.
 */

export type GkPhase = 'asking' | 'revealed' | 'finished';

export const POINTS_PER_QUESTION = 10;

export interface GkQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  category?: string;
}

export interface GkState<Q extends GkQuestion = GkQuestion> {
  phase: GkPhase;
  deck: Q[];
  index: number;
  selected: string | null;
  lastCorrect: boolean;
  score: number;
  highScore: number;
  totalGamesPlayed: number;
}

export type GkEvent<Q extends GkQuestion = GkQuestion> =
  | { type: 'RESTORE'; highScore: number; totalGamesPlayed: number }
  | { type: 'NEW_DECK'; deck: Q[] }
  | { type: 'GUESS'; option: string }
  | { type: 'NEXT' };

export function initialGkState<Q extends GkQuestion>(deck: Q[]): GkState<Q> {
  return {
    phase: 'asking',
    deck,
    index: 0,
    selected: null,
    lastCorrect: false,
    score: 0,
    highScore: 0,
    totalGamesPlayed: 0,
  };
}

export function gkReducer<Q extends GkQuestion>(state: GkState<Q>, event: GkEvent<Q>): GkState<Q> {
  switch (event.type) {
    case 'RESTORE':
      return {
        ...state,
        highScore: Math.max(state.highScore, event.highScore),
        totalGamesPlayed: Math.max(state.totalGamesPlayed, event.totalGamesPlayed),
      };

    case 'NEW_DECK':
      return { ...state, phase: 'asking', deck: event.deck, index: 0, selected: null, lastCorrect: false, score: 0 };

    case 'GUESS': {
      const question = state.deck[state.index];
      if (state.phase !== 'asking' || !question) return state;
      const correct = event.option === question.correctAnswer;
      const score = state.score + (correct ? POINTS_PER_QUESTION : 0);
      const isLast = state.index === state.deck.length - 1;
      return {
        ...state,
        phase: isLast ? 'finished' : 'revealed',
        selected: event.option,
        lastCorrect: correct,
        score,
        highScore: isLast ? Math.max(state.highScore, score) : state.highScore,
        totalGamesPlayed: isLast ? state.totalGamesPlayed + 1 : state.totalGamesPlayed,
      };
    }

    case 'NEXT':
      if (state.phase !== 'revealed') return state;
      return { ...state, phase: 'asking', index: state.index + 1, selected: null, lastCorrect: false };

    default:
      return state;
  }
}
