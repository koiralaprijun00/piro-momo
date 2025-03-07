'use client';
import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import GuessFestivalHeader from '../guess-festival-components/GuessFestivalHeader';
import ScoreBoard from '../guess-festival-components/ScoreBoard';
import QuizSection from '../guess-festival-components/QuizSection';
import AnswerReveal from '../guess-festival-components/AnswerReveal';
import { festivalAssets } from '../../data/guess-festival/festival-assets';

export default function Home() {
  const locale = useLocale();
  const t = useTranslations('festivals');
  const commonT = useTranslations('common');
  const gamesT = useTranslations('games.guessFestival');
  
  // Get all festival IDs
  const festivalIds = Object.keys(festivalAssets);
  
  const [currentFestivalId, setCurrentFestivalId] = useState<keyof FestivalAssets>(festivalIds[0] as keyof FestivalAssets);
  const [clueIndex, setClueIndex] = useState<number>(0);
  const [guess, setGuess] = useState<string>('');
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string>('');
  const [gameMode, setGameMode] = useState<'standard' | 'timed'>('standard');
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [timerActive, setTimerActive] = useState<boolean>(false);
  const [festivalHistory, setFestivalHistory] = useState<string[]>([]);
  const [options, setOptions] = useState<string[]>([]);

  // Get current festival data
  const getCurrentFestival = () => {
    return {
      id: currentFestivalId,
      name: t(`${String(currentFestivalId)}.name`),
      question: t(`${String(currentFestivalId)}.question`),
      clues: [
        t(`${String(currentFestivalId)}.clues.0`),
        t(`${String(currentFestivalId)}.clues.1`),
        t(`${String(currentFestivalId)}.clues.2`)
      ],
      fact: t(`${String(currentFestivalId)}.fact`),
      sound: festivalAssets[currentFestivalId as keyof typeof festivalAssets]?.sound || '/sounds/default.mp3',
      image: festivalAssets[currentFestivalId as keyof typeof festivalAssets]?.image || '/images/default.jpg',
    };
  };

  const handleShareScore = async () => {
    const shareMessage = `I scored ${score} points in the Nepali Festival Quiz! Can you beat me? Try it at: piromomo.com/guess-festival #NepaliFestivals`;
    const shareData = {
      title: 'Nepali Festival Quiz Score',
      text: shareMessage,
      url: 'https://piromomo.com/guess-festival', 
    };

    try {
      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareMessage);
        alert('Score copied to clipboard! Paste it to share.');
      }
    } catch (error) {
      console.error('Sharing failed:', error);
      await navigator.clipboard.writeText(shareMessage);
      alert('Score copied to clipboard! Paste it to share.');
    }
  };

  const generateOptions = (correctFestivalId: string) => {
    // Get 3 random festival IDs different from the correct one
    const otherFestivalIds = festivalIds.filter(id => id !== correctFestivalId);
    const randomIds = otherFestivalIds
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    
    // Add correct festival ID and shuffle
    const optionIds = [correctFestivalId, ...randomIds].sort(() => 0.5 - Math.random());
    
    // Get the names from the translations
    setOptions(optionIds.map(id => t(`${id}.name`)));
  };

  useEffect(() => {
    shuffleFestivals();
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (gameMode === 'timed' && timerActive && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (gameMode === 'timed' && timeLeft === 0 && !isAnswered) {
      handleTimeUp();
    }
    return () => { if (timer) clearInterval(timer); };
  }, [timeLeft, timerActive, gameMode, isAnswered]);

  useEffect(() => {
    if (isAnswered) {
      try {
        const currentFestival = getCurrentFestival();
        const audio = new Audio(isCorrect ? currentFestival.sound : '/sounds/wrong_answer.mp3');
        audio.volume = 0.5;
        audio.play().catch(() => console.log('Audio play failed'));
      } catch (error) {
        console.log('Audio play error:', error);
      }
    }
  }, [isAnswered, isCorrect]);

  const shuffleFestivals = () => {
    const randomIndex = Math.floor(Math.random() * festivalIds.length);
    const newFestivalId = festivalIds[randomIndex];
    setCurrentFestivalId(newFestivalId);
    generateOptions(newFestivalId);
    setClueIndex(0);
    setGuess('');
    setIsAnswered(false);
    setIsCorrect(false);
    setFeedback('');
    if (gameMode === 'timed') {
      setTimeLeft(30);
      setTimerActive(true);
    }
  };

  const handleNextClue = () => {
    if (clueIndex < 2) { // 3 clues per festival (0-indexed)
      setClueIndex(clueIndex + 1);
    }
  };

  const handleGuess = (selectedOption: string) => {
    if (isAnswered) return;
    
    const currentFestival = getCurrentFestival();
    const isGuessCorrect = selectedOption === currentFestival.name;
    
    if (isGuessCorrect) {
      const cluePoints = 3 - clueIndex;
      const newPoints = Math.max(1, cluePoints) * (gameMode === 'timed' ? 2 : 1);
      setScore(prevScore => prevScore + newPoints);
      setFeedback(`+${newPoints} points!`);
      setIsCorrect(true);
    } else {
      setFeedback(commonT('tryAgain'));
      setIsCorrect(false);
    }
    
    setGuess(selectedOption);
    setIsAnswered(true);
    setFestivalHistory(prev => [...prev, String(currentFestivalId)]);
    if (gameMode === 'timed') setTimerActive(false);
  };

  const handleNextFestival = () => {
    let availableFestivalIds = festivalIds.filter(
      id => !festivalHistory.slice(-Math.min(3, festivalIds.length - 1)).includes(id)
    );
    
    if (availableFestivalIds.length === 0) {
      setFestivalHistory([currentFestivalId]);
      availableFestivalIds = festivalIds.filter(id => id !== currentFestivalId);
    }
    
    const nextIndex = Math.floor(Math.random() * availableFestivalIds.length);
    const newFestivalId = availableFestivalIds[nextIndex];
    
    setCurrentFestivalId(newFestivalId);
    generateOptions(newFestivalId);
    setClueIndex(0);
    setGuess('');
    setIsAnswered(false);
    setIsCorrect(false);
    setFeedback('');
    
    if (gameMode === 'timed') {
      setTimeLeft(30);
      setTimerActive(true);
    }
  };

  const handleTimeUp = () => {
    setIsAnswered(true);
    setIsCorrect(false);
    setFeedback(commonT('timeUp') || "Time's up!");
    setTimerActive(false);
  };

  const switchGameMode = (mode: 'standard' | 'timed') => {
    setGameMode(mode);
    restartGame();
  };

  const restartGame = () => {
    setScore(0);
    setFestivalHistory([]);
    shuffleFestivals();
    if (gameMode === 'timed') {
      setTimeLeft(30);
      setTimerActive(true);
    }
  };

  const currentFestival = getCurrentFestival();

  return (
    <div className="min-h-screen flex justify-center scale-90">
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-20 left-10 w-40 h-40 bg-orange-200 dark:bg-orange-700 opacity-20 rounded-full animate-float"></div>
        <div className="absolute bottom-40 right-20 w-32 h-32 bg-yellow-200 dark:bg-yellow-700 opacity-20 rounded-full animate-float-delay"></div>
        <div className="absolute top-1/2 left-1/4 w-36 h-36 bg-red-200 dark:bg-red-700 opacity-20 rounded-full animate-float-slow"></div>
      </div>
      
      <div className="relative z-10 w-full md:max-w-3xl">
        <div className="flex flex-col pt-4 md:py-12 md:px-10 bg-gradient-to-b from-white via-yellow-50 to-orange-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-800 rounded-3xl shadow-none md:shadow-2xl">
          
          <GuessFestivalHeader
            gameMode={gameMode}
            switchGameMode={switchGameMode}
          />
          
          <ScoreBoard
            score={score}
            gameMode={gameMode}
            timeLeft={timeLeft}
          />
          
          <div className="relative p-1 rounded-xl bg-gradient-to-br from-orange-400 to-purple-500 mb-6 shadow-lg">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 md:p-8">
              <QuizSection
                currentFestival={currentFestival}
                clueIndex={clueIndex}
                handleNextClue={handleNextClue}
                isAnswered={isAnswered}
                options={options}
                handleGuess={handleGuess}
              />
              
              <AnswerReveal
                isAnswered={isAnswered}
                isCorrect={isCorrect}
                feedback={feedback}
                currentFestival={currentFestival}
                handleNextFestival={handleNextFestival}
                restartGame={restartGame}
                handleShareScore={handleShareScore}
                score={score}
                isNepali={locale === 'ne'}
                translations={t}
              />
            </div>
          </div>          
        </div>
      </div>
    </div>
  );
}