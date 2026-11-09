/**
 * Gau Khane Katha (riddles) — explicit state machine.
 *
 *   asking ──SUBMIT (wrong, attempts left)──▶ asking
 *     │  └──SUBMIT (correct | last attempt)──▶ revealed ──NEXT──▶ asking
 *     └──NEXT (skip, streak resets)──────────────────────────────▶ asking
 *   NEXT with every riddle answered ──▶ finished ──RESTART──▶ asking
 */

export type RiddlePhase = 'asking' | 'revealed' | 'finished';
export type RiddleOutcome = 'correct' | 'failed';

export const MAX_RIDDLE_ATTEMPTS = 3;

export interface RiddleState {
  phase: RiddlePhase;
  /** Shuffled riddle indexes for the current language. */
  order: number[];
  cursor: number;
  attempts: number;
  outcome: RiddleOutcome | null;
  score: number;
  streak: number;
  bestStreak: number;
  answeredIds: string[];
}

export type RiddleEvent =
  | { type: 'RESTORE'; score: number; streak: number; bestStreak: number; answeredIds: string[] }
  | { type: 'START'; order: number[]; ids: string[] }
  | { type: 'SUBMIT'; correct: boolean; riddleId: string }
  | { type: 'NEXT'; ids: string[] }
  | { type: 'RESTART'; order: number[] };

export const initialRiddleState: RiddleState = {
  phase: 'asking',
  order: [],
  cursor: 0,
  attempts: 0,
  outcome: null,
  score: 0,
  streak: 0,
  bestStreak: 0,
  answeredIds: [],
};

export const currentRiddleIndex = (state: RiddleState): number | null =>
  state.order.length > 0 ? state.order[state.cursor] ?? null : null;

/** Finds the next unanswered riddle after `from`, wrapping around. */
function findNextCursor(order: number[], from: number, ids: string[], answered: string[]): number | null {
  for (let step = 1; step <= order.length; step++) {
    const cursor = (from + step) % order.length;
    const id = ids[order[cursor]];
    if (id !== undefined && !answered.includes(id)) return cursor;
  }
  return null;
}

export function riddleReducer(state: RiddleState, event: RiddleEvent): RiddleState {
  switch (event.type) {
    case 'RESTORE':
      return {
        ...state,
        score: event.score,
        streak: event.streak,
        bestStreak: event.bestStreak,
        answeredIds: event.answeredIds,
      };

    case 'START': {
      if (event.order.length === 0) return { ...state, order: [], cursor: 0 };
      const allAnswered = event.ids.length > 0 && event.ids.every((id) => state.answeredIds.includes(id));
      // Start on the first riddle the player hasn't solved yet.
      const firstOpen = event.order.findIndex((index) => !state.answeredIds.includes(event.ids[index]));
      return {
        ...state,
        phase: allAnswered ? 'finished' : 'asking',
        order: event.order,
        cursor: firstOpen >= 0 ? firstOpen : 0,
        attempts: 0,
        outcome: null,
      };
    }

    case 'SUBMIT': {
      if (state.phase !== 'asking') return state;
      if (event.correct) {
        const streak = state.streak + 1;
        return {
          ...state,
          phase: 'revealed',
          outcome: 'correct',
          score: state.score + 1,
          streak,
          bestStreak: Math.max(state.bestStreak, streak),
          answeredIds: state.answeredIds.includes(event.riddleId)
            ? state.answeredIds
            : [...state.answeredIds, event.riddleId],
        };
      }
      const attempts = state.attempts + 1;
      if (attempts >= MAX_RIDDLE_ATTEMPTS) {
        return { ...state, phase: 'revealed', outcome: 'failed', attempts, streak: 0 };
      }
      return { ...state, attempts };
    }

    case 'NEXT': {
      if (state.phase === 'finished' || state.order.length === 0) return state;
      // Skipping or failing a riddle breaks the streak.
      const streak = state.outcome === 'correct' ? state.streak : 0;
      const next = findNextCursor(state.order, state.cursor, event.ids, state.answeredIds);
      if (next === null) {
        return { ...state, phase: 'finished', streak, attempts: 0, outcome: null };
      }
      return { ...state, phase: 'asking', cursor: next, streak, attempts: 0, outcome: null };
    }

    case 'RESTART':
      return {
        ...state,
        phase: 'asking',
        order: event.order,
        cursor: 0,
        attempts: 0,
        outcome: null,
        score: 0,
        streak: 0,
        answeredIds: [],
      };

    default:
      return state;
  }
}
