/**
 * Single source of truth for everything the web games persist in localStorage.
 *
 * Every key and saved shape lives here so that game pages and the profile sync
 * (`lib/userStats.ts`) can never drift apart. The keys and shapes match what the
 * games have always written, so existing players keep their progress.
 *
 * Rules for changing this file:
 * - Never rename a key or remove a field: players' saved data would be lost.
 * - Adding an optional field is safe.
 */

export const STORAGE_KEYS = {
  logoQuiz: (locale: string) => `logoQuizState_${locale}`,
  vocabStats: 'vocabGameStats',
  vocabSession: 'vocabGameSession',
  lifeChecklist: 'nepalChecklistProgress',
  kingsOfNepal: 'kingsOfNepalState',
  guessFestival: 'guessFestivalState',
  mandirChineu: 'mandirChineuState',
  gauKhaneKatha: 'gauKhaneKathaState',
  nameDistricts: 'nameDistrictsState',
  generalKnowledge: 'generalKnowledgeState',
  firstOfNepal: 'firstOfNepalState',
} as const;

export interface SavedKingsOfNepal {
  correctAnswers: string[];
  gameOver: boolean;
  gaveUp: boolean;
  lastPlayed: string;
}

export interface SavedGuessFestival {
  score: number;
  streak: number;
  bestStreak: number;
  festivalHistory: string[];
  lastPlayed: string;
}

export interface SavedMandirChineu {
  score: number;
  highScore: number;
  completedRounds: number;
  lastPlayed: string;
}

export interface SavedGauKhaneKatha {
  score: number;
  streak: number;
  bestStreak: number;
  answeredRiddles: string[];
  lastPlayed: string;
}

export interface SavedNameDistricts {
  correctGuesses: string[];
  bestStreak: number;
  lastPlayed: string;
}

export interface SavedGeneralKnowledge {
  highScore: number;
  totalGamesPlayed: number;
  lastPlayed: string;
}

export interface SavedFirstOfNepal {
  highScore: number;
  quizzesCompleted: number;
  lastPlayed: string;
}

/** Life checklist is saved as `{ [itemId]: checked }`. */
export type SavedLifeChecklist = Record<string, boolean>;

/** Every key a game writes, for both languages. Used to clear progress on sign-out. */
export function allGameStorageKeys(): string[] {
  const { logoQuiz, ...fixed } = STORAGE_KEYS;
  return [logoQuiz('en'), logoQuiz('np'), ...Object.values(fixed)];
}

/** Reads and parses a saved value. Returns null when missing, unreadable, or on the server. */
export function readSaved<T>(key: string): Partial<T> | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? (parsed as Partial<T>) : null;
  } catch (error) {
    console.error(`Failed to read saved state "${key}"`, error);
    return null;
  }
}

export function writeSaved<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    // Storage can be full or disabled (private mode). The game keeps working in memory.
    console.error(`Failed to save state "${key}"`, error);
  }
}

export function clearSaved(key: string): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    // Ignore: nothing useful to do if storage is unavailable.
  }
}
