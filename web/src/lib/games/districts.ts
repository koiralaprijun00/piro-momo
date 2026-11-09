/**
 * Name the Districts — explicit state machine.
 *
 *   playing ──CORRECT──▶ celebrating ──ADVANCE (after a short pause)──▶ playing
 *     │  ▲                                    │
 *     │  └──WRONG / GO_TO (stay in playing)   └── all 77 named ──▶ finished
 *     └──TICK at 0s | GIVE_UP ──────────────────────────────────▶ finished
 *   START (new game) and RESUME (saved progress) both enter `playing` with a running clock.
 *
 * `celebrating` locks input during the "Correct!" pause, so a second click
 * can't skip a district or count twice.
 */

export type DistrictPhase = 'playing' | 'celebrating' | 'finished';

export const GAME_SECONDS = 1200; // 20 minutes

export interface DistrictState {
  phase: DistrictPhase;
  order: string[];
  cursor: number;
  correctIds: string[];
  timeLeft: number;
  streak: number;
  bestStreak: number;
}

export type DistrictEvent =
  | { type: 'START'; order: string[] }
  | { type: 'RESUME'; order: string[]; correctIds: string[]; bestStreak: number }
  | { type: 'TICK' }
  | { type: 'CORRECT'; districtId: string }
  | { type: 'WRONG' }
  | { type: 'ADVANCE' }
  | { type: 'GO_TO'; cursor: number }
  | { type: 'GIVE_UP' };

export const initialDistrictState = (order: string[]): DistrictState => ({
  phase: 'playing',
  order,
  cursor: 0,
  correctIds: [],
  timeLeft: GAME_SECONDS,
  streak: 0,
  bestStreak: 0,
});

/** Next district to show: the following one, or the first one still unnamed. */
function nextCursor(state: DistrictState): number | null {
  const { order, cursor, correctIds } = state;
  if (cursor < order.length - 1) return cursor + 1;
  const firstOpen = order.findIndex((id) => !correctIds.includes(id));
  return firstOpen >= 0 ? firstOpen : null;
}

export function districtReducer(state: DistrictState, event: DistrictEvent): DistrictState {
  switch (event.type) {
    case 'START':
      return { ...initialDistrictState(event.order), bestStreak: state.bestStreak };

    case 'RESUME': {
      const done = event.order.length > 0 && event.order.every((id) => event.correctIds.includes(id));
      const firstOpen = event.order.findIndex((id) => !event.correctIds.includes(id));
      return {
        ...initialDistrictState(event.order),
        phase: done ? 'finished' : 'playing',
        cursor: firstOpen >= 0 ? firstOpen : 0,
        correctIds: event.correctIds,
        bestStreak: event.bestStreak,
      };
    }

    case 'TICK':
      if (state.phase === 'finished') return state;
      if (state.timeLeft <= 1) return { ...state, timeLeft: 0, phase: 'finished' };
      return { ...state, timeLeft: state.timeLeft - 1 };

    case 'CORRECT': {
      if (state.phase !== 'playing') return state;
      const streak = state.streak + 1;
      const correctIds = state.correctIds.includes(event.districtId)
        ? state.correctIds
        : [...state.correctIds, event.districtId];
      return {
        ...state,
        phase: 'celebrating',
        correctIds,
        streak,
        bestStreak: Math.max(state.bestStreak, streak),
      };
    }

    case 'WRONG':
      if (state.phase !== 'playing') return state;
      return { ...state, streak: 0 };

    case 'ADVANCE': {
      if (state.phase === 'finished') return state;
      if (state.order.every((id) => state.correctIds.includes(id))) {
        return { ...state, phase: 'finished' };
      }
      const next = nextCursor(state);
      if (next === null) return { ...state, phase: 'finished' };
      return { ...state, phase: 'playing', cursor: next };
    }

    case 'GO_TO':
      if (state.phase !== 'playing') return state;
      if (event.cursor < 0 || event.cursor >= state.order.length) return state;
      return { ...state, cursor: event.cursor };

    case 'GIVE_UP':
      return state.phase === 'finished' ? state : { ...state, phase: 'finished' };

    default:
      return state;
  }
}

/** Score = 100 per district + 1 point per 10 seconds left. */
export function districtScore(state: DistrictState): number {
  if (state.correctIds.length === 0) return 0;
  return state.correctIds.length * 100 + Math.floor(Math.max(0, state.timeLeft) / 10);
}

/** Small deterministic PRNG so option lists are stable for a given game and district. */
function seededRandom(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hash(text: string): number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/**
 * Three multiple-choice district ids (the answer + 2 others), shuffled.
 * Pure: the same game and district always give the same options, so it can run during render.
 */
export function optionIdsFor(order: string[], cursor: number, allIds: string[]): string[] {
  const answer = order[cursor];
  if (!answer) return [];
  const random = seededRandom(hash(`${order.join(',')}#${cursor}`));
  const others = allIds.filter((id) => id !== answer);
  for (let i = others.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [others[i], others[j]] = [others[j], others[i]];
  }
  const choices = [answer, ...others.slice(0, 2)];
  for (let i = choices.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [choices[i], choices[j]] = [choices[j], choices[i]];
  }
  return choices;
}
