"use client";

import React from "react";
import { useGameState } from "../context";
import { Progress } from "./ui/progress";
import { Clock } from "lucide-react";
import { Button } from "./ui/button";

export const GameHeader: React.FC = () => {
  const { state, actions } = useGameState();
  const { knownWords, unknownWords, totalWords, sessionStarted, timerDuration, difficulty } = state;

  if (!sessionStarted) {
    return null;
  }

  const wordsProcessed = knownWords + unknownWords;
  const progressPercentage = totalWords > 0 ? (wordsProcessed / totalWords) * 100 : 0;

  return (
    <div className="w-full max-w-2xl p-4 bg-slate-50 rounded-lg shadow-md flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-x-4 gap-y-3">
        <h1 className="font-english jhole-title-gradient">
          Jhole Nepali Shabda
        </h1>
        <div className="flex flex-col items-center gap-x-4 gap-y-2 sm:flex-row sm:gap-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span className="font-medium uppercase tracking-wide">Time:</span>
            <span className="font-semibold">{timerDuration}s</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="font-medium uppercase tracking-wide">Mode:</span>
            <span className="font-semibold capitalize">{difficulty}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-grow">
          {totalWords > 0 && (
            <div className="w-full">
              <div className="flex justify-between items-center mb-2 text-sm font-medium">
                <span className="text-blue-600">
                  Progress: {wordsProcessed} / {totalWords}
                </span>
                <div className="space-x-2">
                  <span className="text-green-600">Known: {knownWords}</span>
                  <span className="text-red-600">Unknown: {unknownWords}</span>
                </div>
              </div>
              <Progress value={progressPercentage} className="w-full h-3" />
            </div>
          )}
        </div>
        <div className="flex-shrink-0">
          <Button variant="outline" onClick={() => actions.showEndSessionConfirm(true)}>
            Restart Game
          </Button>
        </div>
      </div>
    </div>
  );
};