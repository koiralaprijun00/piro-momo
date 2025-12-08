'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import GameButton from '@/components/ui/GameButton';
import { getLogosByLocale } from '../../data/logo-quiz/getLogos';
import { FiShare2, FiClock, FiChevronLeft, FiChevronRight, FiPause, FiPlay } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { HiInformationCircle } from 'react-icons/hi';
import AdSenseGoogle from '@/components/AdSenseGoogle';
import Image from 'next/image';

interface Logo {
  id: string;
  name: string;
  imagePath: string;
  category: string;
  difficulty: string;
  acceptableAnswers?: string[];
}

interface GameState {
  answers: Record<string, string>;
  correctAnswers: Record<string, boolean>;
  score: number;
  timeLeft: number;
  currentPage: number;
  timerActive: boolean;
  blurLevels: Record<string, number>;
  attemptCounts: Record<string, number>;
}

const LogoQuizGame = () => {
  const [logos, setLogos] = useState<Logo[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [correctAnswers, setCorrectAnswers] = useState<Record<string, boolean>>({});
  const [currentFocusedLogo, setCurrentFocusedLogo] = useState<string | null>(null);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(300);
  const [timerActive, setTimerActive] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [feedback, setFeedback] = useState<Record<string, string>>({});
  const [blurLevels, setBlurLevels] = useState<Record<string, number>>({});
  const [attemptCounts, setAttemptCounts] = useState<Record<string, number>>({});
  
  // Adjust logos per page based on screen size
  const [logosPerPage, setLogosPerPage] = useState(6);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const t = useTranslations('Translations');
  const locale = useLocale();

  const MAX_BLUR_LEVEL = 4;
  const MIN_BLUR_LEVEL = 0;
  const MAX_ATTEMPTS = 3;

  // Handle timer completion - Moved up and wrapped in useCallback
  const handleTimeUp = useCallback(() => {
    setTimerActive(false);
    setShowResults(true);
    let finalScore = 0;
    Object.values(correctAnswers).forEach(isCorrect => {
      if (isCorrect) finalScore++;
    });
    setScore(finalScore);
  }, [correctAnswers]);

  // Load saved progress from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('logoQuizState');
    if (savedState) {
      const parsedState: GameState = JSON.parse(savedState);
      setAnswers(parsedState.answers);
      setCorrectAnswers(parsedState.correctAnswers);
      setScore(parsedState.score);
      setTimeLeft(parsedState.timeLeft);
      setCurrentPage(parsedState.currentPage);
      setTimerActive(parsedState.timerActive);
      if (parsedState.blurLevels) {
        setBlurLevels(parsedState.blurLevels);
      }
      if (parsedState.attemptCounts) {
        setAttemptCounts(parsedState.attemptCounts);
      }
    }

    // Adjust logos per page based on screen width
    const handleResize = () => {
      if (window.innerWidth < 640) { // Mobile
        setLogosPerPage(3);
      } else if (window.innerWidth < 1024) { // Tablet
        setLogosPerPage(4);
      } else { // Desktop
        setLogosPerPage(6);
      }
    };

    // Set initial value
    handleResize();

    // Add resize listener
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Save progress to localStorage
  useEffect(() => {
    const gameState: GameState = {
      answers,
      correctAnswers,
      score,
      timeLeft,
      currentPage,
      timerActive,
      blurLevels,
      attemptCounts
    };
    localStorage.setItem('logoQuizState', JSON.stringify(gameState));
  }, [answers, correctAnswers, score, timeLeft, currentPage, timerActive, blurLevels, attemptCounts]);

  // Initialize game with logos
  useEffect(() => {
    const logoData = getLogosByLocale(locale);
    if (logoData.length > 0) {
      const shuffled = [...logoData].sort(() => 0.5 - Math.random());
      
      setLogos(shuffled);
      setTotalPages(Math.ceil(shuffled.length / logosPerPage));
      
      const initialAnswers: Record<string, string> = {};
      const initialFeedback: Record<string, string> = {};
      const initialBlurLevels: Record<string, number> = {};
      const initialAttemptCounts: Record<string, number> = {};
      
      shuffled.forEach(logo => {
        initialAnswers[logo.id] = answers[logo.id] || '';
        initialFeedback[logo.id] = '';
        initialBlurLevels[logo.id] = blurLevels[logo.id] !== undefined 
          ? blurLevels[logo.id] 
          : MAX_BLUR_LEVEL;
        initialAttemptCounts[logo.id] = attemptCounts[logo.id] || 0;
      });
      
      setAnswers(prev => ({ ...prev, ...initialAnswers }));
      setFeedback(prev => ({ ...prev, ...initialFeedback }));
      setBlurLevels(initialBlurLevels);
      setAttemptCounts(prev => ({ ...prev, ...initialAttemptCounts }));
      
      const initialCorrectAnswers: Record<string, boolean> = {};
      shuffled.forEach(logo => {
        initialCorrectAnswers[logo.id] = correctAnswers[logo.id] || false;
      });
      setCorrectAnswers(prev => ({ ...prev, ...initialCorrectAnswers }));
    }
  }, [locale, logosPerPage, answers, blurLevels, attemptCounts, correctAnswers]);

  // Update total pages when logosPerPage changes
  useEffect(() => {
    if (logos.length > 0) {
      setTotalPages(Math.ceil(logos.length / logosPerPage));
      // Make sure current page is valid with new page count
      if (currentPage >= Math.ceil(logos.length / logosPerPage)) {
        setCurrentPage(Math.ceil(logos.length / logosPerPage) - 1);
      }
    }
  }, [logosPerPage, logos.length, currentPage]);

  // Timer effect
  useEffect(() => {
    if (timerActive && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && timerActive) {
      handleTimeUp();
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [timeLeft, timerActive, handleTimeUp]);

  // Toggle timer pause/resume
  const toggleTimer = () => {
    setTimerActive(prev => !prev);
  };

  // Handle input change for a specific logo
  const handleInputChange = (logoId: string, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [logoId]: value
    }));
    setFeedback(prev => ({
      ...prev,
      [logoId]: ''
    }));
  };

  // Check answer for a specific logo
  const checkAnswer = (logoId: string) => {
    const logo = logos.find(l => l.id === logoId);
    if (!logo) return;
    
    const userAnswer = answers[logoId].trim();
    if (!userAnswer) return; // Silently return if the answer is empty, no feedback
    
    const isCorrect = logo.acceptableAnswers?.some(
      answer => answer.toLowerCase() === userAnswer.toLowerCase()
    ) || logo.name.toLowerCase() === userAnswer.toLowerCase();
    
    setCorrectAnswers(prev => ({
      ...prev,
      [logoId]: isCorrect
    }));
    
    if (isCorrect && !correctAnswers[logoId]) {
      setScore(prev => prev + 1);
      // Set blur to 0 when correct
      setBlurLevels(prev => ({
        ...prev,
        [logoId]: 0
      }));
      setFeedback(prev => ({
        ...prev,
        [logoId]: t('logoQuiz.correct') || 'Correct!'
      }));
    } else if (!isCorrect) {
      // Increment attempt count
      const currentAttempts = (attemptCounts[logoId] || 0) + 1;
      setAttemptCounts(prev => ({
        ...prev,
        [logoId]: currentAttempts
      }));
      
      // Update blur level in state for reference (though we'll mostly use attemptCounts)
      const newBlurLevel = Math.max(MAX_BLUR_LEVEL - currentAttempts, 0);
      
      setBlurLevels(prev => ({
        ...prev,
        [logoId]: newBlurLevel
      }));
      
      // Determine feedback message
      let feedbackMessage = t('logoQuiz.incorrect') || 'Incorrect. Try again!';
      
      if (currentAttempts === 1) {
        feedbackMessage += ' ' + (t('logoQuiz.imageGettingClearer') || 'Image is getting clearer.');
      } else if (currentAttempts === 2) {
        feedbackMessage += ' ' + (t('logoQuiz.imageClearNow') || 'Image is clear now.');
      }
      
      setFeedback(prev => ({
        ...prev,
        [logoId]: feedbackMessage
      }));
    }
  };

  // Handle Enter key press
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, logoId: string) => {
    if (e.key === 'Enter' || e.key === 'ArrowRight') {
      e.preventDefault();
      
      // First check the answer
      checkAnswer(logoId);
      
      // Then re-focus on the same input using a more reliable selector
      setTimeout(() => {
        const inputElement = document.querySelector(`input[data-logo-id="${logoId}"]`) as HTMLInputElement;
        if (inputElement && typeof inputElement.focus === 'function') {
          // Prevent scrolling when focusing
          inputElement.focus({preventScroll: true});
        }
      }, 50); // Longer timeout for mobile browsers
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let finalScore = 0;
    Object.values(correctAnswers).forEach(isCorrect => {
      if (isCorrect) finalScore++;
    });
    
    setScore(finalScore);
    setShowResults(true);
    setTimerActive(false);
  };

  // Reset the game
  const resetGame = () => {
    const logoData = getLogosByLocale(locale);
    const shuffled = [...logoData].sort(() => 0.5 - Math.random());
    
    setLogos(shuffled);
    setTotalPages(Math.ceil(shuffled.length / logosPerPage));
    setCurrentPage(0);
    
    const initialAnswers: Record<string, string> = {};
    const initialFeedback: Record<string, string> = {};
    const initialBlurLevels: Record<string, number> = {};
    const initialAttemptCounts: Record<string, number> = {};
    
    shuffled.forEach(logo => {
      initialAnswers[logo.id] = '';
      initialFeedback[logo.id] = '';
      initialBlurLevels[logo.id] = MAX_BLUR_LEVEL; // Reset blur levels
      initialAttemptCounts[logo.id] = 0; // Reset attempt counts
    });
    
    setAnswers(initialAnswers);
    setFeedback(initialFeedback);
    setBlurLevels(initialBlurLevels);
    setAttemptCounts(initialAttemptCounts);
    
    const initialCorrectAnswers: Record<string, boolean> = {};
    shuffled.forEach(logo => {
      initialCorrectAnswers[logo.id] = false;
    });
    setCorrectAnswers(initialCorrectAnswers);
    
    setScore(0);
    setShowResults(false);
    setCurrentFocusedLogo(null);
    setTimeLeft(300);
    setTimerActive(true);
    localStorage.removeItem('logoQuizState');
  };

  // Share score
  const handleShareScore = () => {
    const totalLogos = logos.length;
    const shareText = `I identified ${score} out of ${totalLogos} logos in the Nepal Logo Quiz in ${formatTimeForDisplay(300 - timeLeft)}! Can you beat my score?`;
    
    if (navigator.share) {
      navigator.share({
        title: 'My Logo Quiz Score',
        text: shareText,
        url: window.location.href
      }).catch(err => console.error('Error sharing:', err));
    } else {
      navigator.clipboard.writeText(shareText).then(() => {
        alert('Score copied to clipboard!');
      });
    }
  };

  // Focus on a specific logo
  const focusLogo = (logoId: string) => {
    setCurrentFocusedLogo(currentFocusedLogo === logoId ? null : logoId);
  };

  // Format time for display (MM:SS)
  const formatTimeForDisplay = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  // Next page of logos
  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(prev => prev + 1);
    }
  };

  // Previous page of logos
  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    }
  };

  // Get current page logos
  const getCurrentPageLogos = () => {
    const startIndex = currentPage * logosPerPage;
    return logos.slice(startIndex, startIndex + logosPerPage);
  };

  // Get blur style for a logo based on attempt count
  const getBlurStyle = (logoId: string) => {
    if (correctAnswers[logoId]) return 'blur-0'; // No blur when correct
    
    // Calculate blur based on attempts
    const currentAttempts = attemptCounts[logoId] || 0;
    
    // If all attempts used, no blur
    if (currentAttempts >= MAX_ATTEMPTS) return 'blur-0';
    
    // New blur progression:
    switch (currentAttempts) {
      case 0: return 'blur-md'; // Initial state - medium blur
      case 1: return 'blur-sm'; // After 1 wrong attempt - slight blur
      case 2: return 'blur-0';  // After 2 wrong attempts - clear
      default: return 'blur-0'; // After 3 wrong attempts - clear
    }
  };

  // Render results
  if (showResults) {
    const percentCorrect = Math.round((score / logos.length) * 100);
    const timeUsed = 300 - timeLeft;
    
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
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-center flex-grow overflow-y-auto">
                {/* Keep title consistent on results page */}
                <h1 className="text-left text-2xl sm:text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-red-500">
                  {t('logoQuiz.title')}
                </h1>
                
                <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-800">
                  {t('logoQuiz.finalScore') || 'Your Final Score'}
                </h2>
                <div className="text-4xl sm:text-5xl font-bold mb-2 text-blue-600">{score}/{logos.length}</div>
                <p className="text-lg sm:text-xl mb-2 text-gray-700">
                  {percentCorrect}% Accuracy
                </p>
                <p className="text-md mb-6 text-gray-500">
                  Time Used: {formatTimeForDisplay(timeUsed)}
                </p>
                
                <div className="flex flex-col sm:flex-row justify-center gap-3 mb-8">
                  <GameButton onClick={resetGame} type="primary" className="py-3 text-base">
                    {t('logoQuiz.playAgain') || 'Play Again'}
                  </GameButton>
                  <GameButton onClick={handleShareScore} type="success" className="flex items-center justify-center py-3 text-base">
                    <FiShare2 className="mr-2" />
                    {t('logoQuiz.shareScore') || 'Share Score'}
                  </GameButton>
                </div>
                
                <div className="max-w-5xl mx-auto bg-gray-50 rounded-lg p-4 sm:p-6">
                  <h3 className="font-bold mb-4 sm:mb-6 text-lg sm:text-xl">Results Breakdown</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                    {logos.map((logo) => (
                      <motion.div 
                        key={logo.id} 
                        className={`p-3 sm:p-4 rounded-lg border-2 ${
                          correctAnswers[logo.id] 
                            ? 'border-green-500 bg-green-50' 
                            : 'border-red-500 bg-red-50'
                        }`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="flex items-center mb-2">
                          <div className="relative w-8 h-8 sm:w-10 sm:h-10 mr-2 sm:mr-3 flex-shrink-0">
                            <Image 
                              src={logo.imagePath} 
                              alt={logo.name} 
                              fill
                              className="object-contain"
                              sizes="40px"
                            />
                          </div>
                          <div>
                            <div className="font-medium text-sm sm:text-base">
                              {logo.name}
                            </div>
                            <div className="text-xs sm:text-sm text-gray-600">
                              {correctAnswers[logo.id] 
                                ? <span className="text-green-600">✓ Correct</span> 
                                : <span className="text-red-600">✗ Incorrect</span>}
                            </div>
                          </div>
                        </div>
                        <div className="text-xs sm:text-sm">
                          <div><strong>Your answer:</strong> {answers[logo.id] || '(No answer)'}</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
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

  // Render main game interface 
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
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="bg-white rounded-xl p-3 sm:p-6 min-h-[90vh] max-w-6xl mx-auto flex flex-col">
              {/* Title and Subheading */}
              <div className="text-left mb-4 sm:mb-6">
                <h1 className="inline text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-red-500">
                  {t('logoQuiz.title')}
                </h1>
                <p className="text-sm sm:text-base text-gray-600 mt-2">
                  {t('logoQuiz.subtitle') || "Test your brand knowledge! Guess the logos and beat the clock."}
                </p>
              </div>
              
              {/* Game Info Banner */}
              <div className="bg-blue-50 p-2 sm:p-3 rounded-lg mb-4 text-xs sm:text-sm text-blue-700 inline-flex items-start sm:items-center">
                <HiInformationCircle className="inline h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2 mt-0.5 sm:mt-0 flex-shrink-0" />
                <span className="inline">{t('logoQuiz.proTip') || "Pro Tip: Images gradually become clearer with each incorrect guess and fully reveal after 5 attempts!"}</span>
              </div>
              
              {/* Header Bar - Mobile optimized with stacking layout */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 sm:justify-between sm:items-center mb-4 shrink-0">
                <div className="flex justify-between items-center">
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg px-3 py-1.5 sm:px-4 sm:py-2 flex items-center">
                    <span className="text-xs sm:text-sm text-gray-600 mr-2">{t('logoQuiz.score') || 'Score'}:</span>
                    <span className="text-lg sm:text-xl font-bold text-blue-700">{score}/{logos.length}</span>
                  </div>
                  
                  <div className="text-sm text-gray-600 font-medium ml-4">
                    Page {currentPage + 1} of {totalPages}
                  </div>
                </div>
                
                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <div className={`rounded-lg px-3 py-1.5 sm:px-4 sm:py-2 flex items-center ${
                    timeLeft < 60 ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    <FiClock className={`mr-1 sm:mr-2 ${timeLeft < 60 && 'animate-pulse'}`} />
                    <span className="font-mono font-bold text-sm sm:text-base">{formatTimeForDisplay(timeLeft)}</span>
                  </div>
                  <button
                    onClick={toggleTimer}
                    className="bg-gray-100 p-1.5 sm:p-2 rounded-lg hover:bg-gray-200"
                    title={timerActive ? 'Pause Timer' : 'Resume Timer'}
                  >
                    {timerActive ? <FiPause className="h-5 w-5" /> : <FiPlay className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              
              <form onSubmit={handleSubmit} className="flex flex-col flex-grow">
                {/* Logo Grid Container */}
                <div className="mb-2 flex-grow">
                  <AnimatePresence mode="wait">
                    <motion.div 
                      key={currentPage}
                      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4"
                      initial={{ opacity: 0, x: 100 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ duration: 0.3 }}
                    >
                      {getCurrentPageLogos().map((logo) => (
                        <div 
                          key={logo.id}
                          className={`relative p-3 rounded-lg border-2 hover:shadow-md transition-all flex flex-col ${
                            correctAnswers[logo.id] 
                              ? 'border-green-500 bg-green-50' 
                              : answers[logo.id].trim() 
                                ? 'border-yellow-300 bg-yellow-50' 
                                : 'border-gray-200 bg-white'
                          } ${currentFocusedLogo === logo.id ? 'ring-2 ring-blue-500' : ''}`}
                        >
                          {/* Logo Image with Progressive Blur */}
                          <div 
                            className="h-24 sm:h-36 flex items-center justify-center mb-2 cursor-pointer flex-shrink-0"
                            onClick={() => focusLogo(logo.id)}
                          >
                            <Image 
                              src={logo.imagePath} 
                              alt="Mystery Logo" 
                              fill
                              className={`object-contain transition duration-300 ${getBlurStyle(logo.id)}`} 
                              sizes="(max-width: 640px) 50vw, 33vw"
                            />
                          </div>
                          
                          {/* Answer Input */}
                          <div className="mt-auto">
                          <input
  type="text"
  autoComplete="off"
  inputMode="text"
  value={answers[logo.id]}
  onChange={(e) => handleInputChange(logo.id, e.target.value)}
  onKeyDown={(e) => handleKeyDown(e, logo.id)}
  // Add a data attribute for more reliable selection
  data-logo-id={logo.id}
  placeholder={t('logoQuiz.enterLogoName') || "Enter logo name..."}
  className={`w-full p-2 text-base sm:text-sm border rounded-md ${
    correctAnswers[logo.id] 
      ? 'border-green-500 bg-green-50 text-green-700' 
      : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
  }`}
  disabled={correctAnswers[logo.id]}
/>
                            {feedback[logo.id] && (
                              <div className={`text-xs mt-1 ${
                                correctAnswers[logo.id] ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {feedback[logo.id]}
                              </div>
                            )}
                          </div>
                          
                          {/* Success Icon */}
                          {correctAnswers[logo.id] && (
                            <div className="absolute top-1 right-1 bg-green-500 text-white rounded-full p-1">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                          
                          {/* Attempt Counter (Only show for incorrect answers with attempts) */}
                          {!correctAnswers[logo.id] && attemptCounts[logo.id] > 0 && (
                            <div className="absolute top-1 right-1 bg-gray-100 text-gray-600 text-xs rounded-full px-2 py-1">
                              {attemptCounts[logo.id]}/{MAX_ATTEMPTS}
                            </div>
                          )}
                        </div>
                      ))}
                    </motion.div>
                  </AnimatePresence>
                </div>
                
                {/* Navigation and Submit Controls - Fixed to bottom on mobile */}
                <div className="flex justify-between items-center pt-3 sm:pt-4 mt-auto shrink-0 gap-2">
                  <button
                    type="button"
                    onClick={prevPage}
                    disabled={currentPage === 0}
                    className={`flex items-center justify-center min-w-16 px-2 sm:px-4 py-3 sm:py-2 rounded-lg touch-manipulation ${
                      currentPage === 0 
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                        : 'bg-blue-100 text-blue-700 hover:bg-blue-200 active:bg-blue-300'
                    }`}
                  >
                    <FiChevronLeft className="sm:mr-1" />
                    <span className="hidden sm:inline">Prev</span>
                  </button>
                  
                  <GameButton type="primary" className="px-4 sm:px-8 py-3 sm:py-2 text-base">
                    Submit All
                  </GameButton>
                  
                  <button
                    type="button"
                    onClick={nextPage}
                    disabled={currentPage === totalPages - 1}
                    className={`flex items-center justify-center min-w-16 px-2 sm:px-4 py-3 sm:py-2 rounded-lg touch-manipulation ${
                      currentPage === totalPages - 1 
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                        : 'bg-blue-100 text-blue-700 hover:bg-blue-200 active:bg-blue-300'
                    }`}
                  >
                    <span className="hidden sm:inline">Next</span>
                    <FiChevronRight className="sm:ml-1" />
                  </button>
                </div>
              </form>
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
};

export default LogoQuizGame;


