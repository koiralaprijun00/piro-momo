import type { UserStats } from './types';

/**
 * Merges this device's stats into the stats already saved in the cloud.
 *
 * Rule: progress is never lost. Scores, best streaks and counters keep the higher
 * value; lists of solved items keep everything solved on any device. Only values
 * that describe "right now" (the current streak, whether you gave up) come from
 * this device.
 */

const max = (a?: number, b?: number) => Math.max(a ?? 0, b ?? 0);

function union<T>(a?: T[], b?: T[]): T[] {
  return Array.from(new Set([...(a ?? []), ...(b ?? [])]));
}

function latest(a?: string, b?: string): string {
  if (!a) return b ?? new Date().toISOString();
  if (!b) return a;
  return new Date(a).getTime() >= new Date(b).getTime() ? a : b;
}

export function mergeUserStats(remote: Partial<UserStats> | null, local: Partial<UserStats>): Partial<UserStats> {
  if (!remote) return local;
  const merged: Partial<UserStats> = { ...remote, ...local };

  if (local.logoQuiz || remote.logoQuiz) {
    const logos = { ...(remote.logoQuiz?.logos ?? {}), ...(local.logoQuiz?.logos ?? {}) };
    merged.logoQuiz = {
      logos,
      score: Math.max(Object.keys(logos).length, max(remote.logoQuiz?.score, local.logoQuiz?.score)),
      lastPlayed: latest(remote.logoQuiz?.lastPlayed, local.logoQuiz?.lastPlayed),
    };
  }

  if (local.vocabGame || remote.vocabGame) {
    merged.vocabGame = {
      totalKnown: max(remote.vocabGame?.totalKnown, local.vocabGame?.totalKnown),
      totalUnknown: max(remote.vocabGame?.totalUnknown, local.vocabGame?.totalUnknown),
      wordStats: { ...(remote.vocabGame?.wordStats ?? {}), ...(local.vocabGame?.wordStats ?? {}) },
      lastSessionDate: latest(remote.vocabGame?.lastSessionDate, local.vocabGame?.lastSessionDate),
    };
  }

  if (local.lifeChecklist || remote.lifeChecklist) {
    merged.lifeChecklist = {
      completedItems: union(remote.lifeChecklist?.completedItems, local.lifeChecklist?.completedItems),
      lastUpdated: latest(remote.lifeChecklist?.lastUpdated, local.lifeChecklist?.lastUpdated),
    };
  }

  if (local.kingsOfNepal || remote.kingsOfNepal) {
    merged.kingsOfNepal = {
      correctAnswers: union(remote.kingsOfNepal?.correctAnswers, local.kingsOfNepal?.correctAnswers),
      gaveUp: local.kingsOfNepal?.gaveUp ?? remote.kingsOfNepal?.gaveUp ?? false,
      lastPlayed: latest(remote.kingsOfNepal?.lastPlayed, local.kingsOfNepal?.lastPlayed),
    };
  }

  if (local.guessFestival || remote.guessFestival) {
    merged.guessFestival = {
      score: max(remote.guessFestival?.score, local.guessFestival?.score),
      streak: local.guessFestival?.streak ?? remote.guessFestival?.streak ?? 0,
      bestStreak: max(remote.guessFestival?.bestStreak, local.guessFestival?.bestStreak),
      festivalHistory: local.guessFestival?.festivalHistory ?? remote.guessFestival?.festivalHistory ?? {},
      lastPlayed: latest(remote.guessFestival?.lastPlayed, local.guessFestival?.lastPlayed),
    };
  }

  if (local.mandirChineu || remote.mandirChineu) {
    merged.mandirChineu = {
      score: max(remote.mandirChineu?.score, local.mandirChineu?.score),
      completedRounds: max(remote.mandirChineu?.completedRounds, local.mandirChineu?.completedRounds),
      highScore: max(remote.mandirChineu?.highScore, local.mandirChineu?.highScore),
      lastPlayed: latest(remote.mandirChineu?.lastPlayed, local.mandirChineu?.lastPlayed),
    };
  }

  if (local.gauKhaneKatha || remote.gauKhaneKatha) {
    merged.gauKhaneKatha = {
      score: max(remote.gauKhaneKatha?.score, local.gauKhaneKatha?.score),
      streak: local.gauKhaneKatha?.streak ?? remote.gauKhaneKatha?.streak ?? 0,
      bestStreak: max(remote.gauKhaneKatha?.bestStreak, local.gauKhaneKatha?.bestStreak),
      answeredRiddles: union(remote.gauKhaneKatha?.answeredRiddles, local.gauKhaneKatha?.answeredRiddles),
      lastPlayed: latest(remote.gauKhaneKatha?.lastPlayed, local.gauKhaneKatha?.lastPlayed),
    };
  }

  if (local.nameDistricts || remote.nameDistricts) {
    merged.nameDistricts = {
      correctGuesses: union(remote.nameDistricts?.correctGuesses, local.nameDistricts?.correctGuesses),
      bestStreak: max(remote.nameDistricts?.bestStreak, local.nameDistricts?.bestStreak),
      lastPlayed: latest(remote.nameDistricts?.lastPlayed, local.nameDistricts?.lastPlayed),
    };
  }

  if (local.generalKnowledge || remote.generalKnowledge) {
    merged.generalKnowledge = {
      highScore: max(remote.generalKnowledge?.highScore, local.generalKnowledge?.highScore),
      totalGamesPlayed: max(remote.generalKnowledge?.totalGamesPlayed, local.generalKnowledge?.totalGamesPlayed),
      lastPlayed: latest(remote.generalKnowledge?.lastPlayed, local.generalKnowledge?.lastPlayed),
    };
  }

  if (local.firstOfNepal || remote.firstOfNepal) {
    merged.firstOfNepal = {
      totalScore: max(remote.firstOfNepal?.totalScore, local.firstOfNepal?.totalScore),
      quizzesCompleted: max(remote.firstOfNepal?.quizzesCompleted, local.firstOfNepal?.quizzesCompleted),
      highScore: max(remote.firstOfNepal?.highScore, local.firstOfNepal?.highScore),
      lastPlayed: latest(remote.firstOfNepal?.lastPlayed, local.firstOfNepal?.lastPlayed),
    };
  }

  // Badges are only ever added, never removed. (Firestore rejects `undefined`, so only set when present.)
  const badges = remote.badges ?? local.badges;
  if (badges) merged.badges = badges;
  else delete merged.badges;
  merged.lastActive = latest(remote.lastActive, local.lastActive);
  return merged;
}
