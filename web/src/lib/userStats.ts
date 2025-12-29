import { db } from './firebase';
import { doc, getDoc, setDoc, updateDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { UserStats, LogoQuizStats, VocabGameStats, LifeChecklistStats, UserBadge } from './types';
import { calculateEarnedBadges, getNewBadges } from './badges';

const COLLECTION_NAME = 'user_stats';

export const syncLocalDataToFirestore = async (userId: string) => {
  if (typeof window === 'undefined') return;

  const localStats: Partial<UserStats> = {
    userId,
    lastActive: new Date().toISOString(),
  };

  // 1. Sync Logo Quiz
  // We'll check both en and np states and merge them if possible, or just pick one. 
  // For simplicity, let's grab 'en' first, then 'np', and merge.
  const logoQuizEn = localStorage.getItem('logoQuizState_en');
  const logoQuizNp = localStorage.getItem('logoQuizState_np');
  
  if (logoQuizEn || logoQuizNp) {
    const combinedLogos: LogoQuizStats['logos'] = {};
    let maxScore = 0;
    let lastPlayed = new Date(0).toISOString();

    const processState = (jsonStr: string | null) => {
      if (!jsonStr) return;
      try {
        const parsed = JSON.parse(jsonStr);
        // Assuming parsed structure matches what's in useLogoQuiz
        // parsed.correctAnswers is { [id]: boolean }
        // parsed.attemptCounts is { [id]: number }
        
        // We only care about correct ones for the "logos" map in our stats
        Object.keys(parsed.correctAnswers || {}).forEach(logoId => {
            if (parsed.correctAnswers[logoId]) {
                 combinedLogos[logoId] = {
                    isCorrect: true,
                    attepts: parsed.attemptCounts?.[logoId] || 1
                };
            }
        });

        if ((parsed.score || 0) > maxScore) maxScore = parsed.score;
        // We don't strictly have a "lastPlayed" in the hook's state, use current time if we found data
        lastPlayed = new Date().toISOString();
      } catch (e) {
        console.error("Error parsing logo quiz local state", e);
      }
    };

    processState(logoQuizEn);
    processState(logoQuizNp);

    localStats.logoQuiz = {
        score: Object.keys(combinedLogos).length, // Recalculate score based on unique correct logos
        logos: combinedLogos,
        lastPlayed
    };
  }

  // 2. Sync Vocab Game
  const vocabStats = localStorage.getItem('vocabGameStats');
  const vocabSession = localStorage.getItem('vocabGameSession'); // Use for last date
  
  if (vocabStats) {
      try {
          const parsedStats = JSON.parse(vocabStats);
          const parsedSession = vocabSession ? JSON.parse(vocabSession) : {};
          
          localStats.vocabGame = {
              totalKnown: 0, // Will calculate from wordStats or use session
              totalUnknown: 0,
              wordStats: parsedStats.wordStats || {},
              lastSessionDate: parsedSession.lastSessionDate || new Date().toISOString()
          };
          
          // Calculate totals from session if available, or just fallback
          if (parsedSession.totalKnown !== undefined) {
             localStats.vocabGame.totalKnown = parsedSession.totalKnown;
             localStats.vocabGame.totalUnknown = parsedSession.totalUnknown;
          }
      } catch(e) {
          console.error("Error parsing vocab stats", e);
      }
  }

    // 3. Life Checklist
    const checklistData = localStorage.getItem('nepalChecklistProgress');
    if (checklistData) {
      try {
          const parsedChecklist = JSON.parse(checklistData);
          // parsedChecklist is likely array of booleans or IDs
          // Adapt based on actual structure. Assuming simple list of checked IDs for now based on typical implementation
          // Logic from page.tsx: const [checkedItems, setCheckedItems] = useState<string[]>(...)
          localStats.lifeChecklist = {
            completedItems: Array.isArray(parsedChecklist) ? parsedChecklist : [],
            lastUpdated: new Date().toISOString()
          };
      } catch (e) {
          console.error("Error parsing checklist progress", e);
      }
    }

    // 4. Kings of Nepal
    const kingsData = localStorage.getItem('kingsOfNepalState');
    if (kingsData) {
        try {
            const parsed = JSON.parse(kingsData);
            localStats.kingsOfNepal = {
                correctAnswers: parsed.correctAnswers || [],
                gaveUp: parsed.gaveUp || false,
                lastPlayed: new Date().toISOString()
            };
        } catch (e) {
            console.error("Error parsing Kings of Nepal stats", e);
        }
    }

    // 5. Guess Festival
    const festivalData = localStorage.getItem('guessFestivalState');
    if (festivalData) {
        try {
            const parsed = JSON.parse(festivalData);
            localStats.guessFestival = {
                score: parsed.score || 0,
                streak: parsed.streak || 0,
                bestStreak: parsed.bestStreak || 0,
                festivalHistory: parsed.festivalHistory || {},
                lastPlayed: parsed.lastPlayed || new Date().toISOString()
            };
        } catch (e) {
            console.error("Error parsing Guess Festival stats", e);
        }
    }

    // 6. Mandir Chineu (Guess Temple)
    const mandirData = localStorage.getItem('mandirChineuState');
    if (mandirData) {
        try {
            const parsed = JSON.parse(mandirData);
            localStats.mandirChineu = {
                score: parsed.score || 0,
                completedRounds: parsed.completedRounds || 0,
                highScore: parsed.highScore || 0,
                lastPlayed: parsed.lastPlayed || new Date().toISOString()
            };
        } catch (e) {
            console.error("Error parsing Mandir Chineu stats", e);
        }
    }

    // 7. Gau Khane Katha (Riddles)
    const riddlesData = localStorage.getItem('gauKhaneKathaState');
    if (riddlesData) {
        try {
            const parsed = JSON.parse(riddlesData);
            localStats.gauKhaneKatha = {
                score: parsed.score || 0,
                streak: parsed.streak || 0,
                bestStreak: parsed.bestStreak || 0,
                answeredRiddles: parsed.answeredRiddles || [],
                lastPlayed: parsed.lastPlayed || new Date().toISOString()
            };
        } catch (e) {
            console.error("Error parsing Gau Khane Katha stats", e);
        }
    }

    // 8. Name Districts
    const districtsData = localStorage.getItem('nameDistrictsState');
    if (districtsData) {
        try {
            const parsed = JSON.parse(districtsData);
            localStats.nameDistricts = {
                correctGuesses: parsed.correctGuesses || [],
                bestStreak: parsed.bestStreak || 0,
                lastPlayed: parsed.lastPlayed || new Date().toISOString()
            };
        } catch (e) {
            console.error("Error parsing Name Districts stats", e);
        }
    }

    // 9. General Knowledge
    const gkData = localStorage.getItem('generalKnowledgeState');
    if (gkData) {
        try {
            const parsed = JSON.parse(gkData);
            localStats.generalKnowledge = {
                highScore: parsed.highScore || 0,
                totalGamesPlayed: parsed.totalGamesPlayed || 0,
                lastPlayed: parsed.lastPlayed || new Date().toISOString()
            };
        } catch (e) {
            console.error("Error parsing General Knowledge stats", e);
        }
    }

    // 10. First of Nepal
    const firstsData = localStorage.getItem('firstOfNepalState');
    if (firstsData) {
        try {
            const parsed = JSON.parse(firstsData);
            localStats.firstOfNepal = {
                totalScore: parsed.totalScore || 0,
                quizzesCompleted: parsed.quizzesCompleted || 0,
                highScore: parsed.highScore || 0,
                lastPlayed: parsed.lastPlayed || new Date().toISOString()
            };
        } catch (e) {
            console.error("Error parsing First of Nepal stats", e);
        }
    }

  // Data preparation done. Now Sync to Firestore.
  // Strategy: Merge local with remote. 
  // However, for MVP, we can assume local is "latest" for the device if it exists.
  // A better check would be timestamps, but let's just do a setDoc with merge: true 
  // BUT special handling: we defined what we found locally.
  
  if (Object.keys(localStats).length > 2) { // userId and lastActive are 2 keys
      const userRef = doc(db, COLLECTION_NAME, userId);
      try {
          // First, get existing stats to calculate badges
          const existingDoc = await getDoc(userRef);
          const existingStats = existingDoc.exists() ? existingDoc.data() as UserStats : null;
          
          // Merge local with existing
          const mergedStats: UserStats = {
              ...existingStats,
              ...localStats,
              userId
          } as UserStats;
          
          // Calculate earned badges
          const earnedBadgeIds = calculateEarnedBadges(mergedStats);
          const currentBadges = existingStats?.badges || [];
          
          // Add new badges with unlock timestamp
          const newBadges = earnedBadgeIds
              .filter(badgeId => !currentBadges.some(b => b.badgeId === badgeId))
              .map(badgeId => ({
                  badgeId,
                  unlockedAt: new Date().toISOString()
              }));
          
          // Update badges array
          if (newBadges.length > 0) {
              mergedStats.badges = [...currentBadges, ...newBadges];
          }
          
          await setDoc(userRef, mergedStats, { merge: true });
          console.log("Synced local stats to Firestore", newBadges.length > 0 ? `(${newBadges.length} new badges!)` : '');
      } catch (err) {
          console.error("Failed to sync stats", err);
      }
  }
};

export const getUserStats = async (userId: string): Promise<UserStats | null> => {
    const userRef = doc(db, COLLECTION_NAME, userId);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
        return snap.data() as UserStats;
    }
    return null;
};

export const subscribeToUserStats = (userId: string, callback: (stats: UserStats | null) => void) => {
    const userRef = doc(db, COLLECTION_NAME, userId);
    return onSnapshot(userRef, (doc) => {
        if (doc.exists()) {
            callback(doc.data() as UserStats);
        } else {
            callback(null);
        }
    });
};
