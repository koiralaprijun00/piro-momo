'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { getLogosByLocale, Logo } from '../../data/logo-quiz/getLogos';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { HiInformationCircle } from 'react-icons/hi';
import AdSenseGoogle from '@/components/AdSenseGoogle';
import GameButton from '@/components/ui/GameButton';

// Refactored imports
import { useLogoQuiz } from '@/hooks/useLogoQuiz';
import LogoCard from '@/components/logo-quiz/LogoCard';
import GameHeader from '@/components/logo-quiz/GameHeader';
import ResultsScreen from '@/components/logo-quiz/ResultsScreen';

const LogoQuizGame = () => {
  const t = useTranslations('Translations');
  const locale = useLocale();
  
  // Logos per page management
  const [logosPerPage, setLogosPerPage] = useState(6);
  
  // Initial logos loading (only once or on reset)
  const [initialLogos] = useState(() => {
    const data = getLogosByLocale(locale);
    return [...data].sort(() => 0.5 - Math.random());
  });

  const {
    state,
    updateAnswer,
    checkAnswer,
    toggleTimer,
    setPage,
    submitGame,
    resetGame,
  } = useLogoQuiz(initialLogos, locale);

  const [currentFocusedLogo, setCurrentFocusedLogo] = useState<string | null>(null);

  // Resize listener
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setLogosPerPage(3);
      else if (window.innerWidth < 1024) setLogosPerPage(4);
      else setLogosPerPage(6);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const totalPages = Math.ceil(state.logos.length / logosPerPage);

  const formatTimeForDisplay = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, logoId: string) => {
    if (e.key === 'Enter' || e.key === 'ArrowRight') {
      e.preventDefault();
      checkAnswer(logoId);
      
      // Auto-focus logic can be improved later with refs, keeping simple for now
      setTimeout(() => {
        const nextInput = document.querySelector(`input[data-logo-id="${logoId}"]`) as HTMLInputElement;
        nextInput?.focus({ preventScroll: true });
      }, 50);
    }
  };

  const handleReset = () => {
    const data = getLogosByLocale(locale);
    const shuffled = [...data].sort(() => 0.5 - Math.random());
    resetGame(shuffled);
  };

  const handleShare = () => {
    const shareText = `I identified ${state.score} out of ${state.logos.length} logos in the Nepal Logo Quiz in ${formatTimeForDisplay(300 - state.timeLeft)}! Can you beat my score?`;
    if (navigator.share) {
      navigator.share({ title: 'My Logo Quiz Score', text: shareText, url: window.location.href });
    } else {
      navigator.clipboard.writeText(shareText).then(() => alert('Score copied to clipboard!'));
    }
  };

  if (state.showResults) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="flex-1 flex flex-col md:flex-row">
          <SidebarAd side="left" />
          <div className="flex-1 max-w-4xl mx-auto px-4 py-8">
            <ResultsScreen
              score={state.score}
              total={state.logos.length}
              accuracy={Math.round((state.score / state.logos.length) * 100)}
              timeUsed={formatTimeForDisplay(300 - state.timeLeft)}
              logos={state.logos}
              correctAnswers={state.correctAnswers}
              answers={state.answers}
              onReset={handleReset}
              onShare={handleShare}
              translations={{
                title: t('logoQuiz.title'),
                finalScore: t('logoQuiz.finalScore'),
                playAgain: t('logoQuiz.playAgain'),
                shareScore: t('logoQuiz.shareScore'),
              }}
            />
          </div>
          <SidebarAd side="right" />
        </div>
      </div>
    );
  }

  const currentPageLogos = state.logos.slice(
    state.currentPage * logosPerPage,
    (state.currentPage + 1) * logosPerPage
  );

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 flex flex-col md:flex-row">
        <SidebarAd side="left" />
        <div className="flex-1 max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-md p-6 min-h-[90vh] flex flex-col">
            <h1 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-red-500">
              {t('logoQuiz.title')}
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-2 mb-4">
              {t('logoQuiz.subtitle') || "Test your brand knowledge! Guess the logos and beat the clock."}
            </p>

            <div className="bg-blue-50 p-3 rounded-lg mb-4 text-xs sm:text-sm text-blue-700 flex items-center">
              <HiInformationCircle className="h-5 w-5 mr-2 shrink-0" />
              <span>{t('logoQuiz.proTip') || "Pro Tip: Images gradually become clearer with each incorrect guess!"}</span>
            </div>

            <GameHeader
              score={state.score}
              total={state.logos.length}
              timeLeft={formatTimeForDisplay(state.timeLeft)}
              isTimeLow={state.timeLeft < 60}
              timerActive={state.timerActive}
              onToggleTimer={toggleTimer}
              currentPage={state.currentPage}
              totalPages={totalPages}
              translations={{
                score: t('logoQuiz.score') || 'Score',
                page: 'Page',
                of: 'of',
              }}
            />

            <div className="mb-4 flex-grow">
              <AnimatePresence mode="wait">
                <motion.div
                  key={state.currentPage}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  {currentPageLogos.map((logo) => (
                    <LogoCard
                      key={logo.id}
                      logo={logo}
                      answer={state.answers[logo.id] || ''}
                      isCorrect={state.correctAnswers[logo.id]}
                      blurLevel={state.blurLevels[logo.id]}
                      attemptCount={state.attemptCounts[logo.id]}
                      maxAttempts={3}
                      isFocused={currentFocusedLogo === logo.id}
                      onInputChange={(val) => updateAnswer(logo.id, val)}
                      onKeyDown={(e) => handleKeyDown(e, logo.id)}
                      onFocus={() => setCurrentFocusedLogo(logo.id)}
                      placeholder={t('logoQuiz.enterLogoName') || "Enter logo name..."}
                    />
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex justify-between items-center mt-auto pt-4 gap-2">
              <button
                disabled={state.currentPage === 0}
                onClick={() => setPage(state.currentPage - 1)}
                className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg disabled:opacity-50"
              >
                <FiChevronLeft className="inline mr-1" /> Prev
              </button>
              <GameButton onClick={submitGame} type="primary" className="px-8">
                Submit All
              </GameButton>
              <button
                disabled={state.currentPage === totalPages - 1}
                onClick={() => setPage(state.currentPage + 1)}
                className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg disabled:opacity-50"
              >
                Next <FiChevronRight className="inline ml-1" />
              </button>
            </div>
          </div>
        </div>
        <SidebarAd side="right" />
      </div>
    </div>
  );
};

const SidebarAd = ({ side }: { side: 'left' | 'right' }) => (
  <div className={`hidden lg:block w-[160px] sticky top-24 self-start h-[600px] ${side === 'left' ? 'ml-4' : 'mr-4'}`}>
    <AdSenseGoogle
      adSlot={side === 'left' ? "6865219846" : "9978468343"}
      adFormat="vertical"
      style={{ width: '160px', height: '600px' }}
    />
  </div>
);

export default LogoQuizGame;
