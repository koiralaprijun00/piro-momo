import React from 'react';
import { Clock, Star, Brain, Zap, Play } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import type { WordDifficulty } from '../types';

interface TimerSelectorProps {
  selectedTimer: number;
  onTimerChange: (timer: number) => void;
  selectedDifficulty: WordDifficulty;
  onDifficultyChange: (difficulty: WordDifficulty) => void;
  onStartGame: () => void;
}

const TIMER_OPTIONS = [
  { value: 5, label: '5 सेकेन्ड' },
  { value: 10, label: '10 सेकेन्ड' },
];

const DIFFICULTY_OPTIONS = [
  { 
    value: 'easy' as WordDifficulty, 
    label: 'सजिलो (Easy)', 
    icon: Star
  },
  { 
    value: 'medium' as WordDifficulty, 
    label: 'मध्यम (Medium)', 
    icon: Brain
  },
  { 
    value: 'difficult' as WordDifficulty, 
    label: 'कठिन (Difficult)', 
    icon: Zap
  }
];

export default function TimerSelector({
  selectedTimer,
  onTimerChange,
  selectedDifficulty,
  onDifficultyChange,
  onStartGame
}: TimerSelectorProps) {
  const handleStartGame = () => {
    onStartGame();
  };

  return (
    <div className="max-h-[50vh] overflow-y-auto">
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Choose Settings
          </h2>
          <p className="text-sm text-gray-600">
            Select game mode and time per word
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-600" />
              Game Mode
            </h3>
            <div className="space-y-2">
              {DIFFICULTY_OPTIONS.map((option) => {
                const IconComponent = option.icon;
                return (
                  <div
                    key={option.value}
                    className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedDifficulty === option.value
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                    onClick={() => onDifficultyChange(option.value)}
                  >
                    <div className="flex items-center gap-3">
                      <IconComponent className={`h-4 w-4 ${
                        selectedDifficulty === option.value ? 'text-purple-600' : 'text-gray-500'
                      }`} />
                      <span className="font-medium text-gray-900">{option.label}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              Time Per Word
            </h3>
            <div className="space-y-2">
              {TIMER_OPTIONS.map((option) => (
                <div
                  key={option.value}
                  className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedTimer === option.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                  onClick={() => onTimerChange(option.value)}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">{option.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <Button 
            onClick={handleStartGame} 
            className="w-full bg-green-500 hover:bg-green-600 text-white py-3 text-lg font-semibold flex items-center justify-center gap-2"
            aria-label="Start Learning Session"
          >
            <Play className="h-5 w-5" />
            Start Learning
          </Button>
        </div>
      </div>
    </div>
  );
} 