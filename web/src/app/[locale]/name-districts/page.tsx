'use client'

import React, { useState, useEffect, useRef } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import { districtData } from '../../data/district-data';
import AdSenseGoogle from '@/components/AdSenseGoogle';

const TOTAL_DISTRICTS = districtData.length;

// Helper function to convert numbers to Nepali numerals
const toNepaliNumerals = (num: number): string => {
  const nepaliDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
  return num
    .toString()
    .split('')
    .map(digit => nepaliDigits[parseInt(digit)])
    .join('');
};

// Fisher-Yates shuffle algorithm
const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const NepalDistrictQuiz: React.FC = () => {
  
  // Add this constant near the top of the file
  const DEFAULT_DISTRICT_IMAGE = '/districts/district-placeholder.png'; // Update with your actual placeholder path

  // Safe translation function to prevent errors


  const t = useTranslations('Translations'); // For general UI translations
  const tDistricts = useTranslations('districts'); // For district names
  const locale = useLocale();
  const isNepali = locale === 'np'; // Assuming 'np' for Nepali locale

  const safeT = React.useCallback((key: string, defaultValue: string = '', params: Record<string, any> = {}) => {
    try {
      return t(key, params);
    } catch (error) {
      console.warn(`Translation key not found: ${key}`);
      return defaultValue;
    }
  }, [t]);

  const safeTDistricts = React.useCallback((key: string, defaultValue: string = '') => {
    try {
      return tDistricts(key);
    } catch (error) {
      console.warn(`District translation key not found: ${key}`);
      return defaultValue;
    }
  }, [tDistricts]);

  // Game state
  const [gameStarted, setGameStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(1200); // 20 minutes
  const [randomizedDistricts, setRandomizedDistricts] = useState(districtData);
  const [currentDistrictIndex, setCurrentDistrictIndex] = useState(0);
  const [correctGuesses, setCorrectGuesses] = useState<string[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // UI state
  const [currentGuess, setCurrentGuess] = useState('');
  const [feedback, setFeedback] = useState('');
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [options, setOptions] = useState<string[]>([]);
  const [incorrectOption, setIncorrectOption] = useState<string | null>(null);
  const [isInputIncorrect, setIsInputIncorrect] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const paginationRef = useRef<HTMLDivElement>(null);

  // Fisher-Yates shuffle algorithm


  // Auto-start the game on mount and reset scroll
  // Auto-start the game on mount and reset scroll
  const startGame = React.useCallback(() => {
    const shuffled = shuffleArray([...districtData]);
    setRandomizedDistricts(shuffled);
    setCurrentDistrictIndex(0);
    setGameStarted(true);
    setGameOver(false);
    setShowResults(false);
    setCorrectGuesses([]);
    setCurrentGuess('');
    setFeedback('');
    setStreak(0);
    // Do not reset best streak on restart
    setTimeLeft(1200);

    if (inputRef.current) {
      inputRef.current.focus();
    }

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (timerRef.current) {
            clearInterval(timerRef.current);
          }
          setGameOver(true);
          setShowResults(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    if (paginationRef.current) {
      paginationRef.current.scrollLeft = 0;
    }
  }, []);



  // Load from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('nameDistrictsState');
    let restored = false;
    if (savedState) {
        try {
            const parsed = JSON.parse(savedState);
            setCorrectGuesses(parsed.correctGuesses || []);
            setBestStreak(parsed.bestStreak || 0);
            if (parsed.correctGuesses && parsed.correctGuesses.length > 0) {
               setGameStarted(true);
               restored = true;
            }
        } catch (e) {
            console.error("Failed to parse Name Districts state", e);
        }
    }
    
    if (!restored) {
        setTimeout(() => startGame(), 0);
    }
  }, [startGame]);

  // Save to localStorage
  useEffect(() => {
    if (correctGuesses.length > 0 || bestStreak > 0) {
        const stateToSave = {
            correctGuesses,
            bestStreak,
            lastPlayed: new Date().toISOString()
        };
        localStorage.setItem('nameDistrictsState', JSON.stringify(stateToSave));
    }
  }, [correctGuesses, bestStreak]);

  // Check for game completion
  useEffect(() => {
    if (correctGuesses.length === TOTAL_DISTRICTS && gameStarted) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      setTimeout(() => {
        setGameOver(true);
        setShowResults(true);
      }, 0);
    }
  }, [correctGuesses, gameStarted]);

  // Generate multiple choice options
  useEffect(() => {
    if (randomizedDistricts.length > 0 && currentDistrictIndex < randomizedDistricts.length) {
      const currentDistrict = randomizedDistricts[currentDistrictIndex];
      const availableDistricts = districtData.filter(d => d.id !== currentDistrict.id);
      const shuffledDistricts = shuffleArray(availableDistricts);
      const distractors = shuffledDistricts.slice(0, 2);
      const choices = [
        safeTDistricts(currentDistrict.id),
        ...distractors.map(d => safeTDistricts(d.id)),
      ];

      setTimeout(() => setOptions(shuffleArray(choices)), 0);
    }
  }, [currentDistrictIndex, randomizedDistricts, tDistricts, safeTDistricts]);

  // Scroll pagination to active district
  useEffect(() => {
    if (paginationRef.current) {
      const activeButton = paginationRef.current.children[currentDistrictIndex];
      if (activeButton) {
        activeButton.scrollIntoView({
          behavior: 'smooth',
          inline: 'center',
          block: 'nearest',
        });
      }
    }
  }, [currentDistrictIndex]);

  const handleGuess = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentGuess.trim()) return;

    const currentDistrict = randomizedDistricts[currentDistrictIndex];
    if (!currentDistrict) return;

    const guess = currentGuess.trim().toLowerCase();
    const isCorrect =
      currentDistrict.id.toLowerCase() === guess ||
      safeTDistricts(currentDistrict.id).toLowerCase() === guess ||
      (isNepali ? currentDistrict.translations?.ne?.toLowerCase() : currentDistrict.translations?.en?.toLowerCase()) === guess;

    if (isCorrect) {
      handleCorrectAnswer(currentDistrict);
    } else {
      setFeedback(safeT('incorrect', 'Incorrect'));
      setStreak(0);
      setIsInputIncorrect(true);
      setTimeout(() => setIsInputIncorrect(false), 1000);
    }
  };

  const handleMultipleChoiceSelection = (selectedOption: string) => {
    const currentDistrict = randomizedDistricts[currentDistrictIndex];
    const isCorrect = safeTDistricts(currentDistrict.id).toLowerCase() === selectedOption.toLowerCase();

    if (isCorrect) {
      handleCorrectAnswer(currentDistrict);
    } else {
      setFeedback(safeT('incorrect', 'Incorrect'));
      setStreak(0);
      setIncorrectOption(selectedOption);
      setTimeout(() => setIncorrectOption(null), 1000);
    }
  };

  const handleCorrectAnswer = (district: { id: string }) => {
    if (!correctGuesses.includes(district.id)) {
      setCorrectGuesses(prev => [...prev, district.id]);
    }
    setFeedback(safeT('correct', 'Correct! {district}', { district: safeTDistricts(district.id) }));
    setCurrentGuess('');
    const newStreak = streak + 1;
    setStreak(newStreak);
    if (newStreak > bestStreak) {
      setBestStreak(newStreak);
    }
    setTimeout(() => {
      goToNextDistrict();
    }, 1500);
  };

  const goToNextDistrict = () => {
    if (currentDistrictIndex < randomizedDistricts.length - 1) {
      setCurrentDistrictIndex(prev => prev + 1);
      setFeedback('');
      if (inputRef.current) {
        inputRef.current.focus();
      }
    } else if (currentDistrictIndex === randomizedDistricts.length - 1 && correctGuesses.length < TOTAL_DISTRICTS) {
      const unansweredIndices = randomizedDistricts
        .map((district, index) => ({ district, index }))
        .filter(item => !correctGuesses.includes(item.district.id))
        .map(item => item.index);
      if (unansweredIndices.length > 0) {
        setCurrentDistrictIndex(unansweredIndices[0]);
        setFeedback(safeT('remainingDistricts', '', { count: unansweredIndices.length }));
      }
    } else {
      setGameOver(true);
      setShowResults(true);
    }
  };

  const goToPrevDistrict = () => {
    if (currentDistrictIndex > 0) {
      setCurrentDistrictIndex(prev => prev - 1);
      setFeedback('');
    }
  };



  const calculateScore = () => {
    if (correctGuesses.length === 0) return 0;
    const baseScore = correctGuesses.length * 100;
    const timeBonus = timeLeft > 0 ? Math.floor(timeLeft / 10) : 0;
    return Math.floor(baseScore + timeBonus);
  };

  const handleGiveUp = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setGameOver(true);
    setShowResults(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getCompletionPercentage = () => {
    return Math.round((correctGuesses.length / TOTAL_DISTRICTS) * 100);
  };

  // Render right column content based on showResults state
  const renderRightColumnContent = () => {
    if (showResults) {
      return (
        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
          <h2 className="text-lg font-bold mb-3">{safeT('districtsGallery', 'Districts Gallery')}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {randomizedDistricts.map((district) => (
              <div 
                key={district.id} 
                className={`border rounded-lg overflow-hidden ${
                  correctGuesses.includes(district.id) 
                    ? 'border-green-500' 
                    : 'border-red-300 bg-red-50'
                }`}
              >
                <div className="w-full h-24 relative">
                  <Image
                    src={district.imagePath || DEFAULT_DISTRICT_IMAGE}
                    alt={safeTDistricts(district.id)}
                    fill
                    sizes="(max-width: 768px) 50vw, 33vw"
                    className="object-contain p-1"
                  />
                </div>
                <div className={`text-center py-1.5 text-sm font-medium ${
                  correctGuesses.includes(district.id)
                    ? 'bg-green-500 text-white'
                    : 'bg-red-200 text-red-800'
                }`}>
                  {safeTDistricts(district.id)}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <>
        {/* District image container */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4">
          {/* Navigation controls */}
          <div className="flex items-center justify-between bg-gray-50 border-b p-2">
            <button
              onClick={goToPrevDistrict}
              disabled={currentDistrictIndex === 0}
              className="text-sm border rounded-md px-3 py-1 disabled:opacity-50"
            >
              ← {safeT('prev', 'Previous')}
            </button>
            <div className="font-medium text-sm">
              {isNepali 
                ? `जिल्ला ${toNepaliNumerals(currentDistrictIndex + 1)} मध्ये ${toNepaliNumerals(TOTAL_DISTRICTS)}` 
                : `District ${currentDistrictIndex + 1} of ${TOTAL_DISTRICTS}`}
            </div>
            <button
              onClick={goToNextDistrict}
              className="text-sm border rounded-md px-3 py-1"
            >
              {safeT('next', 'Next')} →
            </button>
          </div>
          
          {/* District image */}
          <div className="w-full h-[40vh] max-h-[350px] relative bg-white">
            <Image
              src={randomizedDistricts[currentDistrictIndex]?.imagePath || DEFAULT_DISTRICT_IMAGE}
              alt="District Shape"
              fill
              sizes="(max-width: 768px) 100vw, 67vw"
              className="object-contain p-2"
              priority
            />
            
            {correctGuesses.includes(randomizedDistricts[currentDistrictIndex].id) && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-green-500 text-white px-3 py-1.5 rounded-lg text-base font-bold">
                  {safeTDistricts(randomizedDistricts[currentDistrictIndex].id || '')}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Guessing controls */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
          {!correctGuesses.includes(randomizedDistricts[currentDistrictIndex].id) ? (
            <>
              <form onSubmit={handleGuess} className="mb-4">
                <label htmlFor="district-guess" className="block text-sm font-medium text-gray-700 mb-2">
                  {safeT('guessingPlaceholder', 'Type district name...')}
                </label>
                <input
                  id="district-guess"
                  type="text"
                  value={currentGuess}
                  onChange={(e) => setCurrentGuess(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                    isInputIncorrect ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder={safeT('guessingPlaceholder', 'Type district name...')}
                  ref={inputRef}
                />
              </form>
              
              <div className="text-sm mb-3 font-medium">
                {safeT('selectFromOptions', 'Choose from options:')}
              </div>
              
              <div className="flex flex-col gap-2">
                {options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleMultipleChoiceSelection(option)}
                    className={`w-full py-2 px-3 font-bold rounded-lg text-sm text-center transition-colors duration-200 ${
                      incorrectOption === option
                        ? 'bg-red-100 text-red-800 border-2 border-red-500'
                        : 'bg-blue-50 hover:bg-blue-100 text-blue-800'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="bg-green-50 p-3 rounded-lg flex items-center">
              <div className="bg-green-100 rounded-full p-1 mr-3">
                <svg className="w-5 h-5 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <div className="font-medium text-green-800">Correct!</div>
                <div className="text-sm text-green-700">{safeTDistricts(randomizedDistricts[currentDistrictIndex].id || '')}</div>
              </div>
            </div>
          )}
        </div>
        
        {/* Pagination */}
        <div className="bg-white rounded-lg shadow-md p-2 overflow-x-auto relative">
          {/* Left arrow button */}
          <button
            onClick={() => {
              if (paginationRef.current) {
                paginationRef.current.scrollBy({ left: -200, behavior: 'smooth' });
              }
            }}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white shadow-md rounded-r-lg px-2 py-6 z-10"
            aria-label="Scroll left"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Right arrow button */}
          <button
            onClick={() => {
              if (paginationRef.current) {
                paginationRef.current.scrollBy({ left: 200, behavior: 'smooth' });
              }
            }}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white shadow-md rounded-l-lg px-2 py-6 z-10"
            aria-label="Scroll right"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <div
            ref={paginationRef}
            className="flex flex-nowrap gap-3 py-2 px-8 min-w-full overflow-x-auto"
            role="navigation"
            aria-label="Pagination"
          >
            {randomizedDistricts.map((district, index) => (
              <button
                key={index}
                onClick={() => setCurrentDistrictIndex(index)}
                className={`flex-shrink-0 min-w-[32px] h-8 flex items-center justify-center rounded ${
                  correctGuesses.includes(district.id)
                    ? 'bg-green-500 text-white'
                    : currentDistrictIndex === index
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
                aria-label={`Select district ${isNepali ? toNepaliNumerals(index + 1) : index + 1}`}
              >
                {isNepali ? toNepaliNumerals(index + 1) : index + 1}
              </button>
            ))}
          </div>
        </div>
      </>
    );
  };

  // Render left sidebar content based on showResults state
  const renderLeftSidebarContent = () => {
    if (showResults) {
      return (
        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
          <div className="mb-4">
            <h1 className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-red-500 mb-2">
              {safeT('quizResults', 'Quiz Results')}
            </h1>
            <p className="text-sm text-gray-600">
              {safeT('resultsDescription', 'Here is your performance')}
            </p>
          </div>
          
          {/* Score */}
          <div className="bg-blue-50 rounded-lg p-3 mb-4">
            <div className="text-sm text-blue-800 mb-1">{safeT('totalScore', 'Total Score')}</div>
            <div className="text-3xl font-bold text-blue-700">{calculateScore()}</div>
          </div>
          
          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-green-50 rounded-lg p-3">
              <div className="text-sm text-green-800">{safeT('correct', 'Correct')}</div>
              <div className="text-xl font-bold text-green-700">{correctGuesses.length}</div>
            </div>
            <div className="bg-red-50 rounded-lg p-3">
              <div className="text-sm text-red-800">{safeT('missed', 'Missed')}</div>
              <div className="text-xl font-bold text-red-700">{TOTAL_DISTRICTS - correctGuesses.length}</div>
            </div>
          </div>
          
          {/* Completion rate */}
          <div className="bg-amber-50 rounded-lg p-3 mb-4">
            <div className="flex justify-between mb-1">
              <span className="text-sm text-amber-800">{safeT('completionRate', 'Completion Rate')}</span>
              <span className="text-sm font-bold text-amber-700">{getCompletionPercentage()}%</span>
            </div>
            <div className="w-full h-2 bg-amber-100 rounded-full">
              <div 
                className="h-full bg-amber-500 rounded-full transition-all duration-500"
                style={{ width: `${getCompletionPercentage()}%` }}
              ></div>
            </div>
          </div>
          
          {/* Time & streak */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="text-sm text-blue-800">{safeT('timeRemaining', 'Time')}</div>
              <div className="text-xl font-bold text-blue-700">{formatTime(timeLeft)}</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-3">
              <div className="text-sm text-purple-800">{safeT('bestStreak', 'Best Streak')}</div>
              <div className="text-xl font-bold text-purple-700">{bestStreak}</div>
            </div>
          </div>
          
          {/* Play again button */}
          <button
            onClick={startGame}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200"
          >
            {safeT('playAgain', 'Play Again')}
          </button>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-lg shadow-md p-4 mb-4">
        <div className="mb-3">
          <h1 className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-red-500 mb-2">{safeT('nameDistrictTitle', 'Nepal Districts Quiz')}</h1>
          <p className="text-sm text-gray-600">{safeT('districtDescription')}</p>
        </div>
        
        {/* Timer and Give Up button */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center bg-blue-50 px-3 py-1 rounded-lg">
            <span className="font-medium text-blue-800">{formatTime(timeLeft)}</span>
          </div>
          
          <button
            onClick={handleGiveUp}
            className="text-xs bg-red-50 text-red-700 px-2 py-1 rounded-lg"
          >
            {safeT('giveUp', 'Give Up')}
          </button>
        </div>
        
        {/* Progress */}
        <div className="bg-blue-50 rounded-lg p-2 mb-3">
          <div className="text-xs text-blue-800 mb-1">{safeT('progress', 'Progress')}</div>
          <div className="flex justify-between">
            <span className="font-bold">{correctGuesses.length} / {TOTAL_DISTRICTS}</span>
            <span className="text-blue-600">{getCompletionPercentage()}%</span>
          </div>
          <div className="w-full h-1.5 bg-blue-100 rounded-full mt-1">
            <div 
              className="h-full bg-blue-600 rounded-full transition-all duration-500"
              style={{ width: `${getCompletionPercentage()}%` }}
            ></div>
          </div>
        </div>
        
        {/* Streaks */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-green-50 rounded-lg p-2">
            <div className="text-xs text-green-800">{safeT('currentStreak', 'Current Streak')}</div>
            <div className="font-bold text-xl text-green-700 text-center">{streak}</div>
          </div>
          <div className="bg-amber-50 rounded-lg p-2">
            <div className="text-xs text-amber-800">{safeT('bestStreak', 'Best Streak')}</div>
            <div className="font-bold text-xl text-amber-700 text-center">{bestStreak}</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen w-full bg-gray-50">
      <div className="pb-20 md:pb-0">
        <div className="max-w-5xl mx-auto px-3 py-4 overflow-hidden">
          <div className="flex flex-col md:flex-row gap-6 max-w-5xl mx-auto">
            <div className="w-full md:w-1/3 lg:w-1/4 md:sticky md:top-4 md:self-start md:flex-shrink-0">
              {renderLeftSidebarContent()}
            </div>
            
            <div className="w-full md:w-2/3 lg:w-3/4">
              {renderRightColumnContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NepalDistrictQuiz;