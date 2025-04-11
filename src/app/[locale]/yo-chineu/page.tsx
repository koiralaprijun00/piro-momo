'use client'

import React, { useState, useEffect, useRef } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import GameButton from '../../components/ui/GameButton';
import { getLogosByLocale } from '../../data/logo-quiz/getLogos';
import { FiShare2, FiClock, FiChevronLeft, FiChevronRight, FiPause, FiPlay } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { HiInformationCircle } from 'react-icons/hi';

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
  blurLevels: Record<string, number>; // Add blur level tracking
  attemptCounts: Record<string, number>; // Track number of attempts per logo
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
  // New state for tracking blur levels per logo
  const [blurLevels, setBlurLevels] = useState<Record<string, number>>({});
  // New state for tracking attempts
  const [attemptCounts, setAttemptCounts] = useState<Record<string, number>>({});
  
  const logosPerPage = 6;
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const t = useTranslations('Translations');
  const locale = useLocale();

  // Maximum blur level (starting level) and minimum blur level
  const MAX_BLUR_LEVEL = 4; // Maps to blur-lg (we have 4 levels: none, sm, md, lg)
  const MIN_BLUR_LEVEL = 0;
  // Maximum number of incorrect attempts before removing blur completely
  const MAX_ATTEMPTS = 5;

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
      // Initialize blur levels from saved state if available
      if (parsedState.blurLevels) {
        setBlurLevels(parsedState.blurLevels);
      }
      // Initialize attempt counts from saved state if available
      if (parsedState.attemptCounts) {
        setAttemptCounts(parsedState.attemptCounts);
      }
    }
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
        // Initialize blur levels or use existing ones
        initialBlurLevels[logo.id] = blurLevels[logo.id] !== undefined 
          ? blurLevels[logo.id] 
          : MAX_BLUR_LEVEL;
        // Initialize attempt counts or use existing ones
        initialAttemptCounts[logo.id] = attemptCounts[logo.id] || 0;
      });
      
      setAnswers(prev => ({ ...prev, ...initialAnswers }));
      setFeedback(prev => ({ ...prev, ...initialFeedback }));
      // Set initial blur levels for all logos
      setBlurLevels(initialBlurLevels);
      // Set initial attempt counts
      setAttemptCounts(prev => ({ ...prev, ...initialAttemptCounts }));
      
      const initialCorrectAnswers: Record<string, boolean> = {};
      shuffled.forEach(logo => {
        initialCorrectAnswers[logo.id] = correctAnswers[logo.id] || false;
      });
      setCorrectAnswers(prev => ({ ...prev, ...initialCorrectAnswers }));
    }
  }, [locale]);

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
  }, [timeLeft, timerActive]);

  // Toggle timer pause/resume
  const toggleTimer = () => {
    setTimerActive(prev => !prev);
  };

  // Handle timer completion
  const handleTimeUp = () => {
    setTimerActive(false);
    setShowResults(true);
    let finalScore = 0;
    Object.values(correctAnswers).forEach(isCorrect => {
      if (isCorrect) finalScore++;
    });
    setScore(finalScore);
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
      // This is mapped to our blur style levels (4=blur-lg, 3=blur-md, 2=blur-md, 1=blur-sm, 0=no blur)
      const newBlurLevel = Math.max(MAX_BLUR_LEVEL - currentAttempts, 0);
      
      setBlurLevels(prev => ({
        ...prev,
        [logoId]: newBlurLevel
      }));
      
      // Determine feedback message
      let feedbackMessage = t('logoQuiz.incorrect') || 'Incorrect. Try again!';
      
      if (currentAttempts >= MAX_ATTEMPTS) {
        feedbackMessage += ' Image is now fully revealed after 5 attempts.';
      } else {
        feedbackMessage += ' The image is now clearer!';
      }
      
      setFeedback(prev => ({
        ...prev,
        [logoId]: feedbackMessage
      }));
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>, logoId: string) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      checkAnswer(logoId);
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
    
    // Calculate blur based on attempts - this ensures a gradual progression
    const currentAttempts = attemptCounts[logoId] || 0;
    
    // If all attempts used, no blur
    if (currentAttempts >= MAX_ATTEMPTS) return 'blur-0';
    
    // We have 5 attempts and 4 blur levels (4,3,2,1,0)
    // Map attempts to blur level
    switch (currentAttempts) {
      case 0: return 'blur-lg'; // Starting blur (MAX_BLUR_LEVEL = 4)
      case 1: return 'blur-md'; // After 1 wrong attempt
      case 2: return 'blur-md'; // After 2 wrong attempts
      case 3: return 'blur-sm'; // After 3 wrong attempts
      case 4: return 'blur-sm'; // After 4 wrong attempts
      default: return 'blur-0';  // After 5 wrong attempts
    }
  };

  // Render results
  if (showResults) {
    const percentCorrect = Math.round((score / logos.length) * 100);
    const timeUsed = 300 - timeLeft;
    
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 min-h-[90vh] max-w-6xl mx-auto overflow-hidden flex flex-col">
        <div className="text-center flex-grow overflow-y-auto">
          {/* Keep title consistent on results page */}
          <h1 className="text-left text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-red-500">
            {t('logoQuiz.title')}
          </h1>
          
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            {t('logoQuiz.finalScore') || 'Your Final Score'}
          </h2>
          <div className="text-5xl font-bold mb-2 text-blue-600">{score}/{logos.length}</div>
          <p className="text-xl mb-2 text-gray-700">
            {percentCorrect}% Accuracy
          </p>
          <p className="text-md mb-6 text-gray-500">
            Time Used: {formatTimeForDisplay(timeUsed)}
          </p>
          
          <div className="flex justify-center gap-4 mb-8">
            <GameButton onClick={resetGame} type="primary">
              {t('logoQuiz.playAgain') || 'Play Again'}
            </GameButton>
            <GameButton onClick={handleShareScore} type="success" className="flex items-center">
              <FiShare2 className="mr-2" />
              {t('logoQuiz.shareScore') || 'Share Score'}
            </GameButton>
          </div>
          
          <div className="max-w-5xl mx-auto bg-gray-50 rounded-lg p-6">
            <h3 className="font-bold mb-6 text-xl">Results Breakdown</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {logos.map((logo) => (
                <motion.div 
                  key={logo.id} 
                  className={`p-4 rounded-lg border-2 ${
                    correctAnswers[logo.id] 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-red-500 bg-red-50'
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center mb-2">
                    <img 
                      src={logo.imagePath} 
                      alt={logo.name} 
                      className="w-10 h-10 object-contain mr-3"
                    />
                    <div>
                      <div className="font-medium">
                        {logo.name}
                      </div>
                      <div className="text-sm text-gray-600">
                        {correctAnswers[logo.id] 
                          ? <span className="text-green-600">✓ Correct</span> 
                          : <span className="text-red-600">✗ Incorrect</span>}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm">
                    <div><strong>Your answer:</strong> {answers[logo.id] || '(No answer)'}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render main game interface 
  return (
    <div className="bg-white rounded-xl p-6 min-h-[90vh] max-w-6xl mx-auto flex flex-col">
      {/* Title and Subheading */}
      <div className="text-left mb-6">
        <h1 className="inline text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-red-500">
          {t('logoQuiz.title')}
        </h1>
        <p className="text-gray-600 mt-2">
          {t('logoQuiz.subtitle') || "Test your brand knowledge! Guess the logos and beat the clock."}
        </p>
      </div>
      
      {/* Game Info Banner */}
      <div className="bg-blue-50 p-3 rounded-lg mb-4 text-sm text-blue-700 inline-flex items-center">
      <HiInformationCircle className="inline h-5 w-5 mr-2" />
        <span className="inline">{t('logoQuiz.proTip') || "Pro Tip: Images gradually become clearer with each incorrect guess and fully reveal after 5 attempts!"}</span>
      </div>
      
      {/* Header Bar */}
      <div className="flex justify-between items-center mb-4 shrink-0">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg px-4 py-2 flex items-center">
          <span className="text-sm text-gray-600 mr-2">{t('logoQuiz.score') || 'Score'}:</span>
          <span className="text-xl font-bold text-blue-700">{score}/{logos.length}</span>
        </div>
        
        <div className="text-gray-600 font-medium">
          Page {currentPage + 1} of {totalPages}
        </div>
        
        <div className="flex items-center gap-2">
          <div className={`rounded-lg px-4 py-2 flex items-center ${
            timeLeft < 60 ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
          }`}>
            <FiClock className={`mr-2 ${timeLeft < 60 && 'animate-pulse'}`} />
            <span className="font-mono font-bold">{formatTimeForDisplay(timeLeft)}</span>
          </div>
          <button
            onClick={toggleTimer}
            className="bg-gray-100 p-2 rounded-lg hover:bg-gray-200"
            title={timerActive ? 'Pause Timer' : 'Resume Timer'}
          >
            {timerActive ? <FiPause /> : <FiPlay />}
          </button>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="flex flex-col flex-grow">
        {/* Logo Grid Container */}
        <div className="mb-2">
          <AnimatePresence mode="wait">
            <motion.div 
              key={currentPage}
              className="grid grid-cols-2 md:grid-cols-3 gap-4"
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
                    className="h-24 md:h-36 flex items-center justify-center mb-2 cursor-pointer flex-shrink-0"
                    onClick={() => focusLogo(logo.id)}
                  >
                    <img 
                      src={logo.imagePath} 
                      alt="Mystery Logo" 
                      className={`max-h-full max-w-full object-contain transition duration-300 ${getBlurStyle(logo.id)}`} 
                    />
                  </div>
                  
                  {/* Answer Input */}
                  <div className="mt-auto">
                    <input
                      type="text"
                      value={answers[logo.id]}
                      onChange={(e) => handleInputChange(logo.id, e.target.value)}
                      onBlur={() => checkAnswer(logo.id)}
                      onKeyPress={(e) => handleKeyPress(e, logo.id)}
                      placeholder={t('logoQuiz.enterLogoName') || "Enter logo name..."}
                      className={`w-full p-2 text-sm border rounded-md ${
                        correctAnswers[logo.id] 
                          ? 'border-green-500 bg-green-50 text-green-700' 
                          : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                      }`}
                      disabled={correctAnswers[logo.id]}
                    />
                    {feedback[logo.id] && (
                      <div className={`text-xs mt-1 ${
                        feedback[logo.id].includes('Correct') ? 'text-green-600' : 'text-red-600'
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
        
        {/* Navigation and Submit Controls */}
        <div className="flex justify-between items-center pt-4 shrink-0">
          <button
            type="button"
            onClick={prevPage}
            disabled={currentPage === 0}
            className={`flex items-center px-4 py-2 rounded-lg ${
              currentPage === 0 
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
            }`}
          >
            <FiChevronLeft className="mr-2" />
            Previous
          </button>
          
          <GameButton type="primary" className="px-8">
            Submit All
          </GameButton>
          
          <button
            type="button"
            onClick={nextPage}
            disabled={currentPage === totalPages - 1}
            className={`flex items-center px-4 py-2 rounded-lg ${
              currentPage === totalPages - 1 
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
            }`}
          >
            Next
            <FiChevronRight className="ml-2" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default LogoQuizGame;