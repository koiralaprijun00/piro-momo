import React from 'react';
import { FiClock, FiPause, FiPlay } from 'react-icons/fi';

interface GameHeaderProps {
  score: number;
  total: number;
  timeLeft: string;
  isTimeLow: boolean;
  timerActive: boolean;
  onToggleTimer: () => void;
  currentPage: number;
  totalPages: number;
  translations: {
    score: string;
    page: string;
    of: string;
  };
}

const GameHeader: React.FC<GameHeaderProps> = ({
  score,
  total,
  timeLeft,
  isTimeLow,
  timerActive,
  onToggleTimer,
  currentPage,
  totalPages,
  translations,
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 sm:justify-between sm:items-center mb-4 shrink-0">
      <div className="flex justify-between items-center">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg px-3 py-1.5 sm:px-4 sm:py-2 flex items-center">
          <span className="text-xs sm:text-sm text-gray-600 mr-2">{translations.score}:</span>
          <span className="text-lg sm:text-xl font-bold text-blue-700">{score}/{total}</span>
        </div>
        
        <div className="text-sm text-gray-600 font-medium ml-4">
          {translations.page} {currentPage + 1} {translations.of} {totalPages}
        </div>
      </div>
      
      <div className="flex items-center gap-2 self-end sm:self-auto">
        <div className={`rounded-lg px-3 py-1.5 sm:px-4 sm:py-2 flex items-center ${
          isTimeLow ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
        }`}>
          <FiClock className={`mr-1 sm:mr-2 ${isTimeLow && 'animate-pulse'}`} />
          <span className="font-mono font-bold text-sm sm:text-base">{timeLeft}</span>
        </div>
        <button
          onClick={onToggleTimer}
          className="bg-gray-100 p-1.5 sm:p-2 rounded-lg hover:bg-gray-200"
          type="button"
        >
          {timerActive ? <FiPause className="h-5 w-5" /> : <FiPlay className="h-5 w-5" />}
        </button>
      </div>
    </div>
  );
};

export default GameHeader;
