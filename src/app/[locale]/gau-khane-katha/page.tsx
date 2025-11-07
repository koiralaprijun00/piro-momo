'use client';

import React, { useState, useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { RiddlesData } from '../../data/gau-khane-katha/gau-khane-katha-type';
import { riddlesData } from '../../data/gau-khane-katha/gau-khane-katha-data';
import { ImSpinner8 } from 'react-icons/im';
import { FiSend } from 'react-icons/fi';
import { HiOutlineClock, HiOutlineCheck } from 'react-icons/hi';
import { CheckCircleIcon, XCircleIcon, RefreshCwIcon, Sparkles, Flame } from 'lucide-react';
import AdSenseGoogle from '../../components/AdSenseGoogle';

const StatBadges = ({ score, streak }: { score: number; streak: number }) => (
  <div className="flex items-center justify-center gap-4">
    <div
      className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-white"
      aria-label={`Score ${score}`}
    >
      <Sparkles className="w-4 h-4 text-yellow-300" aria-hidden="true" />
      <span className="font-semibold">{score}</span>
    </div>
    <div
      className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-white"
      aria-label={`Streak ${streak}`}
    >
      <Flame className="w-4 h-4 text-orange-300" aria-hidden="true" />
      <span className="font-semibold">{streak}</span>
    </div>
  </div>
);

export default function RiddlesGamePage() {
  const t = useTranslations('Translations.RiddlesGame');
  const locale = useLocale() as 'en' | 'np';
  const [currentRiddleIndex, setCurrentRiddleIndex] = useState<number>(0);
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [attempts, setAttempts] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [answeredRiddles, setAnsweredRiddles] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [currentShuffledIndex, setCurrentShuffledIndex] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [fullName, setFullName] = useState<string>('');
  const [riddle, setRiddle] = useState<string>('');
  const [showInput, setShowInput] = useState<boolean>(false);
  const [shuffledIndices, setShuffledIndices] = useState<number[]>([]);

  const riddles: RiddlesData = riddlesData;
  const maxAttempts = 3;

  useEffect(() => {
    if (riddles[locale]?.length) {
      const indices = Array.from({ length: riddles[locale].length }, (_, i) => i);
      const shuffled = shuffleArray(indices);
      setShuffledIndices(shuffled);
      setCurrentShuffledIndex(0);
      if (shuffled.length > 0) {
        setCurrentRiddleIndex(shuffled[0]);
      }
    }
  }, [locale, riddles]);

  const shuffleArray = (array: number[]): number[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  useEffect(() => {
    if (riddles[locale] && answeredRiddles.length === riddles[locale].length) {
      setGameOver(true);
    }
  }, [answeredRiddles, locale, riddles]);

  useEffect(() => {
    if (currentRiddleIndex >= riddles[locale]?.length) {
      setCurrentRiddleIndex(0);
      setAnsweredRiddles([]);
      setScore(0);
      setGameOver(false);
    }
  }, [locale, riddles, currentRiddleIndex]);

  const currentRiddle = riddles[locale]?.[currentRiddleIndex];

  const checkAnswer = () => {
    if (!currentRiddle) return;

    const primaryAnswer = currentRiddle.answer.toLowerCase();
    const userAnswerLower = userAnswer.toLowerCase().trim();
    let isCorrect = userAnswerLower === primaryAnswer;

    if (!isCorrect && locale === 'np' && currentRiddle.answerEn) {
      isCorrect = userAnswerLower === currentRiddle.answerEn.toLowerCase();
    }

    if (isCorrect) {
      setIsCorrect(true);
      setScore((prevScore) => prevScore + 1);
      setStreak((prev) => prev + 1);
      setAnsweredRiddles((prev) =>
        prev.includes(currentRiddle.id) ? prev : [...prev, currentRiddle.id]
      );
      setShowAnswer(true);
    } else {
      setIsCorrect(false);
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      if (newAttempts >= maxAttempts) {
        setShowAnswer(true);
        setStreak(0);
      } else {
        setUserAnswer('');
      }
    }
  };

  const nextRiddle = () => {
    if (!isCorrect) {
      setStreak(0);
    }

    setShowAnswer(false);
    setIsCorrect(false);
    setUserAnswer('');
    setAttempts(0);

    if (!shuffledIndices || shuffledIndices.length === 0) {
      setGameOver(true);
      return;
    }

    let foundNextIndex = false;
    let nextShuffledIndex = (currentShuffledIndex + 1) % shuffledIndices.length;
    const startingShuffledIndex = nextShuffledIndex;

    do {
      const candidateRiddleIndex = shuffledIndices[nextShuffledIndex];
      const candidateRiddle = riddles[locale][candidateRiddleIndex];

      if (candidateRiddle && !answeredRiddles.includes(candidateRiddle.id)) {
        setCurrentRiddleIndex(candidateRiddleIndex);
        setCurrentShuffledIndex(nextShuffledIndex);
        foundNextIndex = true;
        break;
      }

      nextShuffledIndex = (nextShuffledIndex + 1) % shuffledIndices.length;
      if (nextShuffledIndex === startingShuffledIndex) {
        break;
      }
    } while (!foundNextIndex);

    if (!foundNextIndex) {
      setGameOver(true);
    }
  };

  const restartGame = () => {
    const indices = Array.from({ length: riddles[locale].length }, (_, i) => i);
    const shuffled = shuffleArray([...indices]);
    setShuffledIndices(shuffled);
    setCurrentShuffledIndex(0);
    setCurrentRiddleIndex(shuffled[0]);
    setUserAnswer('');
    setShowAnswer(false);
    setIsCorrect(false);
    setScore(0);
    setStreak(0);
    setGameOver(false);
    setAnsweredRiddles([]);
    setAttempts(0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await fetch('/api/submit-riddle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, riddle, locale }),
      });
      setIsSubmitting(false);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setShowInput(false);
        setFullName('');
        setRiddle('');
      }, 3000);
    } catch (error) {
      console.error('Submission failed:', error);
      setIsSubmitting(false);
    }
  };

  if (!currentRiddle) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Left AdSense Sidebar */}
        <div className="hidden lg:block w-[160px] sticky top-24 self-start h-[600px] ml-4">
          <div className="w-[160px] h-[600px]">
            <AdSenseGoogle
              adSlot="6865219846"
              adFormat="vertical"
              style={{ width: '160px', height: '400px' }}
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white py-6 sm:py-12">
            <div className="container mx-auto px-3 sm:px-6 lg:px-8 max-w-4xl">
              <div className="bg-gradient-to-br from-blue-600 to-red-500 p-1 rounded-xl shadow-lg mb-6">
                <div className="box-border px-4 py-8 text-white">
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">
                    {t('title')}
                  </h1>
                  <p className="text-base sm:text-lg">
                    {t('subtitle')}
                  </p>
                </div>

                <div className="bg-white rounded-b-lg p-4 sm:p-6">
                  <div className="bg-gradient-to-r from-blue-600 to-red-500 rounded-2xl p-4 mb-6 text-white">
                    <StatBadges score={score} streak={streak} />
                  </div>
                  <div className="flex flex-col sm:flex-row justify-end items-end sm:items-center gap-4">
                    <button
                      onClick={nextRiddle}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg px-3 py-2 text-sm flex items-center transition"
                    >
                      <RefreshCwIcon className="w-3 h-3 mr-2" />
                      {t('nextQuestionButton')}
                    </button>
                  </div>

                  {!gameOver ? (
                    <div>
                      <div className="mt-2 p-8 rounded-2xl shadow-lg border-2 border-indigo-100">
                        <div className="text-xl sm:text-2xl md:text-3xl font-medium text-gray-900 text-center leading-relaxed relative">
                          {currentRiddle.question}
                        </div>
                      </div>

                      {!showAnswer ? (
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            checkAnswer();
                          }}
                          className="space-y-4 sm:space-y-5"
                        >
                          {!showAnswer && (
                            <div className="flex justify-end items-center mt-1 mb-2 p-3 rounded-lg bg-gray-50">
                              <div className="flex items-center text-sm text-gray-600">
                                <span className="font-medium">
                                  {t('attempt') || 'Attempt'}:
                                </span>
                                <span className="ml-2 font-bold text-indigo-600">
                                  {attempts + 1}/{maxAttempts}
                                </span>
                              </div>
                              {attempts > 0 && attempts < maxAttempts && (
                                <div className="ml-3 text-xs text-orange-500">
                                  {attempts === maxAttempts - 1
                                    ? t('incorrectLastAttempt') || 'Incorrect. Last attempt!'
                                    : t('incorrectTryAgain') || 'Incorrect. Try again!'}
                                </div>
                              )}
                            </div>
                          )}

                          <div>
                            <label
                              htmlFor="answer"
                              className="block text-sm font-medium text-gray-700 mb-1"
                            >
                              {t('answerLabel')}
                            </label>
                            <input
                              type="text"
                              id="answer"
                              value={userAnswer}
                              onChange={(e) => setUserAnswer(e.target.value)}
                              className="block w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base transition-colors duration-150"
                              placeholder={t('answerPlaceholder')}
                              aria-label={t('answerLabel')}
                              required
                            />
                            {locale === 'np' && (
                              <div className="mt-2 sm:mt-1 p-4 sm:p-0 bg-blue-50 sm:bg-transparent rounded-md sm:rounded-none border-l-4 sm:border-l-0 border-blue-200 sm:text-right text-sm text-gray-600 sm:text-gray-500 sm:italic">
                                <span className="inline-flex items-center flex-wrap">
                                  {t('answerTip')}
                                </span>
                              </div>
                            )}
                          </div>
                          <button
                            type="submit"
                            className="w-full sm:w-auto inline-flex justify-center py-2 sm:py-3 px-4 sm:px-6 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
                          >
                            {t('submitButton')}
                          </button>
                        </form>
                      ) : (
                        <div className="space-y-4 sm:space-y-5 mt-6">
                          <div
                            className={`p-4 rounded-lg border ${
                              isCorrect
                                ? 'bg-green-50 border-green-300 text-green-800'
                                : 'bg-red-50 border-red-300 text-red-800'
                            } flex items-start gap-3`}
                            role="alert"
                          >
                            {isCorrect ? (
                              <CheckCircleIcon
                                className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5"
                                aria-hidden="true"
                              />
                            ) : (
                              <XCircleIcon
                                className="h-6 w-6 text-red-500 flex-shrink-0 mt-0.5"
                                aria-hidden="true"
                              />
                            )}
                            <div className="flex-grow">
                              <h3 className="font-bold text-lg mb-2 flex items-center">
                                {isCorrect ? (
                                  <span className="flex items-center gap-2 text-green-600 dark:text-green-400">
                                    <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                    {t('correctAnswer')}
                                  </span>
                                ) : (
                                  <span className="text-red-600 dark:text-red-400">
                                    {t('incorrectAnswer')}
                                  </span>
                                )}
                              </h3>
                              <div className="text-sm mt-1 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                                {locale === 'np' && currentRiddle.answerEn ? (
                                  <div className="flex items-baseline">
                                    <span className="font-semibold text-gray-700">
                                      {t('answerReveal')}:
                                    </span>
                                    <span className="ml-2 font-mono text-indigo-600 dark:text-indigo-400">
                                      {currentRiddle.answer},{' '}
                                      <span className="text-blue-600">
                                        {currentRiddle.answerEn}
                                      </span>
                                    </span>
                                  </div>
                                ) : (
                                  <div className="flex items-baseline">
                                    <span className="font-semibold text-gray-700">
                                      {t('answerReveal')}:
                                    </span>
                                    <span className="ml-2 font-mono text-indigo-600 dark:text-indigo-400">
                                      {currentRiddle.answer}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={nextRiddle}
                            className="w-full sm:w-auto inline-flex justify-center py-2 sm:py-3 px-4 sm:px-6 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
                          >
                            {t('nextRiddleButton')}
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center">
                      <h2 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-red-600 mb-4">
                        {t('gameOver')}
                      </h2>
                      <p className="text-base sm:text-lg mb-6 text-gray-700">
                        {t('finalScore', {
                          score: score,
                          total: riddles[locale]?.length || 0,
                        })}
                      </p>
                      {score === (riddles[locale]?.length || 0) ? (
                        <div className="p-4 bg-yellow-50 border border-yellow-300 rounded-lg mb-6 flex items-center justify-center gap-3 text-yellow-800">
                          <CheckCircleIcon
                            className="h-6 w-6 text-yellow-500 flex-shrink-0"
                            aria-hidden="true"
                          />
                          <p className="text-sm font-medium">{t('perfectScore')}</p>
                        </div>
                      ) : (
                        <div className="p-4 bg-blue-50 border border-blue-300 rounded-lg mb-6 text-blue-800">
                          <p className="text-sm">{t('playAgainMessage')}</p>
                        </div>
                      )}
                      <button
                        onClick={restartGame}
                        className="inline-flex items-center justify-center gap-2 py-2 sm:py-3 px-4 sm:px-6 border border-transparent rounded-lg shadow-sm text-sm sm:text-base font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
                      >
                        <RefreshCwIcon className="w-5 h-5" />
                        {t('playAgainButton')}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <h3 className="font-medium text-yellow-800 mb-2">
                  {t('submitYourOwn') || 'Have a great riddle idea?'}
                </h3>
                <p className="text-sm text-yellow-700 mb-3">
                  {t('submitDescription') ||
                    'Submit your own riddles for possible inclusion in the game!'}
                </p>
                {showInput ? (
                  submitted ? (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded-md flex items-center">
                      <HiOutlineCheck className="w-5 h-5 mr-2" />
                      <p className="font-medium">
                        {t('thankYou') || 'Thank you! Your riddle has been submitted.'}
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-3">
                      <div>
                        <label
                          htmlFor="fullName"
                          className="block text-sm font-medium text-yellow-800 mb-1"
                        >
                          {t('fullName') || 'Your Full Name'}
                        </label>
                        <input
                          type="text"
                          id="fullName"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder={t('fullNamePlaceholder') || 'Enter your name...'}
                          className="w-full border border-yellow-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                          disabled={isSubmitting}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="riddleInput"
                          className="block text-sm font-medium text-yellow-800 mb-1"
                        >
                          {t('yourRiddle') || 'Your Riddle'}
                        </label>
                        <textarea
                          id="riddleInput"
                          value={riddle}
                          onChange={(e) => setRiddle(e.target.value)}
                          placeholder={t('riddlePlaceholder') || 'Enter your riddle...'}
                          className="w-full border border-yellow-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                          disabled={isSubmitting}
                          rows={3}
                        />
                      </div>
                      <div className="flex justify-end">
                        <button
                          type="submit"
                          disabled={isSubmitting || !riddle.trim() || !fullName.trim()}
                          className={`inline-flex items-center px-4 py-2 bg-yellow-600 text-white text-sm font-medium rounded hover:bg-yellow-700 transition ${
                            isSubmitting || !riddle.trim() || !fullName.trim()
                              ? 'opacity-70 cursor-not-allowed'
                              : ''
                          }`}
                        >
                          {isSubmitting ? (
                            <>
                              <ImSpinner8 className="animate-spin mr-2 h-4 w-4" />
                              {t('submitting') || 'Submitting...'}
                            </>
                          ) : (
                            <>
                              <FiSend className="mr-2" />
                              {t('submitRiddleButton') || 'Submit Riddle'}
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  )
                ) : (
                  <button
                    onClick={() => setShowInput(true)}
                    className="inline-flex items-center px-3 py-2 bg-yellow-600 text-white text-sm font-medium rounded hover:bg-yellow-700 transition"
                  >
                    <FiSend className="mr-2" />
                    {t('submitRiddleButton') || 'Submit Riddle'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right AdSense Sidebar */}
        <div className="hidden lg:block w-[160px] sticky top-24 self-start h-[600px] mr-4">
          <div className="w-[160px] h-[600px]">
            <AdSenseGoogle 
              adSlot="9978468343"
              adFormat="vertical"
              style={{ width: '160px', height: '400px' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
