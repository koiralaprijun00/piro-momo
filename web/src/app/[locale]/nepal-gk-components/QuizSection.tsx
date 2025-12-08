'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { FiCheck, FiX, FiArrowRight } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { Question } from '../general-knowledge/page';

interface QuizSectionProps {
  currentQuestion: Question;
  isAnswered: boolean;
  handleGuess: (selectedOption: string) => void;
  handleNextQuestion: () => void;
  totalQuestions: number;
  currentIndex: number;
  isLastQuestion?: boolean;
  feedback?: string;
  isCorrect?: boolean;
}

export default function QuizSection({
  currentQuestion,
  isAnswered,
  handleGuess,
  handleNextQuestion,
  totalQuestions,
  currentIndex,
  isLastQuestion = false,
  feedback = "",
  isCorrect = false
}: QuizSectionProps) {
  const t = useTranslations('Translations');
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  const progressPercentage = ((currentIndex + 1) / totalQuestions) * 100;

  useEffect(() => {
    setSelectedOption(null);
  }, [currentQuestion]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleOptionClick = (option: string) => {
    if (!isAnswered) {
      setSelectedOption(option);
      handleGuess(option);
    }
  };

  const safeT = (key: string, defaultValue: string = "") => {
    try {
      return t(key);
    } catch (error) {
      return defaultValue;
    }
  };

  if (!isMounted) {
    return (
      <div className="text-left animate-pulse">
        <div className="mb-8">
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-4" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="text-left max-w-3xl mx-auto">
      {/* Hide the entire quiz section when it's the last question and it's answered */}
      {!(isLastQuestion && isAnswered) ? (
        <>
          {/* Progress bar - simplified animation */}
          <div className="mb-8 flex items-center">
            <span className="text-sm font-medium text-gray-600 mr-3" aria-live="polite">
              {currentIndex + 1} / {totalQuestions}
            </span>
            <div 
              className="w-48 h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner" 
              role="progressbar" 
              aria-valuenow={currentIndex + 1} 
              aria-valuemin={1} 
              aria-valuemax={totalQuestions}
              aria-label={`Question ${currentIndex + 1} of ${totalQuestions}`}
            >
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500 ease-in-out"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {currentQuestion.category && (
            <div className="mb-4">
              <span className="inline-block px-4 py-1.5 text-sm font-medium bg-blue-100 text-blue-800 rounded-full">
                {currentQuestion.category}
              </span>
            </div>
          )}

          {/* Question - with AnimatePresence for transition effects */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="mb-8"
            >
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 leading-snug" data-testid="question-text">
                {currentQuestion.question}
              </h2>
            </motion.div>
          </AnimatePresence>

          {/* Options - with fixed dimensions and reserved space */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 md:mb-24">
            {currentQuestion.options.map((option, index) => {
              const isCorrect = option === currentQuestion.correctAnswer;
              const isSelected = option === selectedOption;
              const showCorrectHighlight = isAnswered && isCorrect;
              const showIncorrectHighlight = isAnswered && isSelected && !isCorrect;

              return (
                <button
                  key={index}
                  data-testid={`option-${index}`}
                  onClick={() => handleOptionClick(option)}
                  disabled={isAnswered}
                  aria-pressed={isSelected}
                  aria-label={`Option ${String.fromCharCode(65 + index)}: ${option}`}
                  className={`relative flex items-center h-16 px-6 py-5 rounded-xl text-left shadow-sm font-medium text-base transition-colors duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    showCorrectHighlight
                      ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-200'
                      : showIncorrectHighlight
                      ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-200'
                      : isAnswered
                      ? 'bg-gray-100 text-gray-500'
                      : 'bg-white text-gray-800 border-2 border-gray-200 hover:border-blue-400 hover:shadow-md'
                  }`}
                >
                  <div className="mr-4 flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-full bg-white bg-opacity-20 shadow-inner">
                    <span className="text-lg" aria-hidden="true">{String.fromCharCode(65 + index)}</span>
                  </div>
                  <span className="flex-grow">{option}</span>

                  {/* Always-present icon container */}
                  <div className="w-7 h-7 flex-shrink-0 flex items-center justify-center">
                    {showCorrectHighlight && (
                      <div className="bg-white bg-opacity-20 rounded-full p-1" aria-hidden="true">
                        <FiCheck className="w-5 h-5 text-white" />
                      </div>
                    )}
                    {showIncorrectHighlight && (
                      <div className="bg-white bg-opacity-20 rounded-full p-1" aria-hidden="true">
                        <FiX className="w-5 h-5 text-white" />
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Bottom Section - Fixed height with pre-rendered elements */}
          {/* Only show the next question button section if it's not the last question */}
          {!isLastQuestion && (
            <div className="h-20 mt-4 flex items-center justify-between gap-4">
              <div className="flex-1 flex items-center">
                {/* Only render feedback when there is actual feedback */}
                {isAnswered && (
                  <div 
                    data-testid="feedback-message"
                    className={`inline-block px-5 py-2.5 rounded-full font-medium transition-opacity duration-200 ${
                      isCorrect ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}
                    role="status"
                    aria-live="polite"
                  >
                    {isCorrect ? feedback : safeT('nepalGk.incorrectFeedback', 'Incorrect. Try again!')}
                  </div>
                )}
              </div>

              <div className="flex-shrink-0">
                <button
                  data-testid="next-question-button"
                  onClick={handleNextQuestion}
                  disabled={!isAnswered}
                  className={`flex items-center px-6 py-3 rounded-full text-white font-medium transition-colors duration-200 ${
                    isAnswered
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md'
                      : 'bg-gray-300 cursor-not-allowed opacity-60'
                  }`}
                  aria-label="Next Question"
                >
                  <span>{safeT('nextQuestion', 'Next Question')}</span>
                  <FiArrowRight className="ml-2" aria-hidden="true" />
                </button>
              </div>
            </div>
          )}
        </>
      ) : null}
    </div>
  );
}