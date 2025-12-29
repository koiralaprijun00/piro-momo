import { Badge, UserStats } from './types';

// Helper to calculate total score
const getTotalScore = (stats: UserStats): number => {
  if (!stats) return 0;
  const logoScore = stats.logoQuiz?.score || 0;
  const vocabScore = stats.vocabGame?.totalKnown || 0;
  const kingsScore = stats.kingsOfNepal?.correctAnswers?.length || 0;
  const festivalScore = stats.guessFestival?.score || 0;
  const mandirScore = stats.mandirChineu?.highScore || 0;
  const gauScore = stats.gauKhaneKatha?.score || 0;
  const districtScore = stats.nameDistricts?.correctGuesses?.length || 0;
  const gkScore = stats.generalKnowledge?.highScore || 0;
  const firstScore = stats.firstOfNepal?.highScore || 0;
  
  return logoScore + vocabScore + kingsScore + festivalScore + mandirScore + gauScore + districtScore + gkScore + firstScore;
};

// Helper to count games played
const getGamesPlayed = (stats: UserStats): number => {
  if (!stats) return 0;
  let count = 0;
  if (stats.logoQuiz?.lastPlayed) count++;
  if (stats.vocabGame?.lastSessionDate) count++;
  if (stats.kingsOfNepal?.lastPlayed) count++;
  if (stats.guessFestival?.lastPlayed) count++;
  if (stats.mandirChineu?.lastPlayed) count++;
  if (stats.gauKhaneKatha?.lastPlayed) count++;
  if (stats.nameDistricts?.lastPlayed) count++;
  if (stats.generalKnowledge?.lastPlayed) count++;
  if (stats.firstOfNepal?.lastPlayed) count++;
  if (stats.lifeChecklist?.lastUpdated) count++;
  return count;
};

export const BADGES: Badge[] = [
  // EXPLORER BADGES
  {
    id: 'pahilo_kadam',
    nameNepali: 'पहिलो कदम',
    nameEnglish: 'Pahilo Kadam (First Step)',
    description: 'Play your first game',
    category: 'explorer',
    icon: '👣',
    criteria: (stats) => getGamesPlayed(stats) >= 1,
    progress: (stats) => ({ current: Math.min(getGamesPlayed(stats), 1), target: 1 })
  },
  {
    id: 'yatri',
    nameNepali: 'यात्री',
    nameEnglish: 'Yatri (Traveler)',
    description: 'Play 5 different games',
    category: 'explorer',
    icon: '🎒',
    criteria: (stats) => getGamesPlayed(stats) >= 5,
    progress: (stats) => ({ current: Math.min(getGamesPlayed(stats), 5), target: 5 })
  },
  {
    id: 'ghummakad',
    nameNepali: 'घुम्मक्कड',
    nameEnglish: 'Ghummakad (Wanderer)',
    description: 'Play all 10 games',
    category: 'explorer',
    icon: '🗺️',
    criteria: (stats) => getGamesPlayed(stats) >= 10,
    progress: (stats) => ({ current: Math.min(getGamesPlayed(stats), 10), target: 10 })
  },
  {
    id: 'everest_shikhari',
    nameNepali: 'एभरेस्ट शिखरी',
    nameEnglish: 'Everest Shikhari (Summiter)',
    description: 'Reach 1000 total points',
    category: 'explorer',
    tier: 'gold',
    icon: '🏔️',
    criteria: (stats) => getTotalScore(stats) >= 1000,
    progress: (stats) => ({ current: Math.min(getTotalScore(stats), 1000), target: 1000 })
  },

  // MASTERY BADGES
  {
    id: 'pandit',
    nameNepali: 'पण्डित',
    nameEnglish: 'Pandit (Scholar)',
    description: 'Score 100+ in General Knowledge',
    category: 'mastery',
    icon: '📚',
    criteria: (stats) => (stats.generalKnowledge?.highScore || 0) >= 100,
    progress: (stats) => ({ current: Math.min(stats.generalKnowledge?.highScore || 0, 100), target: 100 })
  },
  {
    id: 'itihas_gyani',
    nameNepali: 'इतिहास ज्ञानी',
    nameEnglish: 'Itihas Gyani (History Expert)',
    description: 'Answer all Kings of Nepal correctly',
    category: 'mastery',
    icon: '👑',
    criteria: (stats) => (stats.kingsOfNepal?.correctAnswers?.length || 0) >= 10,
    progress: (stats) => ({ current: Math.min(stats.kingsOfNepal?.correctAnswers?.length || 0, 10), target: 10 })
  },
  {
    id: 'sanskriti_premi',
    nameNepali: 'संस्कृति प्रेमी',
    nameEnglish: 'Sanskriti Premi (Culture Lover)',
    description: 'Identify 50+ festivals',
    category: 'mastery',
    icon: '🎉',
    criteria: (stats) => (stats.guessFestival?.score || 0) >= 50,
    progress: (stats) => ({ current: Math.min(stats.guessFestival?.score || 0, 50), target: 50 })
  },
  {
    id: 'mandir_darshak',
    nameNepali: 'मन्दिर दर्शक',
    nameEnglish: 'Mandir Darshak (Temple Visitor)',
    description: 'Identify 20+ temples',
    category: 'mastery',
    icon: '🛕',
    criteria: (stats) => (stats.mandirChineu?.highScore || 0) >= 20,
    progress: (stats) => ({ current: Math.min(stats.mandirChineu?.highScore || 0, 20), target: 20 })
  },
  {
    id: 'bhugol_bisheshagya',
    nameNepali: 'भूगोल विशेषज्ञ',
    nameEnglish: 'Bhugol Bisheshagya (Geography Expert)',
    description: 'Name all 77 districts',
    category: 'mastery',
    tier: 'gold',
    icon: '🗾',
    criteria: (stats) => (stats.nameDistricts?.correctGuesses?.length || 0) >= 77,
    progress: (stats) => ({ current: Math.min(stats.nameDistricts?.correctGuesses?.length || 0, 77), target: 77 })
  },

  // SPECIAL BADGES
  {
    id: 'shabda_sangrahak',
    nameNepali: 'शब्द संग्राहक',
    nameEnglish: 'Shabda Sangrahak (Word Collector)',
    description: 'Learn 100+ vocab words',
    category: 'special',
    icon: '📖',
    criteria: (stats) => (stats.vocabGame?.totalKnown || 0) >= 100,
    progress: (stats) => ({ current: Math.min(stats.vocabGame?.totalKnown || 0, 100), target: 100 })
  },
  {
    id: 'pahelo_nepali',
    nameNepali: 'पहेलो नेपाली',
    nameEnglish: 'Pahelo Nepali (Riddle Master)',
    description: 'Solve 50+ riddles',
    category: 'special',
    icon: '🤔',
    criteria: (stats) => (stats.gauKhaneKatha?.answeredRiddles?.length || 0) >= 50,
    progress: (stats) => ({ current: Math.min(stats.gauKhaneKatha?.answeredRiddles?.length || 0, 50), target: 50 })
  },
  {
    id: 'checklist_champion',
    nameNepali: 'चेकलिस्ट च्याम्पियन',
    nameEnglish: 'Checklist Champion',
    description: 'Complete 50+ life checklist items',
    category: 'special',
    icon: '✅',
    criteria: (stats) => (stats.lifeChecklist?.completedItems?.length || 0) >= 50,
    progress: (stats) => ({ current: Math.min(stats.lifeChecklist?.completedItems?.length || 0, 50), target: 50 })
  },
  {
    id: 'logo_chinne',
    nameNepali: 'लोगो चिन्ने',
    nameEnglish: 'Logo Chinne (Logo Identifier)',
    description: 'Identify 30+ logos',
    category: 'special',
    icon: '🏢',
    criteria: (stats) => (stats.logoQuiz?.score || 0) >= 30,
    progress: (stats) => ({ current: Math.min(stats.logoQuiz?.score || 0, 30), target: 30 })
  },

  // ELITE BADGES
  {
    id: 'rashtrapati',
    nameNepali: 'राष्ट्रपति',
    nameEnglish: 'Rashtrapati (President)',
    description: 'Reach 5000 total points',
    category: 'elite',
    tier: 'gold',
    icon: '🎖️',
    criteria: (stats) => getTotalScore(stats) >= 5000,
    progress: (stats) => ({ current: Math.min(getTotalScore(stats), 5000), target: 5000 })
  },
  {
    id: 'nepal_ko_gaurav',
    nameNepali: 'नेपालको गौरव',
    nameEnglish: 'Nepal Ko Gaurav (Pride of Nepal)',
    description: 'Unlock all other badges',
    category: 'elite',
    tier: 'gold',
    icon: '🇳🇵',
    criteria: (stats) => {
      const earnedBadges = stats.badges || [];
      const otherBadges = BADGES.filter(b => b.id !== 'nepal_ko_gaurav');
      return otherBadges.every(badge => 
        earnedBadges.some(ub => ub.badgeId === badge.id)
      );
    }
  }
];

// Calculate which badges a user has earned
export const calculateEarnedBadges = (stats: UserStats): string[] => {
  return BADGES
    .filter(badge => badge.criteria(stats))
    .map(badge => badge.id);
};

// Get newly earned badges (not yet in user's badge list)
export const getNewBadges = (stats: UserStats): Badge[] => {
  const currentBadgeIds = (stats.badges || []).map(b => b.badgeId);
  const earnedBadgeIds = calculateEarnedBadges(stats);
  
  return BADGES.filter(badge => 
    earnedBadgeIds.includes(badge.id) && !currentBadgeIds.includes(badge.id)
  );
};

// Get badge progress for locked badges
export const getBadgeProgress = (badgeId: string, stats: UserStats): { current: number; target: number } | null => {
  const badge = BADGES.find(b => b.id === badgeId);
  if (!badge || !badge.progress) return null;
  return badge.progress(stats);
};
