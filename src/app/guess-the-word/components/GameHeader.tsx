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
    <div className="w-full max-w-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-400 rounded-2xl shadow-2xl p-1">
      <div className="bg-gradient-to-br from-blue-500 via-purple-500 to-pink-400 rounded-xl p-6 flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-x-4 gap-y-3">
          <h1 className="text-2xl font-bold text-white text-left mb-2">
            Jhole Nepali Shabda
          </h1>
          <div className="flex flex-col items-start gap-x-4 gap-y-2 sm:flex-row sm:gap-3">
            <div className="flex items-center gap-2 text-xs text-white">
              <Clock className="w-4 h-4" />
              <span className="font-medium uppercase tracking-wide">Time:</span>
              <span className="font-semibold">{timerDuration}s</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-white">
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
                  <span className="text-white">
                    Progress: {wordsProcessed} / {totalWords}
                  </span>
                  <div className="space-x-2">
                    <span className="text-green-100">Known: {knownWords}</span>
                    <span className="text-red-200">Unknown: {unknownWords}</span>
                  </div>
                </div>
                <Progress value={progressPercentage} className="w-full h-3" />
              </div>
            )}
          </div>
          <div className="flex-shrink-0">
            <Button 
              className="bg-white/20 text-white border border-white/30 font-semibold px-6 py-2 rounded-md shadow-sm hover:bg-white/30 transition-colors"
              onClick={() => actions.showEndSessionConfirm(true)}
            >
              Restart Game
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};