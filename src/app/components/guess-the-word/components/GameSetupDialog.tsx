"use client";

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useGameState } from '../context'; // Corrected path
import { useWordSelection } from '../hooks'; // Corrected path
import TimerSelector from './TimerSelector'; // Updated path
import { Dialog, DialogContentNoClose, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog'; // Updated path
import type { WordDifficulty } from '../types'; // Corrected path

export const GameSetupDialog: React.FC = () => { // Renamed component
  const { state, actions, resetSessionData, srSystem } = useGameState();
  const selectNextWord = useWordSelection();

  // State for TimerSelector
  const [selectedTimer, setSelectedTimer] = useState<number>(10); // Default value
  const [selectedDifficulty, setSelectedDifficulty] = useState<WordDifficulty>('medium'); // Default value

  const gameSettingsRef = useRef<{ timerDuration: number, difficulty: WordDifficulty } | null>(null);

  const handleConfirmSettingsAndStart = useCallback(() => {
    gameSettingsRef.current = { timerDuration: selectedTimer, difficulty: selectedDifficulty };
    actions.startSession(selectedTimer, selectedDifficulty);
    resetSessionData({}); 
    srSystem.resetWordStats();
  }, [selectedTimer, selectedDifficulty, actions, resetSessionData, srSystem]);

  useEffect(() => {
    if (state.sessionStarted && gameSettingsRef.current) {
      // const { timerDuration } = gameSettingsRef.current; // Not needed for selectNextWord
      setTimeout(() => {
        selectNextWord();
      }, 0);
      gameSettingsRef.current = null;
    }
  }, [state.sessionStarted, selectNextWord, actions]);

  // Effect for Enter key listener
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Enter' && !state.sessionStarted) {
        event.preventDefault();
        handleConfirmSettingsAndStart();
      }
    };
    if (!state.sessionStarted) { // Only add listener if dialog is open
      window.addEventListener('keydown', handleKeyPress);
      return () => {
        window.removeEventListener('keydown', handleKeyPress);
      };
    }
  }, [state.sessionStarted, handleConfirmSettingsAndStart]); // Ensure handleConfirmSettingsAndStart is stable or in deps

  return (
    <Dialog
      open={!state.sessionStarted && !state.showEndSessionConfirm}
      onOpenChange={() => {}}
    >
      <DialogContentNoClose className="sm:max-w-[480px] game-setup-dialog-content bg-white">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="dialog-title-jhole-gradient">
            Jhole Nepali Shabda
          </DialogTitle>
          <DialogDescription className="text-center text-sm text-slate-600">
            Game setup modal to select difficulty and timer duration before starting a learning session.
          </DialogDescription>
        </DialogHeader>
        <TimerSelector 
          selectedTimer={selectedTimer}
          onTimerChange={setSelectedTimer}
          selectedDifficulty={selectedDifficulty}
          onDifficultyChange={setSelectedDifficulty}
          onStartGame={handleConfirmSettingsAndStart} 
        />
      </DialogContentNoClose>
    </Dialog>
  );
}; 