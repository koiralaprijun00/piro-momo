export interface LogoQuizStats {
  score: number;
  logos: {
    [logoId: string]: {
      isCorrect: boolean;
      attepts: number;
    }
  };
  lastPlayed: string; // ISO date
}

export interface VocabGameStats {
  totalKnown: number;
  totalUnknown: number;
  wordStats: {
    [wordId: number]: {
      correctCount: number;
      incorrectCount: number;
      lastSeen: string;
      easeFactor: number;
      interval: number;
    }
  };
  lastSessionDate: string;
}

export interface LifeChecklistStats {
  completedItems: string[]; // List of completed item IDs
  lastUpdated: string;
}

export interface KingsOfNepalStats {
  correctAnswers: string[];
  gaveUp: boolean;
  lastPlayed: string;
}

export interface GuessFestivalStats {
  score: number;
  streak: number;
  bestStreak: number;
  festivalHistory: Record<string, boolean>; // festivalId -> answered correctly
  lastPlayed: string;
}

export interface MandirChineuStats {
  score: number;
  completedRounds: number;
  highScore: number;
  lastPlayed: string;
}

export interface GauKhaneKathaStats {
  score: number;
  streak: number;
  bestStreak: number;
  answeredRiddles: string[]; // IDs of answered riddles
  lastPlayed: string;
}

export interface NameDistrictsStats {
  correctGuesses: string[]; // district IDs
  bestStreak: number;
  lastPlayed: string;
}

export interface GeneralKnowledgeStats {
  highScore: number;
  totalGamesPlayed: number; // useful to track
  lastPlayed: string;
}

export interface FirstOfNepalStats {
  totalScore: number;
  quizzesCompleted: number;
  highScore: number;
  lastPlayed: string;
}

export interface UserStats {
  userId: string;
  
  logoQuiz: LogoQuizStats;
  vocabGame: VocabGameStats;
  lifeChecklist: LifeChecklistStats;
  kingsOfNepal?: KingsOfNepalStats;
  guessFestival?: GuessFestivalStats;
  mandirChineu?: MandirChineuStats;
  gauKhaneKatha?: GauKhaneKathaStats;
  nameDistricts?: NameDistrictsStats;
  generalKnowledge?: GeneralKnowledgeStats;
  firstOfNepal?: FirstOfNepalStats;
  
  badges?: UserBadge[];
  lastActive: string;
}

// Badge System Types
export type BadgeCategory = 'explorer' | 'mastery' | 'streak' | 'special' | 'elite';
export type BadgeTier = 'bronze' | 'silver' | 'gold';

export interface Badge {
  id: string;
  nameNepali: string;
  nameEnglish: string;
  description: string;
  category: BadgeCategory;
  tier?: BadgeTier;
  icon: string; // emoji
  criteria: (stats: UserStats) => boolean;
  progress?: (stats: UserStats) => { current: number; target: number };
}

export interface UserBadge {
  badgeId: string;
  unlockedAt: string; // ISO date
}
