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

    actions.endSession();
  };

  return (
    <AlertDialog 
      open={state.showEndSessionConfirm} 
      onOpenChange={(open) => actions.showEndSessionConfirm(open)}
    >
      <AlertDialogContent 
        aria-describedby="session-end-description"
        style={{
          background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)',
          borderRadius: 16,
          padding: 32,
          boxShadow: '0 8px 32px rgba(31, 41, 55, 0.15)',
          border: 'none',
          minWidth: 380,
          maxWidth: 420,
        }}
      >
        <AlertDialogHeader>
          <AlertDialogTitle style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            color: '#1e293b',
            marginBottom: 8,
          }}>
            End Current Session?
          </AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription id="session-end-description" style={{
          color: '#475569',
          fontSize: '1rem',
          marginBottom: 24,
        }}>
          Are you sure you want to end your current learning session? This will reset all progress and statistics, giving you a completely fresh start for your next session.
        </AlertDialogDescription>
        <AlertDialogFooter style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 16 }}>
          <AlertDialogCancel style={{
            background: '#f1f5f9',
            color: '#334155',
            border: 'none',
            borderRadius: 8,
            padding: '0.5rem 1.25rem',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'background 0.2s',
          }}>
            Continue Learning
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleEndSession}
            style={{
              background: 'linear-gradient(90deg, #f87171 0%, #fbbf24 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '0.5rem 1.25rem',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(251, 191, 36, 0.08)',
              transition: 'background 0.2s',
            }}
          >
            End Session
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}; 