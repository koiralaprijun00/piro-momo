import React from 'react';
import Image from 'next/image';
import { Logo } from '@/app/data/logo-quiz/getLogos';

interface LogoCardProps {
  logo: Logo;
  answer: string;
  isCorrect: boolean;
  attemptCount: number;
  maxAttempts: number;
  isFocused: boolean;
  onInputChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onFocus: () => void;
  placeholder: string;
}

const LogoCard: React.FC<LogoCardProps> = ({
  logo,
  answer,
  isCorrect,
  attemptCount,
  maxAttempts,
  isFocused,
  onInputChange,
  onKeyDown,
  onFocus,
  placeholder,
}) => {
  const getBlurClass = () => {
    if (isCorrect || attemptCount >= 3) return 'blur-0';
    switch (attemptCount) {
      case 0: return 'blur-xl';
      case 1: return 'blur-lg';
      case 2: return 'blur-md';
      default: return 'blur-0';
    }
  };

  return (
    <div
      className={`relative p-3 rounded-lg border-2 hover:shadow-md transition-all flex flex-col ${
        isCorrect
          ? 'border-green-500 bg-green-50'
          : answer.trim()
          ? 'border-yellow-300 bg-yellow-50'
          : 'border-gray-200 bg-white'
      } ${isFocused ? 'ring-2 ring-blue-500' : ''}`}
    >
      <div
        className="relative h-24 sm:h-36 flex items-center justify-center mb-2 cursor-pointer flex-shrink-0"
        onClick={onFocus}
      >
        <Image
          src={logo.imagePath}
          alt="Mystery Logo"
          fill
          className={`object-contain transition duration-300 ${getBlurClass()}`}
          sizes="(max-width: 640px) 50vw, 33vw"
        />
      </div>

      <div className="mt-auto">
        <input
          type="text"
          autoComplete="off"
          inputMode="text"
          value={answer}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={onKeyDown}
          data-logo-id={logo.id}
          placeholder={placeholder}
          className={`w-full p-2 text-base sm:text-sm border rounded-md ${
            isCorrect
              ? 'border-green-500 bg-green-50 text-green-700'
              : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
          } ${attemptCount >= 3 && !isCorrect ? 'bg-red-50 border-red-200 text-red-700' : ''}`}
          disabled={isCorrect || attemptCount >= 3}
        />
      </div>

      {isCorrect && (
        <div className="absolute top-1 right-1 bg-green-500 text-white rounded-full p-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
      )}

      {!isCorrect && attemptCount > 0 && (
        <div className="absolute top-1 right-1 bg-gray-100 text-gray-600 text-xs rounded-full px-2 py-1">
          {attemptCount}/{maxAttempts}
        </div>
      )}
    </div>
  );
};

export default LogoCard;
