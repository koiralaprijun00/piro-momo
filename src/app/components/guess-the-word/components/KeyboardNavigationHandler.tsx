"use client";

import { useEffect } from 'react';
import { useGameState } from '../context'; // Corrected path
import { useFinalAssessment, useWordSelection } from '../hooks'; // Corrected path

export const KeyboardNavigationHandler: React.FC = () => {
  const { state } = useGameState();
  const finalAssessment = useFinalAssessment();
  const selectNextWord = useWordSelection();

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (state.showEndSessionConfirm) return;
      if (state.meaningsVisible && !state.assessmentDone) {
        if (e.key === 'y' || e.key === 'Y') {
          finalAssessment(true);
        } else if (e.key === 'n' || e.key === 'N') {
          finalAssessment(false);
        }
      }
      else if (e.key === ' ' && !state.isTimerRunning && !state.meaningsVisible && state.assessmentDone && state.sessionStarted) {
        e.preventDefault();
        selectNextWord();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [
    state.meaningsVisible, 
    state.assessmentDone, 
    state.isTimerRunning,
    state.sessionStarted,
    state.showEndSessionConfirm,
    finalAssessment, 
    selectNextWord
  ]);

  return null;
}; 