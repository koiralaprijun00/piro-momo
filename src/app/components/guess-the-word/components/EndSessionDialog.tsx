"use client";

import React from 'react';
import { useGameState } from '../context'; // Corrected path
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog"; // Updated path

export const EndSessionDialog: React.FC = () => { // Renamed component
  const { state, actions, resetSessionData, srSystem } = useGameState();

  const handleEndSession = () => {
    actions.showEndSessionConfirm(false);
    
    resetSessionData({});
    srSystem.resetWordStats();
    
    actions.endSession();
  };

  return (
    <AlertDialog 
      open={state.showEndSessionConfirm} 
      onOpenChange={(open) => actions.showEndSessionConfirm(open)}
    >
      <AlertDialogContent aria-describedby="session-end-description">
        <AlertDialogHeader>
          <AlertDialogTitle>End Current Session?</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription id="session-end-description">
          Are you sure you want to end your current learning session? This will reset all progress and statistics, giving you a completely fresh start for your next session.
        </AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogCancel>Continue Learning</AlertDialogCancel>
          <AlertDialogAction onClick={handleEndSession}>
            End Session
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}; 