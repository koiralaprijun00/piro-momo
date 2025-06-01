"use client";

import React from 'react';
// Imports from VocabGameApp.tsx (paths adjusted)
import { GameStateProvider } from "../../components/guess-the-word/context"; 
import { GameHeader } from '../../components/guess-the-word/components/GameHeader'; 
import { GameSetupDialog } from '../../components/guess-the-word/components/GameSetupDialog'; 
import { WordCard } from '../../components/guess-the-word/components/WordCard'; 
import { EndSessionDialog } from '../../components/guess-the-word/components/EndSessionDialog'; 
import { KeyboardNavigationHandler } from '../../components/guess-the-word/components/KeyboardNavigationHandler'; 
import { GameTimerEffect } from '../../components/guess-the-word/components/GameTimerEffect'; 
import { Toaster } from '../../components/guess-the-word/components/ui/toaster'; 
import { useGameState } from '../../components/guess-the-word/context'; 
// Original imports for page.tsx
// Removed: import { VocabGameApp } from "../features/vocab-game/VocabGameApp"; // This will be deleted
import { WordMasterErrorBoundary } from "../../components/guess-the-word/components/WordMasterErrorBoundary";

// Copied AppContent from VocabGameApp.tsx
const AppContent: React.FC = () => {
  const { state, actions } = useGameState();

  return (
    <main className="flex flex-col items-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-blue-950 dark:to-indigo-900 p-4 selection:bg-primary/20 overflow-hidden">
      <GameSetupDialog />
      
      {state.sessionStarted && (
        <div className="w-full max-w-2xl flex flex-col justify-start space-y-8 sm:space-y-8 mt-8">
          <GameHeader />
          <WordCard />
        </div>
      )}
      
      <EndSessionDialog />
      <KeyboardNavigationHandler />
      <GameTimerEffect />
      <Toaster />
    </main>
  );
} 

export default function NepaliWordMasterPage() { 
  return (
    <WordMasterErrorBoundary>
      <GameStateProvider> { /* Added GameStateProvider */}
        <AppContent /> { /* Render AppContent directly */}
      </GameStateProvider>
    </WordMasterErrorBoundary>
  );
} 
