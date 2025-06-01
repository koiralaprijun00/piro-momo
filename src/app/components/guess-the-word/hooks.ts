// This file will consolidate game-specific React hooks. 
import { useState, useEffect, useCallback, useRef } from 'react';
import type { Word, WordDifficulty } from './types'; // Updated path
import { initialWordList } from './data';
import { useGameState } from './context'; // Corrected path
import { useToast } from './hooks/use-toast'; // Corrected path to subdirectory

// Note: This interface is also in context.tsx - should be consolidated.
export interface SessionData {
  shownWordIds: number[];
  totalKnown: number;
  totalUnknown: number;
  lastSessionDate: string;
}

interface WordStats {
  id: number;
  correctCount: number;
  incorrectCount: number;
  lastSeen: Date;
  easeFactor: number;
  interval: number;
}

interface SpacedRepetitionState {
  wordStats: Map<number, WordStats>;
  nextReviewDate: Map<number, Date>;
}

const INITIAL_EASE_FACTOR = 2.5;
const MIN_EASE_FACTOR = 1.3;

export interface UseSpacedRepetitionProps {
  difficulty?: WordDifficulty;
}

export function useSessionPersistence() {
  const [sessionData, setSessionData] = useState<SessionData | null>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('vocabGameSession'); // Updated key
      return saved ? JSON.parse(saved) : null;
    }
    return null;
  });

  useEffect(() => {
    if (sessionData && typeof window !== 'undefined') {
      localStorage.setItem('vocabGameSession', JSON.stringify(sessionData)); // Updated key
    } else if (!sessionData && typeof window !== 'undefined') {
      localStorage.removeItem('vocabGameSession'); // Updated key
    }
  }, [sessionData]);

  const updateSessionData = (newData: Partial<SessionData>) => {
    setSessionData(prev => {
      if (!prev) {
        return {
          shownWordIds: [],
          totalKnown: 0,
          totalUnknown: 0,
          lastSessionDate: new Date().toISOString(),
          ...newData
        };
      }
      return {
        ...prev,
        ...newData,
        lastSessionDate: new Date().toISOString()
      };
    });
  };

  const clearSessionData = () => {
    setSessionData(null);
  };

  const resetSessionData = (initialData?: Partial<SessionData>) => {
    const newSessionData = {
      shownWordIds: [],
      totalKnown: 0,
      totalUnknown: 0,
      lastSessionDate: new Date().toISOString(),
      ...initialData
    };
    setSessionData(newSessionData);
  };

  return {
    sessionData,
    updateSessionData,
    clearSessionData,
    resetSessionData
  };
}

export function useSpacedRepetition({ difficulty }: UseSpacedRepetitionProps = {}) {
  const [state, setState] = useState<SpacedRepetitionState>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('vocabGameStats'); // Updated key
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          wordStats: new Map(Object.entries(parsed.wordStats).map(([id, stats]: [string, any]) => [
            Number(id),
            { ...stats, lastSeen: new Date(stats.lastSeen) }
          ])),
          nextReviewDate: new Map(Object.entries(parsed.nextReviewDate).map(([id, date]) => [
            Number(id),
            new Date(date as string)
          ]))
        };
      }
    }
    return {
      wordStats: new Map(),
      nextReviewDate: new Map()
    };
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const serialized = {
        wordStats: Object.fromEntries(state.wordStats),
        nextReviewDate: Object.fromEntries(
          Array.from(state.nextReviewDate.entries()).map(([id, date]) => [id, date.toISOString()])
        )
      };
      localStorage.setItem('vocabGameStats', JSON.stringify(serialized)); // Updated key
    }
  }, [state]);

  const calculateNextReview = (stats: WordStats, difficultyScore: number): WordStats => {
    const newEaseFactor = Math.max(
      MIN_EASE_FACTOR,
      stats.easeFactor + (0.1 - (5 - difficultyScore) * (0.08 + (5 - difficultyScore) * 0.02))
    );
    
    let newInterval;
    if (stats.correctCount === 0) {
      newInterval = 1;
    } else if (stats.correctCount === 1) {
      newInterval = 6;
    } else {
      newInterval = Math.ceil(stats.interval * newEaseFactor);
    }

    return {
      ...stats,
      easeFactor: newEaseFactor,
      interval: newInterval,
      lastSeen: new Date()
    };
  };

  const updateWordStats = (wordId: number, knewIt: boolean) => {
    setState(prev => {
      const currentStats = prev.wordStats.get(wordId) || {
        id: wordId,
        correctCount: 0,
        incorrectCount: 0,
        lastSeen: new Date(),
        easeFactor: INITIAL_EASE_FACTOR,
        interval: 1
      };

      const difficultyScore = knewIt ? 5 : 1;
      const newStats = calculateNextReview(currentStats, difficultyScore);
      
      if (knewIt) {
        newStats.correctCount++;
      } else {
        newStats.incorrectCount++;
      }

      const nextReview = new Date();
      nextReview.setDate(nextReview.getDate() + newStats.interval);

      return {
        wordStats: new Map(prev.wordStats).set(wordId, newStats),
        nextReviewDate: new Map(prev.nextReviewDate).set(wordId, nextReview)
      };
    });
  };

  const resetWordStats = () => {
    setState({
      wordStats: new Map(),
      nextReviewDate: new Map()
    });
    if (typeof window !== 'undefined') {
      localStorage.removeItem('vocabGameStats'); // Updated key
    }
  };

  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const getFilteredWords = useCallback(() => {
    if (!difficulty) {
      return initialWordList;
    }
    return initialWordList.filter(word => word.difficulty === difficulty);
  }, [difficulty]);

  const getNextWord = useCallback(() => {
    const filteredWords = getFilteredWords();
    if (filteredWords.length === 0) {
      return null;
    }

    const now = new Date();
    
    const dueWords = filteredWords.filter(word => {
      const nextReview = state.nextReviewDate.get(word.id);
      return !nextReview || nextReview <= now;
    });

    if (dueWords.length === 0) {
      return null;
    }

    const newWords = dueWords.filter(word => !state.wordStats.has(word.id));
    const reviewWords = dueWords.filter(word => state.wordStats.has(word.id));

    let candidateWords: Word[];
    
    if (reviewWords.length > 0 && newWords.length > 0) {
      const reviewCount = Math.max(1, Math.floor(reviewWords.length * 0.7));
      const newCount = Math.max(1, Math.floor(newWords.length * 0.3));
      
      candidateWords = [
        ...shuffleArray(reviewWords).slice(0, reviewCount),
        ...shuffleArray(newWords).slice(0, newCount)
      ];
    } else {
      candidateWords = dueWords;
    }

    const shuffledCandidates = shuffleArray(candidateWords);
    return shuffledCandidates[Math.floor(Math.random() * shuffledCandidates.length)] || null;
  }, [state, getFilteredWords]); // Removed shuffleArray from deps as it's stable

  return {
    updateWordStats,
    resetWordStats,
    getNextWord,
    wordStats: state.wordStats
  };
}

export type SpacedRepetitionSystem = ReturnType<typeof useSpacedRepetition>; // Define and export here

export const useWordSelection = () => {
  const { state, actions, srSystem } = useGameState();
  const { toast } = useToast();

  const selectNextWord = useCallback(async () => { // Removed overrideTimerDuration as it was unused
    actions.selectNextWord(); // Sets loading state

    const nextWord = srSystem.getNextWord();

    if (!nextWord) {
      toast({ 
        title: "Session Complete!", 
        description: "You've reviewed all available words for this game mode." 
      });
      actions.endSession();
      return;
    }

    actions.setCurrentWord(nextWord);
  }, [srSystem, actions, toast, state]); // state was in deps but not used directly in body, kept for now

  return selectNextWord;
};

export const useGameTimer = () => {
  const { state, actions } = useGameState();

  useEffect(() => {
    if (!state.isTimerRunning || state.timeLeft <= 0) return;

    const timerId = setTimeout(() => {
      actions.tick();
    }, 1000);

    return () => clearTimeout(timerId);
  }, [state.isTimerRunning, state.timeLeft, actions]);

  return {
    timeLeft: state.timeLeft,
    isRunning: state.isTimerRunning,
    start: actions.startTimer,
    stop: () => actions.showMeanings(), // This seems to be specific, perhaps should be a direct action if named stop
  };
};

export const useFinalAssessment = () => {
  const { state, actions, sessionData, updateSessionData, srSystem } = useGameState();
  const selectNextWord = useWordSelection(); // This will now call the local hook
  const busyRef = useRef(false);

  return useCallback((knewIt: boolean) => {
    if (!state.currentWord || busyRef.current) return;

    busyRef.current = true;
    
    srSystem.updateWordStats(state.currentWord.id, knewIt);
    
    const currentShownIds = sessionData?.shownWordIds || [];
    const wordId = state.currentWord.id;
    const updatedShownIds = currentShownIds.includes(wordId) 
      ? currentShownIds 
      : [...currentShownIds, wordId];
    
    updateSessionData({
      shownWordIds: updatedShownIds,
      totalKnown: (sessionData?.totalKnown || 0) + (knewIt ? 1 : 0),
      totalUnknown: (sessionData?.totalUnknown || 0) + (knewIt ? 0 : 1)
    });
        
    actions.finalizeAssessment(knewIt);
    
    setTimeout(() => {
      selectNextWord();
      busyRef.current = false;
    }, 200);

  }, [
    state.currentWord, 
    srSystem,
    updateSessionData, 
    sessionData,
    actions, 
    selectNextWord
  ]);
}; 