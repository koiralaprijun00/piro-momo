"use client";

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useGameState } from '../context'; // Corrected path
import { useWordSelection } from '../hooks'; // Corrected path
import TimerSelector from './TimerSelector'; // Updated path
import { Dialog, DialogContentNoClose, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog'; // Updated path
import type { WordDifficulty } from '../types'; // Corrected path

export const GameSetupDialog: React.FC = () => { // Renamed component
  const { state, actions, resetSessionData } = useGameState();
  const selectNextWord = useWordSelection();

  // State for TimerSelector
  const [selectedTimer, setSelectedTimer] = useState<number>(10); // Default value
  const [selectedDifficulty, setSelectedDifficulty] = useState<WordDifficulty>('medium'); // Default value

  const gameSettingsRef = useRef<{ timerDuration: number, difficulty: WordDifficulty } | null>(null);

  const handleConfirmSettingsAndStart = useCallback(() => {
    gameSettingsRef.current = { timerDuration: selectedTimer, difficulty: selectedDifficulty };
    actions.startSession(selectedTimer, selectedDifficulty);
    resetSessionData({});
  }, [selectedTimer, selectedDifficulty, actions, resetSessionData]);

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
      open={!state.sessionStarted} 
      onOpenChange={() => {}} // Prevents closing via X or overlay click
    >
      <DialogContentNoClose 
        style={{
          maxWidth: 500,
          background: 'linear-gradient(to bottom right, #3b82f6, #a21caf, #f472b6)',
          borderRadius: 16,
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
          padding: 8,
          border: 0,
        }}
        aria-describedby="game-setup-description"
      >
        <div style={{
          background: '#fff',
          borderRadius: 6,
          padding: 32,
          borderWidth: 1,
          borderStyle: 'solid',
          borderColor: '#e5e7eb',
        }}>
          <DialogHeader>
            <DialogTitle style={{
              fontSize: '1.5rem',
              lineHeight: '2rem',
              fontWeight: 700,
              color: '#111827',
              marginBottom: '0.5rem',
            }}>
              Jhole Nepali Shabda
            </DialogTitle>
          </DialogHeader>
          <div style={{
            marginBottom: '1.5rem',
            textAlign: 'left',
            fontSize: '1rem',
            lineHeight: 1.625,
            color: '#374151',
          }}>
            <p>
              यो खेलमा रमाइलो गर्दै नेपाली शब्दहरू सिकौं।<br />
              हरेक शब्दको अर्थ बुझ्न प्रयास गरौं, साथीहरूलाई जितौं।<br />
            </p>
            <p style={{
              marginTop: '0.75rem',
              fontSize: '0.875rem',
              lineHeight: '1.25rem',
              color: '#6b7280',
            }}>
              Let&apos;s have fun and learn Nepali words together!<br />
              Try to guess the meaning of each word and beat your friends.<br />
            </p>
          </div>
          <DialogDescription id="game-setup-description" style={{
            position: 'absolute',
            width: 1,
            height: 1,
            padding: 0,
            margin: -1,
            overflow: 'hidden',
            clip: 'rect(0,0,0,0)',
            whiteSpace: 'nowrap',
            borderWidth: 0,
          }}>
            Game setup modal to select difficulty and timer duration before starting a learning session.
          </DialogDescription>
          <TimerSelector
            selectedTimer={selectedTimer}
            onTimerChange={setSelectedTimer}
            selectedDifficulty={selectedDifficulty}
            onDifficultyChange={setSelectedDifficulty}
            onStartGame={handleConfirmSettingsAndStart} 
          />
        </div>
      </DialogContentNoClose>
    </Dialog>
  );
}; 
