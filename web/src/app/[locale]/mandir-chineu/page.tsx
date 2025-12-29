/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { getTemplesByLocale } from '../../data/guess-temple/getTemples';
import { Temple } from '../../data/guess-temple/temple';
import AdSenseGoogle from '@/components/AdSenseGoogle';
import GameButton from '@/components/ui/GameButton';
import { CheckCircleIcon, XCircleIcon, RefreshCwIcon, AwardIcon, ShuffleIcon } from 'lucide-react';
import Image from 'next/image';
import ShareScore from "@/components/ShareScore";

// Define categories
const CATEGORIES = {
  ALL: 'all',
  KATHMANDU_VALLEY: 'kathmandu_valley',
  PROVINCE_1: 'province_1',
  PROVINCE_2: 'province_2', 
  BAGMATI: 'bagmati',
  GANDAKI: 'gandaki',
  LUMBINI: 'lumbini',
  KARNALI: 'karnali',
  SUDURPASHCHIM: 'sudurpashchim'
};

// District mappings for each category
const DISTRICT_MAPPINGS = {
  en: {
    kathmandu_valley: ['Kathmandu', 'Lalitpur', 'Bhaktapur'],
    province_1: ['Taplejung', 'Panchthar', 'Ilam', 'Jhapa', 'Morang', 'Sunsari', 'Dhankuta', 'Terhathum', 'Sankhuwasabha', 'Bhojpur', 'Solukhumbu', 'Okhaldhunga', 'Khotang', 'Udayapur'],
    province_2: ['Saptari', 'Siraha', 'Dhanusha', 'Mahottari', 'Sarlahi', 'Bara', 'Parsa', 'Rautahat'],
    bagmati: ['Kathmandu', 'Lalitpur', 'Bhaktapur', 'Sindhuli', 'Ramechhap', 'Dolakha', 'Sindhupalchok', 'Kavrepalanchok', 'Rasuwa', 'Nuwakot', 'Dhading', 'Chitwan', 'Makwanpur'],
    gandaki: ['Gorkha', 'Lamjung', 'Tanahu', 'Syangja', 'Kaski', 'Manang', 'Mustang', 'Myagdi', 'Parbat', 'Baglung', 'Nawalpur'],
    lumbini: ['Kapilvastu', 'Parasi', 'Rupandehi', 'Palpa', 'Arghakhanchi', 'Gulmi', 'Banke', 'Bardiya', 'Pyuthan', 'Rolpa', 'Eastern Rukum', 'Dang'],
    karnali: ['Western Rukum', 'Salyan', 'Dolpa', 'Humla', 'Jumla', 'Kalikot', 'Mugu', 'Surkhet', 'Dailekh', 'Jajarkot'],
    sudurpashchim: ['Bajura', 'Bajhang', 'Achham', 'Doti', 'Kailali', 'Kanchanpur', 'Dadeldhura', 'Baitadi', 'Darchula']
  },
  np: {
    kathmandu_valley: ['काठमाडौं', 'ललितपुर', 'भक्तपुर'],
    province_1: ['ताप्लेजुङ', 'पाँचथर', 'इलाम', 'झापा', 'मोरङ', 'सुनसरी', 'धनकुटा', 'तेह्रथुम', 'सङ्खुवासभा', 'भोजपुर', 'सोलुखुम्बु', 'ओखलढुङ्गा', 'खोटाङ', 'उदयपुर'],
    province_2: ['सप्तरी', 'सिराहा', 'धनुषा', 'महोत्तरी', 'सर्लाही', 'बारा', 'पर्सा', 'रौतहट'],
    bagmati: ['काठमाडौं', 'ललितपुर', 'भक्तपुर', 'सिन्धुली', 'रामेछाप', 'दोलखा', 'सिन्धुपाल्चोक', 'काभ्रेपलाञ्चोक', 'रसुवा', 'नुवाकोट', 'धादिङ', 'चितवन', 'मकवानपुर'],
    gandaki: ['गोरखा', 'लमजुङ', 'तनहुँ', 'स्याङ्जा', 'कास्की', 'मनाङ', 'मुस्ताङ', 'म्याग्दी', 'पर्वत', 'बागलुङ', 'नवलपुर'],
    lumbini: ['कपिलवस्तु', 'परासी', 'रुपन्देही', 'पाल्पा', 'अर्घाखाँची', 'गुल्मी', 'बाँके', 'बर्दिया', 'प्युठान', 'रोल्पा', 'पूर्वी रुकुम', 'दाङ'],
    karnali: ['पश्चिमी रुकुम', 'सल्यान', 'डोल्पा', 'हुम्ला', 'जुम्ला', 'कालिकोट', 'मुगु', 'सुर्खेत', 'दैलेख', 'जाजरकोट'],
    sudurpashchim: ['बाजुरा', 'बझाङ', 'अछाम', 'डोटी', 'कैलाली', 'कञ्चनपुर', 'डडेल्धुरा', 'बैतडी', 'दार्चुला']
  }
};

// Main Component
export default function GuessTempleGame() {
  const locale = useLocale();
  const t = useTranslations('Translations');

  const allTemplesFromLocale = React.useMemo(() => getTemplesByLocale(locale), [locale]);
  // State Declarations
  const [selectedCategory, setSelectedCategory] = useState<string>(CATEGORIES.ALL);
  const [currentTempleId, setCurrentTempleId] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Game Status State
  // Game Status State
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(0);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [currentGuess, setCurrentGuess] = useState<string>('');
  const [gameWon, setGameWon] = useState<boolean>(false);
  
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Improved shuffling state management
  const [shuffledTempleIds, setShuffledTempleIds] = useState<string[]>([]);
  const [currentShuffleIndex, setCurrentShuffleIndex] = useState<number>(0);
  const [completedRounds, setCompletedRounds] = useState<number>(0);

   // Load from localStorage
   useEffect(() => {
    const savedState = localStorage.getItem('mandirChineuState');
    if (savedState) {
        try {
            const parsed = JSON.parse(savedState);
            // Only restore persistent stats, not current game state like isAnswered to avoid weird UI states
            setScore(parsed.score || 0);
            setHighScore(parsed.highScore || 0);
            setCompletedRounds(parsed.completedRounds || 0);
        } catch (e) {
            console.error("Failed to parse Mandir Chineu state", e);
        }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
     if (score > 0 || highScore > 0) {
        const stateToSave = {
            score,
            highScore,
            completedRounds,
            lastPlayed: new Date().toISOString()
        };
        localStorage.setItem('mandirChineuState', JSON.stringify(stateToSave));
     }
  }, [score, highScore, completedRounds]);

  const filteredTemples = React.useMemo(() => {
    if (selectedCategory === CATEGORIES.ALL) {
      return allTemplesFromLocale;
    }
    
    const districtsForLocale = DISTRICT_MAPPINGS[locale as 'en' | 'np'] || DISTRICT_MAPPINGS.en;
    const categoryDistricts = districtsForLocale[selectedCategory as keyof typeof districtsForLocale];
    
    if (!categoryDistricts) {
      return allTemplesFromLocale;
    }
    
    return allTemplesFromLocale.filter(temple =>
      categoryDistricts.includes(temple.district)
    );
  }, [allTemplesFromLocale, selectedCategory, locale]);

  const templeIds = React.useMemo(() => filteredTemples.map((temple) => temple.id), [filteredTemples]);

  const currentTemple = React.useMemo(() =>
    filteredTemples.find(temple => temple.id === currentTempleId),
    [filteredTemples, currentTempleId]
  );

  const normalizeSpelling = (text: string): string => {
    return text
      .toLowerCase()
      .replace(/pathibara/g, 'pathivara')
      .replace(/pashupatinath/g, 'pashupati')
      .replace(/swayambhunath/g, 'swayambhu')
      .replace(/boudhanath/g, 'boudha')
      .replace(/changunarayan/g, 'changu')
      .replace(/temple|mandir|stupa|monastery/gi, '')
      .replace(/\s+/g, ' ')
      .trim();
  };

  // Fisher-Yates shuffle algorithm for proper randomization
  const shuffleArray = useCallback((array: string[]): string[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }, []);

  // Initialize or reshuffle temples when category changes
  const initializeShuffledTemples = useCallback(() => {
    if (templeIds.length > 0) {
      const shuffled = shuffleArray(templeIds);
      setShuffledTempleIds(shuffled);
      setCurrentShuffleIndex(0);
      setCompletedRounds(0);
      return shuffled[0];
    }
    return null;
  }, [templeIds, shuffleArray]);

  // Get next temple from shuffled array
  const getNextShuffledTemple = useCallback(() => {
    if (shuffledTempleIds.length === 0) return null;
    
    let nextIndex = currentShuffleIndex;
    
    // If we've reached the end of current shuffle, create a new shuffle
    if (nextIndex >= shuffledTempleIds.length) {
      const newShuffled = shuffleArray(templeIds);
      setShuffledTempleIds(newShuffled);
      setCurrentShuffleIndex(1); // Move to second item since we'll return first
      setCompletedRounds(prev => prev + 1);
      return newShuffled[0];
    }
    
    // Return current temple and increment index
    const currentTempleId = shuffledTempleIds[nextIndex];
    setCurrentShuffleIndex(nextIndex + 1);
    return currentTempleId;
  }, [shuffledTempleIds, currentShuffleIndex, templeIds, shuffleArray]);

  // Manual shuffle function (for shuffle button)
  const handleManualShuffle = useCallback(() => {
    if (templeIds.length === 0) return;
    
    // Create new shuffle excluding current temple if possible
    let availableTemples = templeIds;
    if (templeIds.length > 1 && currentTempleId) {
      availableTemples = templeIds.filter(id => id !== currentTempleId);
    }
    
    const newShuffled = shuffleArray(availableTemples);
    setShuffledTempleIds(newShuffled);
    setCurrentShuffleIndex(1); // Move to second item since we'll show first
    setCurrentTempleId(newShuffled[0]);
    
    // Reset game state for new temple
    setIsAnswered(false);
    setIsCorrect(false);
    setCurrentGuess('');
  }, [templeIds, shuffleArray, currentTempleId]);



  // Initialize temples when category or templeIds change
  // Initialize temples when category or templeIds change
  useEffect(() => {
    setTimeout(() => {
      const firstTempleId = initializeShuffledTemples();
      if (firstTempleId) {
        setCurrentTempleId(firstTempleId);
        setCurrentShuffleIndex(1); // Already showing first temple
        setIsAnswered(false);
        setIsCorrect(false);
        setCurrentGuess('');
        // We need to check isInitialized here, but we can't depend on stale state inside timeout easily without ref? 
        // Actually for this logic, just setting isInitialized(true) is fine.
        setIsInitialized(true);
      } else {
        setCurrentTempleId(null);
      }
    }, 0);
  }, [templeIds, initializeShuffledTemples]);

  useEffect(() => {
    if (isInitialized && !isAnswered && !gameWon) {
      inputRef.current?.focus();
    }
  }, [isInitialized, currentTempleId, isAnswered, gameWon]);

  const handleGuess = useCallback((selectedOption: string) => {
    if (isAnswered || !currentTempleId || !currentTemple || gameWon) return;

    const normalizedGuess = normalizeSpelling(selectedOption);
    const acceptableAnswers = currentTemple.acceptableAnswers?.map(normalizeSpelling) || [];
    const normalizedTempleName = normalizeSpelling(currentTemple.name);
    const normalizedAltNames = currentTemple.alternativeNames?.map(normalizeSpelling) || [];

    const correct = normalizedGuess === normalizedTempleName ||
                    normalizedAltNames.includes(normalizedGuess) ||
                    acceptableAnswers.includes(normalizedGuess);

    setCurrentGuess('');
    let newScore = score;

    if (correct) {
      const points = currentTemple.points || 10;
      newScore = score + points;
      setScore(newScore);
      if (newScore > highScore) {
        setHighScore(newScore);
      }
      setIsCorrect(true);
      if (newScore >= 100) {
        setGameWon(true);
      }
    } else {
      setIsCorrect(false);
    }
    setIsAnswered(true);
  }, [isAnswered, currentTemple, currentTempleId, score, gameWon, highScore]);

  const handleInputGuess = useCallback(() => {
    if (!currentGuess.trim() || gameWon) return;
    handleGuess(currentGuess.trim());
  }, [currentGuess, handleGuess, gameWon]);

  const handleNextTemple = useCallback(() => {
    if (gameWon) return;

    const nextTempleId = getNextShuffledTemple();
    
    if (nextTempleId) {
      setCurrentTempleId(nextTempleId);
    }

    setIsAnswered(false);
    setIsCorrect(false);
    setCurrentGuess('');
  }, [getNextShuffledTemple, gameWon]);

  const restartGame = useCallback(() => {
    setScore(0);
    setIsAnswered(false);
    setIsCorrect(false);
    setCurrentGuess('');
    setGameWon(false);

    const firstTempleId = initializeShuffledTemples();
    if (firstTempleId) {
      setCurrentTempleId(firstTempleId);
      setCurrentShuffleIndex(1);
    }
  }, [initializeShuffledTemples]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        if (gameWon) {
          restartGame();
        } else if (isAnswered) {
          handleNextTemple();
        } else {
          handleInputGuess();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAnswered, handleNextTemple, gameWon, restartGame, handleInputGuess]);

  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(event.target.value);
    setIsAnswered(false);
    setIsCorrect(false);
    setCurrentGuess('');
    setScore(0);
    setGameWon(false);
    // initializeShuffledTemples will be called by useEffect when templeIds changes
  };

  const handleShareScore = async () => {
    const messageKey = gameWon ? 'guessTemple.shareWinMessage' : 'guessTemple.shareMessage';
    const defaultMessage = gameWon
      ? "I won the Guess the Temple game with {score} points! Can you beat it?"
      : 'I scored {score} points in the Guess the Temple game! Can you beat my score?';

    const shareMessage = t(messageKey, {
      defaultValue: defaultMessage,
      score,
      url: 'https://piromomo.com/mandir-chineu',
    });

    try {
      if (navigator.share) {
        await navigator.share({
          title: t('guessTemple.title', { defaultValue: 'Guess the Temple' }),
          text: shareMessage,
          url: 'https://piromomo.com/mandir-chineu',
        });
      } else {
        await navigator.clipboard.writeText(shareMessage);
        alert(t('guessTemple.clipboardMessage', { defaultValue: 'Score copied to clipboard!' }));
      }
    } catch (error) {
      console.error('Sharing failed:', error);
      try {
        await navigator.clipboard.writeText(shareMessage);
        alert(t('guessTemple.clipboardMessage', { defaultValue: 'Score copied to clipboard!' }));
      } catch (copyError) {
        console.error('Clipboard copy failed:', copyError);
        alert(t('guessTemple.shareFailedError', {defaultValue: 'Could not share or copy score.'}));
      }
    }
  };

  if (!isInitialized || (!currentTemple && templeIds.length > 0)) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">{t('loading', { defaultValue: 'Loading...' })}</p>
        </div>
      </div>
    );
  }

  if (templeIds.length === 0 && isInitialized) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center p-6 bg-white rounded-lg shadow-xl">
          <h2 className="text-xl font-semibold text-red-600 mb-4">
            {t('guessTemple.noTemplesInCategoryTitle', { defaultValue: 'No Temples Found' })}
          </h2>
          <p className="text-gray-700 mb-6">
            {t('guessTemple.noTemplesInCategoryMessage', { defaultValue: 'There are no temples available for the selected category. Please select a different category or add temple data.' })}
          </p>
          <select
            id="category-select"
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            aria-label={t('guessTemple.selectCategory', { defaultValue: 'Select Category' })}
          >
            <option value={CATEGORIES.ALL}>
              {t('guessTemple.categoryAll', { defaultValue: 'All Nepal' })}
            </option>
            <option value={CATEGORIES.KATHMANDU_VALLEY}>
              {t('guessTemple.categoryKathmanduValley', { defaultValue: 'Kathmandu Valley' })}
            </option>
            <option value={CATEGORIES.PROVINCE_1}>
              {t('guessTemple.categoryProvince1', { defaultValue: 'Province 1 (Koshi)' })}
            </option>
            <option value={CATEGORIES.PROVINCE_2}>
              {t('guessTemple.categoryProvince2', { defaultValue: 'Province 2 (Madhesh)' })}
            </option>
            <option value={CATEGORIES.BAGMATI}>
              {t('guessTemple.categoryBagmati', { defaultValue: 'Bagmati Province' })}
            </option>
            <option value={CATEGORIES.GANDAKI}>
              {t('guessTemple.categoryGandaki', { defaultValue: 'Gandaki Province' })}
            </option>
            <option value={CATEGORIES.LUMBINI}>
              {t('guessTemple.categoryLumbini', { defaultValue: 'Lumbini Province' })}
            </option>
            <option value={CATEGORIES.KARNALI}>
              {t('guessTemple.categoryKarnali', { defaultValue: 'Karnali Province' })}
            </option>
            <option value={CATEGORIES.SUDURPASHCHIM}>
              {t('guessTemple.categorySudurpashchim', { defaultValue: 'Sudurpashchim Province' })}
            </option>
          </select>
        </div>
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
        <div className="flex-1 max-w-2xl mx-auto px-2 sm:px-4 py-8">
          <div className="min-h-screen w-full py-1 px-0 sm:px-4 md:px-6">
            <div className="max-w-3xl mx-auto">
              {/* Main Game Card */}
              <div className="bg-gradient-to-br from-blue-600 to-purple-500 p-1 rounded-xl shadow-lg mb-4">
                <div className="box-border px-4 py-6 text-white">
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">
                    {t('guessTemple.title', { defaultValue: 'Guess the Temple' })}
                  </h1>
                  <p className="text-base sm:text-lg">
                    {t('guessTemple.description', { defaultValue: 'Test your knowledge of Nepali temples and sacred sites!' })}
                  </p>
                </div>

                <div className="bg-white rounded-lg p-6">
                  {/* Game Controls & Category Selector */}
                  <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg px-3 py-1.5 flex items-center">
                        <span className="text-xs sm:text-sm text-gray-600 mr-2">{t('score', { defaultValue: 'Score' })}:</span>
                        <span className="text-lg sm:text-xl font-bold text-blue-700">{score}</span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={handleManualShuffle}
                          className="bg-yellow-100 p-1.5 sm:p-2 rounded-lg hover:bg-yellow-200 transition-colors"
                          title={t('guessTemple.shuffle', { defaultValue: 'Shuffle Temple' })}
                          aria-label={t('guessTemple.shuffle', { defaultValue: 'Shuffle Temple' })}
                          disabled={gameWon}
                        >
                          <ShuffleIcon className="h-4 w-4 text-yellow-700" />
                        </button>
                        <button
                          onClick={restartGame}
                          className="bg-gray-100 p-1.5 sm:p-2 rounded-lg hover:bg-gray-200 transition-colors"
                          title={t('guessTemple.restart', { defaultValue: 'Restart Game' })}
                          aria-label={t('guessTemple.restart', { defaultValue: 'Restart Game' })}
                        >
                          <RefreshCwIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <div className="w-full sm:w-auto">
                      <label htmlFor="category-select" className="sr-only">
                        {t('guessTemple.selectCategory', { defaultValue: 'Select Category' })}
                      </label>
                      <select
                        id="category-select"
                        value={selectedCategory}
                        onChange={handleCategoryChange}
                        className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        aria-label={t('guessTemple.selectCategory', { defaultValue: 'Select Category' })}
                      >
                        <option value={CATEGORIES.ALL}>
                          {t('guessTemple.categoryAll', { defaultValue: 'All Nepal' })}
                        </option>
                        <option value={CATEGORIES.KATHMANDU_VALLEY}>
                          {t('guessTemple.categoryKathmanduValley', { defaultValue: 'Kathmandu Valley' })}
                        </option>
                        <option value={CATEGORIES.PROVINCE_1}>
                          {t('guessTemple.categoryProvince1', { defaultValue: 'Province 1 (Koshi)' })}
                        </option>
                        <option value={CATEGORIES.PROVINCE_2}>
                          {t('guessTemple.categoryProvince2', { defaultValue: 'Province 2 (Madhesh)' })}
                        </option>
                        <option value={CATEGORIES.BAGMATI}>
                          {t('guessTemple.categoryBagmati', { defaultValue: 'Bagmati Province' })}
                        </option>
                        <option value={CATEGORIES.GANDAKI}>
                          {t('guessTemple.categoryGandaki', { defaultValue: 'Gandaki Province' })}
                        </option>
                        <option value={CATEGORIES.LUMBINI}>
                          {t('guessTemple.categoryLumbini', { defaultValue: 'Lumbini Province' })}
                        </option>
                        <option value={CATEGORIES.KARNALI}>
                          {t('guessTemple.categoryKarnali', { defaultValue: 'Karnali Province' })}
                        </option>
                        <option value={CATEGORIES.SUDURPASHCHIM}>
                          {t('guessTemple.categorySudurpashchim', { defaultValue: 'Sudurpashchim Province' })}
                        </option>
                      </select>
                    </div>
                  </div>

                  {/* Progress indicator */}
                  {templeIds.length > 1 && (
                    <div className="mb-4 text-center">
                      <div className="text-xs text-gray-500">
                        Round {completedRounds + 1} • Temple {Math.min(currentShuffleIndex, templeIds.length)} of {templeIds.length}
                        {completedRounds > 0 && ` (${completedRounds} round${completedRounds > 1 ? 's' : ''} completed)`}
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(Math.min(currentShuffleIndex, templeIds.length) / templeIds.length) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {gameWon ? (
                    <div className="text-center space-y-6 py-8">
                      <AwardIcon className="h-20 w-20 text-yellow-500 mx-auto animate-bounce" />
                      <h2 className="text-3xl font-bold text-green-600">
                        {t('guessTemple.gameWonTitle', { defaultValue: 'Congratulations! You Won!' })}
                      </h2>
                      <p className="text-lg text-gray-700">
                        {t('guessTemple.gameWonMessage', { defaultValue: 'You reached {winScore} points and mastered the temples!', winScore: 100 })}
                      </p>
                      <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <GameButton onClick={restartGame} type="primary" className="flex-1">
                          {t('guessTemple.playAgain', { defaultValue: 'Play Again' })}
                        </GameButton>
                        <ShareScore 
                          score={score} 
                          total={templeIds?.length || 100} 
                          gameTitle="Mandir Chineu" 
                          gameUrl="mandir-chineu"
                          className="flex-1"
                        />
                      </div>
                    </div>
                  ) : !isAnswered ? (
                    <div className="space-y-4">
                      {currentTemple && (
                        <>
                          {/* Enhanced Temple Image */}
                          <div className="relative group">
                            <div className="relative aspect-[16/9] max-h-[350px] w-full rounded-xl overflow-hidden shadow-xl bg-gradient-to-r from-blue-100 to-purple-100 border border-white/20">
                              {/* Loading Skeleton */}
                              <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse rounded-xl" />
                              
                              <Image
                                src={currentTemple.imagePath}
                                alt={t('guessTemple.templeToGuess', { defaultValue: 'Temple to guess' })}
                                fill
                                className="object-cover transition-all duration-500 group-hover:scale-105"
                                sizes="(max-width: 768px) 100vw, 67vw"
                                priority
                                onLoad={(e) => {
                                  // Hide loading skeleton
                                  e.currentTarget.previousElementSibling?.classList.add('hidden');
                                }}
                              />

                              {/* Hover Overlay */}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>
                          </div>

                          {/* Input Method */}
                          <div className="space-y-4">
                            <h3 className="text-lg font-semibold">
                              {t('guessTemple.typeTemplementName', { defaultValue: 'Type the temple name:' })}
                            </h3>

                            <form onSubmit={(e) => { e.preventDefault(); handleInputGuess(); }} className="space-y-3">
                              <label htmlFor="temple-guess" className="sr-only">
                                {t('guessTemple.enterTempleName', { defaultValue: 'Enter temple name...' })}
                              </label>
                              <input
                                id="temple-guess"
                                ref={inputRef}
                                type="text"
                                value={currentGuess}
                                onChange={(e) => setCurrentGuess(e.target.value)}
                                placeholder={t('guessTemple.enterTempleName', { defaultValue: 'Enter temple name...' })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                                disabled={isAnswered || gameWon}
                                aria-label={t('guessTemple.enterTempleName', { defaultValue: 'Enter temple name...' })}
                              />

                              <p className="text-sm text-gray-600 mt-1">
                                {t('guessTemple.inputHint', {
                                  defaultValue: 'Tip: You can type just the main name (e.g., "Pathibara" for "Pathivara Devi Temple"). Common spelling variations are accepted.'
                                })}
                              </p>

                              <GameButton
                                type="primary"
                                onClick={handleInputGuess}
                                disabled={!currentGuess.trim() || gameWon}
                                className="w-full py-3"
                              >
                                {t('guessTemple.submitGuess', { defaultValue: 'Submit Guess' })}
                              </GameButton>
                            </form>
                          </div>
                        </>
                      )}
                    </div>
                  ) : (
                    currentTemple && (
                      <div className="space-y-6">
                        {/* Result */}
                        <div className={`p-4 rounded-lg flex items-center gap-3 ${
                          isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                        }`}>
                          {isCorrect ? (
                            <CheckCircleIcon className="h-6 w-6 text-green-600" />
                          ) : (
                            <XCircleIcon className="h-6 w-6 text-red-600" />
                          )}
                          <div>
                            <h3 className="font-bold text-lg">
                              {isCorrect ? t('correct', { defaultValue: 'Correct!' }) : t('incorrect', { defaultValue: 'Incorrect' })}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {isCorrect
                                ? t('guessTemple.wellDone', { defaultValue: 'Well done! You got it right!' })
                                : `${t('incorrect', { defaultValue: 'Incorrect' })}. ${t('guessTemple.correctAnswerWas', { answer: currentTemple.name, defaultValue: 'The correct answer was: {answer}'})}`
                              }
                            </p>
                          </div>
                        </div>

                        {/* Temple Information */}
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h4 className="text-xl font-bold text-gray-900 mb-3">
                            {currentTemple.name}
                          </h4>

                          <div className="space-y-2 text-sm text-gray-600 mb-4">
                            {currentTemple.district && <p><strong>{t('guessTemple.district', { defaultValue: 'District' })}:</strong> {currentTemple.district}</p>}
                            <p><strong>{t('guessTemple.type', { defaultValue: 'Type' })}:</strong> {currentTemple.type}</p>
                            {currentTemple.built && (
                              <p><strong>{t('guessTemple.built', { defaultValue: 'Built' })}:</strong> {currentTemple.built}</p>
                            )}
                            {currentTemple.deity && (
                              <p><strong>{t('guessTemple.deity', { defaultValue: 'Primary Deity' })}:</strong> {currentTemple.deity}</p>
                            )}
                          </div>

                          {currentTemple.description && (
                            <p className="text-gray-700 leading-relaxed">
                              {currentTemple.description}
                            </p>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3">
                          <GameButton onClick={handleNextTemple} type="primary" className="flex-1">
                            {t('guessTemple.nextTemple', { defaultValue: 'Next Temple' })} →
                          </GameButton>
                          <GameButton onClick={handleShareScore} type="success" className="flex-1">
                            {t('shareScore', { defaultValue: 'Share Score' })}
                          </GameButton>
                        </div>
                      </div>
                    )
                  )}
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