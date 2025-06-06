"use client";

import React, { createContext, useContext, useReducer, useMemo, useEffect } from 'react';
import type { GameState, GameActions } from './types';
import { gameReducer, initialGameState } from './reducer'; // Updated path
import { initialWordList } from './data';
import { useSessionPersistence, useSpacedRepetition, type SpacedRepetitionSystem } from './hooks';
import type { SessionData } from './types';

interface GameStateContextValue {
  state: GameState;
  actions: GameActions;
  sessionData: SessionData | null;
  updateSessionData: (newData: Partial<SessionData>) => void;
  resetSessionData: (initialData?: Partial<SessionData>) => void;
  srSystem: SpacedRepetitionSystem;
}

const GameStateContext = createContext<GameStateContextValue | undefined>(undefined);

export const useGameState = () => {
  const context = useContext(GameStateContext);
  if (!context) {
    throw new Error('useGameState must be used within a GameStateProvider');
  }
  return context;
};

interface GameStateProviderProps {
  children: React.ReactNode;
}

export const GameStateProvider: React.FC<GameStateProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialGameState);
  
  const { sessionData, updateSessionData, resetSessionData } = useSessionPersistence();

  const srSystem = useSpacedRepetition({ difficulty: state.difficulty });

  const actions = useMemo<GameActions>(() => ({
    startSession: (duration: number, difficulty) => {
      dispatch({ type: 'START_SESSION', payload: { duration, difficulty } });
      dispatch({ type: 'SET_TOTAL_WORDS', payload: { count: initialWordList.length } });
    },
    selectNextWord: () => {
      dispatch({ type: 'SELECT_NEXT_WORD' });
    },
    setCurrentWord: (word) => {
      dispatch({ type: 'SET_CURRENT_WORD', payload: { word } });
    },
    startTimer: () => {
      dispatch({ type: 'START_TIMER' });
    },
    tick: () => {
      dispatch({ type: 'TIMER_TICK' });
    },
    showMeanings: () => {
      dispatch({ type: 'SHOW_MEANINGS' });
    },
    finalizeAssessment: (knewIt: boolean) => {
      dispatch({ type: 'FINALIZE_ASSESSMENT', payload: { knewIt } });
      if (knewIt) {
        dispatch({ type: 'INCREMENT_KNOWN_WORDS' });
      } else {
        dispatch({ type: 'INCREMENT_UNKNOWN_WORDS' });
      }
    },
    setClientMounted: (mounted: boolean) => {
      dispatch({ type: 'SET_CLIENT_MOUNTED', payload: { mounted } });
    },
    setLoading: (loading: boolean) => {
      dispatch({ type: 'SET_LOADING', payload: { loading } });
    },
    showEndSessionConfirm: (show: boolean) => {
      dispatch({ type: 'SHOW_END_SESSION_CONFIRM', payload: { show } });
    },
    endSession: () => {
      dispatch({ type: 'END_SESSION' });
    },
    resetWordState: () => {
      dispatch({ type: 'RESET_WORD_STATE' });
    },
    setTotalWords: (count: number) => {
      dispatch({ type: 'SET_TOTAL_WORDS', payload: { count } });
    },
    incrementKnownWords: () => {
      dispatch({ type: 'INCREMENT_KNOWN_WORDS' });
    },
    incrementUnknownWords: () => {
      dispatch({ type: 'INCREMENT_UNKNOWN_WORDS' });
    },
  }), [dispatch]);

  useEffect(() => {
    actions.setClientMounted(true);
  }, [actions]);

  const contextValue = useMemo(() => ({
    state,
    actions,
    sessionData,
    updateSessionData,
    resetSessionData,
    srSystem,
  }), [state, actions, sessionData, updateSessionData, resetSessionData, srSystem]);

  return (
    <GameStateContext.Provider value={contextValue}>
      {children}
    </GameStateContext.Provider>
  );
}; 