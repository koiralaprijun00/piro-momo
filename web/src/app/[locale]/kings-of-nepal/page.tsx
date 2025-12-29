'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import AdSenseGoogle from '@/components/AdSenseGoogle';
import { FiShare2 } from 'react-icons/fi';
import kingsDataEn from '../../../../messages/kings-of-nepal-en.json';
import kingsDataNp from '../../../../messages/kings-of-nepal-np.json';

interface King {
  id: string;
  name: string;
  nameNp: string;
  acceptableAnswers: string[];
}

interface KingData {
  id: string;
  title: string;
  description: string;
  reign_years: string;
  image: string;
}

interface KingsData {
  kingsofnepal: { [key: string]: KingData };
}

const nepaliNumerals: { [key: string]: string } = {
  '0': '०', '1': '१', '2': '२', '3': '३', '4': '४',
  '5': '५', '6': '६', '7': '७', '8': '८', '9': '९'
};

const toNepaliNumerals = (num: string): string => {
  return num.split('').map(digit => nepaliNumerals[digit] || digit).join('');
};

export default function KingsOfNepalQuiz() {
  const [input, setInput] = useState('');
  const [gameStarted, setGameStarted] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState<string[]>([]);
  const [gaveUp, setGaveUp] = useState(false);
  
  const t = useTranslations('Translations');
  const locale = useLocale();
  const inputRef = useRef<HTMLInputElement>(null);

  const sortedKings = useMemo<King[]>(() => {
    const kingsIds = Object.keys(kingsDataEn.kingsofnepal);

    return kingsIds.map(id => {
      const en = (kingsDataEn as KingsData).kingsofnepal[id];
      const np = (kingsDataNp as KingsData).kingsofnepal[id];

      if (!en || !np) {
        console.warn(`Missing data for king with id: ${id}`);
        return null;
      }

      return {
        id,
        name: en.title,
        nameNp: np.title,
        acceptableAnswers: [en.title, np.title]
      };
    }).filter((king): king is King => king !== null);
  }, []);

  const getLocalizedName = (king: King) => {
    return locale === 'np' ? king.nameNp : king.name;
  };

  const getLocalizedDateRange = (king: King) => {
    const kingsData = locale === 'np' ? kingsDataNp : kingsDataEn;
    const kingData = (kingsData as KingsData).kingsofnepal[king.id];
    
    if (!kingData || !kingData.reign_years) {
      return locale === 'np' ? 'वि.सं. अज्ञात' : 'Unknown dates';
    }

    return kingData.reign_years;
  };

  const isAnswerCorrect = (input: string, king: King): boolean => {
    const normalizedInput = input.trim().toLowerCase();
    return king.acceptableAnswers.some(answer => {
      const normalizedAnswer = answer.toLowerCase().trim();
      const removeSuffix = (str: string) => str.replace(/\s*(shah|bir\s*bikram)\s*$/i, '').trim();
      const getFirstName = (str: string) => str.split(' ')[0].toLowerCase().trim();
      
      const normalizedInputNoSuffix = removeSuffix(normalizedInput);
      const normalizedAnswerNoSuffix = removeSuffix(normalizedAnswer);
      
      return normalizedInputNoSuffix === normalizedAnswerNoSuffix ||
             getFirstName(normalizedInput) === getFirstName(normalizedAnswer);
    });
  };

  /* 
    State Logic:
    1. Check localStorage on mount.
    2. If found, load it.
    3. If not found, start fresh.
    4. Save to localStorage on any state change.
  */

  useEffect(() => {
    const savedState = localStorage.getItem('kingsOfNepalState');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        setCorrectAnswers(parsed.correctAnswers || []);
        setGameOver(parsed.gameOver || false);
        setGaveUp(parsed.gaveUp || false);
        setGameStarted(true); // Always started if we have state
      } catch (e) {
        console.error("Failed to parse saved state", e);
        setGameStarted(true);
      }
    } else {
       // Start fresh
       setGameStarted(true);
    }
  }, []);

  // Persist state
  useEffect(() => {
    if (gameStarted) { // Only save if game has properly initialized/started
        const stateToSave = {
            correctAnswers,
            gameOver,
            gaveUp,
            lastPlayed: new Date().toISOString()
        };
        localStorage.setItem('kingsOfNepalState', JSON.stringify(stateToSave));
    }
  }, [correctAnswers, gameOver, gaveUp, gameStarted]);

  const percentComplete = (correctAnswers.length / sortedKings.length) * 100;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);
    const matchedKing = sortedKings.find(king => 
      !correctAnswers.includes(king.id) && isAnswerCorrect(value, king)
    );
    if (matchedKing) {
      const newCorrect = [...correctAnswers, matchedKing.id];
      setCorrectAnswers(newCorrect);
      setInput('');
      if (newCorrect.length === sortedKings.length) {
        setGameOver(true);
      }
    }
  };

  const startGame = () => {
    setGameStarted(true);
    setCorrectAnswers([]);
    setGameOver(false);
    setGaveUp(false);
    setInput('');
    setTimeout(() => inputRef.current?.focus(), 100);
    // Clear legacy or previous state explicitly if implementing a "hard reset"
    localStorage.removeItem('kingsOfNepalState'); 
  };

  const handleGiveUp = () => {
    setGameOver(true);
    setGaveUp(true);
  };

  const handlePlayAgain = () => {
    startGame();
  };

  const handleShareScore = async () => {
    const scoreText = t('shareScoreText', {
      count: correctAnswers.length,
      total: sortedKings.length
    });
    try {
      if (navigator.share) {
        await navigator.share({
          title: t('shareScoreTitle'),
          text: scoreText,
          url: t('shareScoreUrl')
        });
      } else {
        await navigator.clipboard.writeText(scoreText);
        alert(t('scoreCopiedAlert'));
      }
    } catch (error) {
      console.error('Error sharing score:', error);
    }
  };

  const safeT = (key: string, defaultValue: string = '', params: Record<string, any> = {}) => {
    try {
      return t(key, params);
    } catch (error) {
      console.warn(`Translation key not found: ${key}`);
      return defaultValue;
    }
  };

  return (
    <div className="min-h-screen w-full">
      <div className="flex justify-center">
        <div className="hidden lg:block w-[160px] sticky top-24 self-start h-[600px] ml-4">
          <AdSenseGoogle adSlot="6865219846" adFormat="vertical" style={{ width: '160px', height: '400px' }} />
        </div>

        <div className="flex-1 px-4 py-8">
          <div className="flex flex-col md:flex-row gap-6 max-w-5xl mx-auto">
            <div className="md:w-1/3 space-y-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="mb-6">
                  <h1 className="text-3xl font-bold text-left bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-red-500 mb-2">
                    {safeT('kingQuizTitle', 'Write all Kings of Nepal Quiz')}
                  </h1>
                  <p className="text-left text-gray-600">
                    {safeT('quizInstructions', `You have 5 minutes to name all ${sortedKings.length} kings who ruled Nepal.`, { kingCount: sortedKings.length })}
                  </p>
                  <p className="text-left text-gray-600 mt-2">
                    {safeT('typeNamesInstruction', 'Type the names of the kings in the input field.')}
                  </p>
                </div>

                <div className="mb-6">
                  <h2 className="text-sm mb-2">{t('progress')}</h2>
                  <div className="bg-gradient-to-r from-blue-600 to-red-500 p-0.5 rounded-lg">
                    <div className="bg-white rounded-md p-2 flex justify-between items-center">
                      <div className="flex items-center">
                        <span className="text-xl font-bold">{correctAnswers.length}</span>
                        <span className="ml-2 text-gray-600">/ {sortedKings.length}</span>
                      </div>
                      <div className="bg-gray-100 px-2 py-0.5 rounded-full">
                        <span className="font-mono text-gray-800">{Math.round(percentComplete)}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {!gameStarted && !gameOver && (
                  <button
                    onClick={startGame}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition"
                  >
                    {safeT('startQuiz', 'Start Quiz')}
                  </button>
                )}

                {gameStarted && !gameOver && (
                  <button
                    onClick={handleGiveUp}
                    className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md transition"
                  >
                    {safeT('giveUpButton', 'Give Up')}
                  </button>
                )}

                {gameOver && (
                  <div className="space-y-3">
                    <button
                      onClick={handlePlayAgain}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition"
                    >
                      {safeT('playAgainButton', 'Play Again')}
                    </button>
                    <button
                      onClick={handleShareScore}
                      className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-md transition flex items-center justify-center"
                    >
                      <FiShare2 className="h-5 w-5 mr-2" />
                      {safeT('shareScoreButton', 'Share Score')}
                    </button>
                  </div>
                )}

                <Link href="/kings-of-nepal/about" className="block mt-6 text-blue-600 hover:underline text-sm">
                  {safeT('learnAboutKingsLink', 'Learn about the Kings of Nepal')}
                </Link>
              </div>
            </div>

            <div className="md:w-2/3">
              <div className="bg-gradient-to-br from-blue-600 to-red-500 p-1 rounded-xl shadow-lg">
                <div className="bg-white rounded-lg p-6">
                  {gameStarted && !gameOver && (
                    <div>
                      <div className="mb-4">
                        <h2 className="text-xl font-bold mb-2">{t('KingsofNepalTitle')}</h2>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${percentComplete}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <input
                          ref={inputRef}
                          type="text"
                          value={input}
                          onChange={handleInputChange}
                          placeholder={safeT('inputPlaceholder', "Type a king's name...")}
                          className="w-full p-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          autoComplete="off"
                          autoCapitalize="off"
                          spellCheck="false"
                        />
                      </div>

                      <div className="overflow-hidden rounded-lg border border-gray-200">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {safeT('numberSymbol', '#')}
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {safeT('reignLabel', 'Reign')}
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {safeT('kingNameLabel', 'King')}
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {sortedKings.map((king, index) => (
                              <tr key={king.id} className={correctAnswers.includes(king.id) ? "bg-green-50" : ""}>
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{getLocalizedDateRange(king)}</td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                  {correctAnswers.includes(king.id) ? (
                                    <span className="font-medium">{getLocalizedName(king)}</span>
                                  ) : (
                                    <span className="text-gray-400">{safeT('unguessedPlaceholder', '?????')}</span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {gameOver && (
                    <div>
                      <div className="mb-6">
                        <h2 className="text-2xl font-bold mb-2">
                          {gaveUp
                            ? safeT('gaveUpHeading', 'You Gave Up')
                            : correctAnswers.length === sortedKings.length
                              ? safeT('perfectScoreHeading', 'Perfect Score!')
                              : safeT('timesUpHeading', 'Game Over!')}
                        </h2>
                        <p className="text-gray-600">
                          You got {correctAnswers.length} out of {sortedKings.length} kings correct.
                        </p>
                      </div>

                      <div className="overflow-hidden rounded-lg border border-gray-200 mb-6">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {safeT('numberSymbol', '#')}
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {safeT('reignLabel', 'Reign')}
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {safeT('kingNameLabel', 'King')}
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {sortedKings.map((king, index) => (
                              <tr key={king.id} className={correctAnswers.includes(king.id) ? "bg-green-50" : "bg-red-50"}>
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{getLocalizedDateRange(king)}</td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 font-medium">
                                  {getLocalizedName(king)}
                                  {correctAnswers.includes(king.id) ? (
                                    <span className="ml-2 text-green-600">✓</span>
                                  ) : (
                                    <span className="ml-2 text-red-600">✗</span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="hidden lg:block w-[160px] sticky top-24 self-start h-[600px] mr-4">
          <AdSenseGoogle adSlot="9978468343" adFormat="vertical" style={{ width: '160px', height: '400px' }} />
        </div>
      </div>
    </div>
  );
}
