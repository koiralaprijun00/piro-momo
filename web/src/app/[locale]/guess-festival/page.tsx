/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useCallback, useEffect, useMemo } from 'react';
import { useTranslations, useLocale } from "next-intl";
import { getFestivalsByLocale } from "@/app/data/guess-festival/getFestivals"; // Import utility
import { Festival } from "@/app/data/guess-festival/festival"; // Import Festival type
import AdSenseGoogle from "@/components/AdSenseGoogle";
import GameButton from "@/components/ui/GameButton";
import { Sparkles, Flame } from "lucide-react";

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
  const t = useTranslations("Translations"); // Add translations hook

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    // Force hydration match
    setTimeout(() => setMounted(true), 0);
  }, []);

  const festivals = useMemo(() => getFestivalsByLocale(locale) as Festival[], [locale]);
  const festivalIds = useMemo(() => festivals.map((festival: Festival) => festival.id), [festivals]);

  const [currentFestivalId, setCurrentFestivalId] = useState<string>(festivalIds[0]); // Use string instead of FestivalId
  const [guess, setGuess] = useState<string>("");
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [bestStreak, setBestStreak] = useState<number>(0);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string>("");
  const [gameMode, setGameMode] = useState<"standard" | "timed">("standard");
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [timerActive, setTimerActive] = useState<boolean>(false);
  const [festivalHistory, setFestivalHistory] = useState<string[]>([]); // Use string[] instead of FestivalId[]
  const [options, setOptions] = useState<string[]>([]);

  // Load from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('guessFestivalState');
    if (savedState) {
        try {
            const parsed = JSON.parse(savedState);
            setScore(parsed.score || 0);
            setStreak(parsed.streak || 0);
            setBestStreak(parsed.bestStreak || 0);
            setFestivalHistory(parsed.festivalHistory || []);
            // We could restore gameMode etc, but sticking to core stats is safer for game flow
        } catch (e) {
            console.error("Failed to parse Guess Festival state", e);
        }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (score > 0 || festivalHistory.length > 0) { // Only save if played
        const stateToSave = {
            score,
            streak,
            bestStreak,
            festivalHistory,
            lastPlayed: new Date().toISOString()
        };
        localStorage.setItem('guessFestivalState', JSON.stringify(stateToSave));
    }
  }, [score, streak, bestStreak, festivalHistory]);

  const getCurrentFestival = (): Festival => {
    return festivals.find((festival) => festival.id === currentFestivalId)!;
  };

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

  const generateOptions = useCallback((correctFestivalId: string) => {
    const otherFestivalIds = festivalIds.filter((id: string) => id !== correctFestivalId);
    const randomIds = otherFestivalIds.sort(() => 0.5 - Math.random()).slice(0, 3);
    const optionIds = [correctFestivalId, ...randomIds].sort(() => 0.5 - Math.random());
    setOptions(optionIds.map((id: string) => festivals.find((f: Festival) => f.id === id)!.name)); // Use festival name from data
  }, [festivalIds, festivals]);

  const handleTimeUp = useCallback(() => {
    setIsAnswered(true);
    setIsCorrect(false);
    setFeedback(t("timeUp"));
    setTimerActive(false);
    setStreak(0);
  }, [t]);

  const shuffleFestivals = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * festivalIds.length);
    const newFestivalId = festivalIds[randomIndex];
    setCurrentFestivalId(newFestivalId);
    generateOptions(newFestivalId);
    setGuess("");
    setIsAnswered(false);
    setIsCorrect(false);
    setFeedback("");
    if (gameMode === "timed") {
      setTimeLeft(30);
      setTimerActive(true);
    }
  }, [festivalIds, generateOptions, gameMode]);

  useEffect(() => {
    setTimeout(() => shuffleFestivals(), 0);
  }, [shuffleFestivals]);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (gameMode === "timed" && timerActive && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (gameMode === "timed" && timeLeft === 0 && !isAnswered) {
      setTimeout(() => handleTimeUp(), 0);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [timeLeft, timerActive, gameMode, isAnswered, handleTimeUp]);

  const handleGuess = (selectedOption: string) => {
    if (isAnswered) return;

    const currentFestival = getCurrentFestival();
    const isGuessCorrect = selectedOption === currentFestival.name;

    if (isGuessCorrect) {
      const newPoints = Math.max(1) * (gameMode === "timed" ? 2 : 1);
      setScore((prevScore) => prevScore + newPoints);
      setFeedback(`+${newPoints} ${t("points")}`);
      setIsCorrect(true);
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > bestStreak) {
        setBestStreak(newStreak);
      }
    } else {
      setFeedback(t("tryAgain"));
      setIsCorrect(false);
      setStreak(0);
    }

    setGuess(selectedOption);
    setIsAnswered(true);
    setFestivalHistory((prev) => [...prev, currentFestivalId]);
    if (gameMode === "timed") setTimerActive(false);
  };

  const handleNextFestival = () => {
    let availableFestivalIds = festivalIds.filter(
      (id) => !festivalHistory.slice(-Math.min(3, festivalIds.length - 1)).includes(id)
    );

    if (availableFestivalIds.length === 0) {
      setFestivalHistory([currentFestivalId]);
      availableFestivalIds = festivalIds.filter((id) => id !== currentFestivalId);
    }

    const nextIndex = Math.floor(Math.random() * availableFestivalIds.length);
    const newFestivalId = availableFestivalIds[nextIndex];

    setCurrentFestivalId(newFestivalId);
    generateOptions(newFestivalId);
    setGuess("");
    setIsAnswered(false);
    setIsCorrect(false);
    setFeedback("");

    if (gameMode === "timed") {
      setTimeLeft(30);
      setTimerActive(true);
    }
  };



  const switchGameMode = (mode: "standard" | "timed") => {
    setGameMode(mode);
    restartGame();
  };

  const restartGame = () => {
    setScore(0);
    setStreak(0);
    setFestivalHistory([]);
    shuffleFestivals();
    if (gameMode === "timed") {
      setTimeLeft(30);
      setTimerActive(true);
    }
  };

  const currentFestival = getCurrentFestival();

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
