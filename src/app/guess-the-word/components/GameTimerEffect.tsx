"use client";

import { useGameTimer } from '../hooks'; // Corrected path

export const GameTimerEffect: React.FC = () => {
  useGameTimer();
  return null;
}; 