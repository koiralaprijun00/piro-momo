/**
 * Guess the Festival — explicit state machine.
 *
 *   asking ──GUESS──────────▶ revealed ──NEXT_ROUND──▶ asking
 *     │                          ▲
 *     └──TICK (timed, 0s left)───┘   outcome = 'timeout'
 *
 * RESTART and SET_MODE always land in `asking` with a fresh round.
 * The reducer is pure: the page picks the random festival and options and passes them in.
 */

export type FestivalMode = 'standard' | 'timed';
export type FestivalPhase = 'asking' | 'revealed';
export type FestivalOutcome = 'correct' | 'wrong' | 'timeout';

export const TIMED_ROUND_SECONDS = 30;
/** Only the most recent answers are needed to avoid repeats; older history is trimmed. */
const MAX_HISTORY = 50;

export interface Round {
  festivalId: string;
  options: string[];
}

export interface FestivalState {
  phase: FestivalPhase;
  mode: FestivalMode;
  round: Round | null;
  outcome: FestivalOutcome | null;
  pointsAwarded: number;
  timeLeft: number;
  score: number;
  streak: number;
  bestStreak: number;
  history: string[];
}

export type FestivalEvent =
  | { type: 'RESTORE'; score: number; streak: number; bestStreak: number; history: string[] }
  | { type: 'NEXT_ROUND'; round: Round }
  | { type: 'GUESS'; option: string; correctName: string }
  | { type: 'TICK' }
  | { type: 'SET_MODE'; mode: FestivalMode; round: Round }
  | { type: 'RESTART'; round: Round };

export const initialFestivalState: FestivalState = {
  phase: 'asking',
  mode: 'standard',
  round: null,
  outcome: null,
  pointsAwarded: 0,
  timeLeft: TIMED_ROUND_SECONDS,
  score: 0,
  streak: 0,
  bestStreak: 0,
  history: [],
};

export const pointsFor = (mode: FestivalMode) => (mode === 'timed' ? 2 : 1);

function startRound(state: FestivalState, round: Round): FestivalState {
  return {
    ...state,
    phase: 'asking',
    round,
    outcome: null,
    pointsAwarded: 0,
    timeLeft: TIMED_ROUND_SECONDS,
  };
}

function reveal(state: FestivalState, outcome: FestivalOutcome): FestivalState {
  const correct = outcome === 'correct';
  const points = correct ? pointsFor(state.mode) : 0;
  const streak = correct ? state.streak + 1 : 0;
  const history = state.round ? [...state.history, state.round.festivalId].slice(-MAX_HISTORY) : state.history;
  return {
    ...state,
    phase: 'revealed',
    outcome,
    pointsAwarded: points,
    score: state.score + points,
    streak,
    bestStreak: Math.max(state.bestStreak, streak),
    history,
  };
}

export function festivalReducer(state: FestivalState, event: FestivalEvent): FestivalState {
  switch (event.type) {
    case 'RESTORE':
      return {
        ...state,
        score: event.score,
        streak: event.streak,
        bestStreak: event.bestStreak,
        history: event.history.slice(-MAX_HISTORY),
      };

    case 'NEXT_ROUND':
      return startRound(state, event.round);

    case 'GUESS':
      if (state.phase !== 'asking' || !state.round) return state;
      return reveal(state, event.option === event.correctName ? 'correct' : 'wrong');

    case 'TICK':
      if (state.mode !== 'timed' || state.phase !== 'asking') return state;
      if (state.timeLeft <= 1) return reveal({ ...state, timeLeft: 0 }, 'timeout');
      return { ...state, timeLeft: state.timeLeft - 1 };

    case 'SET_MODE':
      if (event.mode === state.mode) return state;
      return startRound({ ...state, mode: event.mode, score: 0, streak: 0, history: [] }, event.round);

    case 'RESTART':
      return startRound({ ...state, score: 0, streak: 0, history: [] }, event.round);

    default:
      return state;
  }
}

/** Picks the next festival, avoiding the last few shown when possible. */
export function pickNextFestivalId(allIds: string[], history: string[], currentId: string | null): string | null {
  if (allIds.length === 0) return null;
  const recent = history.slice(-Math.min(3, allIds.length - 1));
  let candidates = allIds.filter((id) => !recent.includes(id));
  if (candidates.length === 0) candidates = allIds.filter((id) => id !== currentId);
  if (candidates.length === 0) candidates = allIds;
  return candidates[Math.floor(Math.random() * candidates.length)];
}
