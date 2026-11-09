"use client";

import { useCallback, useEffect, useMemo, useReducer, useRef } from 'react';
import { useTranslations, useLocale } from "next-intl";
import { getFestivalsByLocale } from "@/app/data/guess-festival/getFestivals"; // Import utility
import { Festival } from "@/app/data/guess-festival/festival"; // Import Festival type
import AdSenseGoogle from "@/components/AdSenseGoogle";
import GameButton from "@/components/ui/GameButton";
import { Sparkles, Flame } from "lucide-react";
import {
  festivalReducer,
  initialFestivalState,
  pickNextFestivalId,
  type FestivalMode,
  type Round,
} from "@/lib/games/festival";
import { STORAGE_KEYS, readSaved, writeSaved, type SavedGuessFestival } from "@/lib/storage";

// QuizSection Component
interface QuizSectionProps {
  currentFestival: Festival;
  isAnswered: boolean;
  options: string[];
  handleGuess: (option: string) => void;
}

const QuizSection: React.FC<QuizSectionProps> = ({
  currentFestival,
  isAnswered,
  options,
  handleGuess,
}) => {
  const t = useTranslations("Translations");

  return (
    <div>
      <h2 className="text-xl md:text-2xl font-lora mb-4">{currentFestival.question}</h2>

      {!isAnswered && (
        <div className="mb-6">
          <h3 className="text-md mb-3">{t("yourOptions")}:</h3>
          <div className="space-y-2">
            {options.map((option, index) => (
              <GameButton
                key={index}
                onClick={() => handleGuess(option)}
                type="neutral"
                fullWidth
                className="text-left justify-start transition-transform duration-200 hover:scale-105"
              >
                {option}
              </GameButton>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// AnswerReveal Component
interface AnswerRevealProps {
  isAnswered: boolean;
  isCorrect: boolean;
  feedback: string;
  currentFestival: Festival;
  handleNextFestival: () => void;
  restartGame: () => void;
  handleShareScore: () => void;
  score: number;
}

const AnswerReveal: React.FC<AnswerRevealProps> = ({
  isAnswered,
  isCorrect,
  feedback,
  currentFestival,
  handleNextFestival,
}) => {
  const t = useTranslations("Translations");

  if (!isAnswered) return null;

  return (
    <div className="mt-6 pt-6 border-t border-gray-200">
      <div className={`p-4 rounded-lg mb-4 ${isCorrect ? "bg-green-100" : "bg-red-100"}`}>
        <h3 className="text-xl font-bold mb-2">
          {isCorrect ? t("correct") : t("incorrect")}
        </h3>
      </div>

      <div className="flex gap-3 mb-4">
        <GameButton onClick={handleNextFestival} type="primary">
          {t("nextFestival")}
        </GameButton>
      </div>

      <div className="mb-4">
        <h3 className="text-xl font-semibold mb-2">
          <span className="text-md font-normal text-gray-600 mr-1">{t("correctAnswer")}:</span>
          {currentFestival.name}
        </h3>
        <p className="text-md leading-8">{currentFestival.fact}</p>
      </div>
    </div>
  );
};

// Mobile Footer Component
const MobileFooter: React.FC<{
  gameMode: "standard" | "timed";
  switchGameMode: (mode: "standard" | "timed") => void;
  restartGame: () => void;
}> = ({ gameMode, switchGameMode, restartGame }) => {
  const t = useTranslations("Translations");

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-2 z-10">
      <div className="flex justify-between items-center">
        <div className="flex gap-1">
          <GameButton
            type={gameMode === "standard" ? "grayNeutral" : "neutral"}
            onClick={() => switchGameMode("standard")}
            size="sm"
            className="py-1 text-xs rounded-md"
          >
            {t("games.guessFestival.Standard")}
          </GameButton>
          <GameButton
            type={gameMode === "timed" ? "danger" : "neutral"}
            onClick={() => switchGameMode("timed")}
            size="sm"
            className="py-1 text-xs rounded-md"
          >
            {t("games.guessFestival.Timed")}
          </GameButton>
        </div>

        <GameButton
          onClick={restartGame}
          type="neutral"
          size="sm"
          className="py-1 text-xs"
        >
          {t("games.guessFestival.restart")}
        </GameButton>
      </div>
    </div>
  );
};

const StatBadges: React.FC<{ score: number; streak: number }> = ({ score, streak }) => (
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

// Main Home Component
export default function Home() {
  const locale = useLocale();
  const t = useTranslations("Translations");

  const festivals = useMemo(() => getFestivalsByLocale(locale) as Festival[], [locale]);
  const festivalIds = useMemo(() => festivals.map((festival: Festival) => festival.id), [festivals]);

  const [game, dispatch] = useReducer(festivalReducer, initialFestivalState);
  const { phase, mode: gameMode, round, outcome, pointsAwarded, timeLeft, score, streak, bestStreak, history } = game;

  // Builds a round (festival + 4 shuffled options). Randomness stays out of the reducer.
  const buildRound = useCallback(
    (previousHistory: string[], currentId: string | null): Round | null => {
      const festivalId = pickNextFestivalId(festivalIds, previousHistory, currentId);
      if (!festivalId) return null;
      const others = festivalIds.filter((id) => id !== festivalId).sort(() => 0.5 - Math.random()).slice(0, 3);
      const optionIds = [festivalId, ...others].sort(() => 0.5 - Math.random());
      const options = optionIds
        .map((id) => festivals.find((f) => f.id === id)?.name)
        .filter((name): name is string => Boolean(name));
      return { festivalId, options };
    },
    [festivalIds, festivals]
  );

  // Restore saved stats once, then start the first round (and a new one when the language changes).
  const restored = useRef(false);
  useEffect(() => {
    const saved = readSaved<SavedGuessFestival>(STORAGE_KEYS.guessFestival);
    if (saved) {
      dispatch({
        type: 'RESTORE',
        score: saved.score || 0,
        streak: saved.streak || 0,
        bestStreak: saved.bestStreak || 0,
        history: Array.isArray(saved.festivalHistory) ? saved.festivalHistory : [],
      });
    }
    restored.current = true;
  }, []);

  useEffect(() => {
    const first = buildRound([], null);
    if (first) dispatch({ type: 'NEXT_ROUND', round: first });
  }, [buildRound]);

  // Save stats (same key and shape as before, so profile sync keeps working).
  useEffect(() => {
    if (!restored.current) return;
    if (score > 0 || history.length > 0) {
      writeSaved<SavedGuessFestival>(STORAGE_KEYS.guessFestival, {
        score,
        streak,
        bestStreak,
        festivalHistory: history,
        lastPlayed: new Date().toISOString(),
      });
    }
  }, [score, streak, bestStreak, history]);

  // Timed mode: one interval while a question is open. The reducer handles time running out.
  useEffect(() => {
    if (gameMode !== 'timed' || phase !== 'asking') return;
    const timer = setInterval(() => dispatch({ type: 'TICK' }), 1000);
    return () => clearInterval(timer);
  }, [gameMode, phase, round]);

  const getCurrentFestival = (): Festival | undefined =>
    festivals.find((festival) => festival.id === round?.festivalId);

  const isAnswered = phase === 'revealed';
  const isCorrect = outcome === 'correct';
  const options = round?.options ?? [];
  const feedback =
    outcome === 'correct'
      ? `+${pointsAwarded} ${t("points")}`
      : outcome === 'timeout'
        ? t("timeUp")
        : outcome === 'wrong'
          ? t("tryAgain")
          : "";

  const handleShareScore = async () => {
    const shareMessage = t("shareMessage", {
      score,
      url: "https://piromomo.com/guess-festival",
    });
    const shareData = {
      title: t("shareScore"),
      text: shareMessage,
      url: "https://piromomo.com/guess-festival",
    };

    try {
      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareMessage);
        alert(t("games.guessFestival.clipboardMessage"));
      }
    } catch (error) {
      console.error("Sharing failed:", error);
      await navigator.clipboard.writeText(shareMessage);
      alert(t("games.guessFestival.clipboardMessage"));
    }
  };

  const handleGuess = (selectedOption: string) => {
    const currentFestival = getCurrentFestival();
    if (!currentFestival) return;
    dispatch({ type: 'GUESS', option: selectedOption, correctName: currentFestival.name });
  };

  const handleNextFestival = () => {
    const next = buildRound(history, round?.festivalId ?? null);
    if (next) dispatch({ type: 'NEXT_ROUND', round: next });
  };

  const switchGameMode = (mode: FestivalMode) => {
    const next = buildRound([], null);
    if (next) dispatch({ type: 'SET_MODE', mode, round: next });
  };

  const restartGame = () => {
    const next = buildRound([], null);
    if (next) dispatch({ type: 'RESTART', round: next });
  };

  const currentFestival = getCurrentFestival();

  if (!currentFestival) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen w-full">
      <div className="flex justify-center">
       
       
      <div className="hidden lg:block w-[160px] sticky top-24 self-start h-[600px] ml-4">
  <AdSenseGoogle
    adSlot="6865219846"
    adFormat="vertical"
    style={{ width: "160px", height: "600px" }}
    className="w-full h-full"
  />
</div>

        <div className="flex-1 px-4 py-8 pb-16 md:pb-8">
          <div className="md:hidden mb-6">
            <h1 className="text-2xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-red-500">
              {t("games.guessFestival.title")}
            </h1>
          </div>

          <div className="flex flex-col md:flex-row gap-6 max-w-5xl mx-auto">
            <div className="hidden md:block md:w-1/3 space-y-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="mb-8">
                  <h1 className="text-3xl font-bold text-left bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-red-500 mb-2">
                    {t("games.guessFestival.title")}
                  </h1>
                  <p className="text-left text-gray-600">{t("games.guessFestival.description")}</p>
                </div>

                <div className="mb-6">
                  <h2 className="text-sm mb-2">{t("games.guessFestival.mode")}:</h2>
                  <div className="flex gap-2">
                    <GameButton
                      type={gameMode === "standard" ? "grayNeutral" : "neutral"}
                      onClick={() => switchGameMode("standard")}
                      size="sm"
                      fullWidth
                      className="py-1 text-sm rounded-md"
                    >
                      {t("games.guessFestival.Standard")}
                    </GameButton>
                    <GameButton
                      type={gameMode === "timed" ? "danger" : "neutral"}
                      onClick={() => switchGameMode("timed")}
                      size="sm"
                      fullWidth
                      className="py-1 text-sm rounded-md"
                    >
                      {t("games.guessFestival.Timed")}
                    </GameButton>
                  </div>
                </div>

                <GameButton onClick={restartGame} type="neutral" size="sm" className="mt-6 mr-2">
                  {t("games.guessFestival.restart")}
                </GameButton>

                {isAnswered && (
                  <GameButton onClick={handleShareScore} type="success" size="sm" className="mt-3">
                    {t("shareScore")}
                  </GameButton>
                )}
              </div>
            </div>

            <div className="md:w-2/3 w-full">
              <div className="bg-gradient-to-br from-blue-600 to-red-500 p-1 rounded-xl shadow-lg">
                <div className="bg-white rounded-lg p-4 md:p-6">
                  <div className="bg-gradient-to-r from-blue-600 to-red-500 rounded-2xl p-4 mb-6 text-white">
                    <StatBadges score={score} streak={streak} />
                    {gameMode === "timed" && (
                      <div className={`mt-3 text-center text-sm font-mono ${timeLeft <= 10 ? "text-red-100" : "text-white/80"}`}>
                        {timeLeft}s
                      </div>
                    )}
                  </div>
                  <QuizSection
                    currentFestival={currentFestival}
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
                  />
                </div>
              </div>
            </div>
          </div>
        </div>


<div className="hidden lg:block w-[160px] sticky top-24 self-start h-[600px] mr-4">
  <AdSenseGoogle
    adSlot="9978468343"
    adFormat="vertical"
    style={{ width: "160px", height: "600px" }}
    className="w-full h-full"
  />
</div>
      </div>

      <MobileFooter gameMode={gameMode} switchGameMode={switchGameMode} restartGame={restartGame} />
    </div>
  );
}
