/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useTranslations, useLocale } from "next-intl";
import QuizSection from "../nepal-gk-components/QuizSection";
import { getQuestionsByLocale } from "@/app/data/general-knowledge/getQuestions";
import AdSenseGoogle from '@/components/AdSenseGoogle';
import GameButton from '@/components/ui/GameButton';
import CustomDropdown from '@/components/ui/CustomDropdown';
import ContainedConfetti from '@/lib/confetti';

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  category?: string;
}

function createSafeT(t: ReturnType<typeof useTranslations>) {
  return (key: string, defaultValue = "", params = {}) => {
    try {
      return t(key, params);
    } catch (error) {
      console.warn(`Translation key not found: ${key}`);
      return defaultValue;
    }
  };
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function NepalGKQuiz() {
  const t = useTranslations("Translations");
  const safeT = useMemo(() => createSafeT(t), [t]);
  const locale = useLocale();

  // Load questions based on locale
  const gkQuestions = getQuestionsByLocale(locale) as Question[];

  // Game state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [feedbackState, setFeedbackState] = useState<{
    isAnswered: boolean;
    isCorrect: boolean;
    feedback: string;
  }>({
    isAnswered: false,
    isCorrect: false,
    feedback: "",
  });
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(0);
  const [totalGamesPlayed, setTotalGamesPlayed] = useState<number>(0);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Load from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('generalKnowledgeState');
    if (savedState) {
        try {
            const parsed = JSON.parse(savedState);
            setHighScore(parsed.highScore || 0);
            setTotalGamesPlayed(parsed.totalGamesPlayed || 0);
             // Note: We don't restore current game state (score, index) as quizzes usually restart on refresh
        } catch (e) {
            console.error("Failed to parse General Knowledge state", e);
        }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (highScore > 0 || totalGamesPlayed > 0) {
        const stateToSave = {
            highScore,
            totalGamesPlayed,
            lastPlayed: new Date().toISOString()
        };
        localStorage.setItem('generalKnowledgeState', JSON.stringify(stateToSave));
    }
  }, [highScore, totalGamesPlayed]);

  // Add category filter state
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Get all available categories with normalized names
  const categories = useMemo(() => {
    const normalizeCategory = (category: string): string => {
      if (category.includes("&")) {
        const parts = category.split("&").map(part => part.trim());
        return parts.sort().join(" & ");
      }
      return category.trim();
    };
  
    const categoryCountMap: Record<string, { originalNames: string[], count: number }> = {};
  
    gkQuestions.forEach((q) => {
      const normalizedName = normalizeCategory(q.category || '');
      if (!categoryCountMap[normalizedName]) {
        categoryCountMap[normalizedName] = {
          originalNames: [q.category || ''],
          count: 0
        };
      } else if (!categoryCountMap[normalizedName].originalNames.includes(q.category || '')) {
        categoryCountMap[normalizedName].originalNames.push(q.category || '');
      }
      categoryCountMap[normalizedName].count++;
    });
  
    const uniqueCategories = [{
      id: "all",
      name: safeT("nepalGk.allCategories", "All Categories"),
      originalNames: ["all"]
    }];
  
    Object.entries(categoryCountMap)
      .sort((a, b) => b[1].count - a[1].count) // 🔥 sort by count (descending)
      .forEach(([normalizedName, { originalNames, count }]) => {
        uniqueCategories.push({
          id: normalizedName,
          name: `${normalizedName} (${count})`,
          originalNames
        });
      });
  
    return uniqueCategories;
  }, [gkQuestions, safeT]);
  

  // Filter questions by selected category
  const filteredQuestions = useMemo(() => {
    if (selectedCategory === "all") {
      return gkQuestions;
    }
    
    // Find the selected category in our normalized list
    const selectedCategoryObj = categories.find(cat => cat.id === selectedCategory);
    
    if (!selectedCategoryObj) {
      return [];
    }
    
    // Filter questions that match any of the original category names
    return gkQuestions.filter((q) => 
      selectedCategoryObj.originalNames.includes(q.category || '')
    );
  }, [selectedCategory, gkQuestions, categories]);

  // Memoize shuffled questions
  const shuffledQuestions = useMemo(() => {
    return shuffleArray(filteredQuestions);
  }, [filteredQuestions]);

  // Initialize and handle category changes
  useEffect(() => {
    setTimeout(() => {
      setCurrentQuestionIndex(0);
      setFeedbackState({
        isAnswered: false,
        isCorrect: false,
        feedback: "",
      });
      setScore(0);
      setShowConfetti(false);
    }, 0);
  }, [selectedCategory]);

  // Current question
  const currentQuestion = shuffledQuestions[currentQuestionIndex];

  // Handle user's guess
  const handleGuess = useCallback((selectedOption: string) => {
    if (feedbackState.isAnswered || isProcessing) return;
    
    setIsProcessing(true);
    const isGuessCorrect = selectedOption === currentQuestion.correctAnswer;

    if (isGuessCorrect) {
      setScore((prevScore) => prevScore + 10);
      setFeedbackState({
        isAnswered: true,
        isCorrect: true,
        feedback: `+10 ${t("points") || "points"}`,
      });
    } else {
      setFeedbackState({
        isAnswered: true,
        isCorrect: false,
        feedback: t("incorrect") || "Incorrect",
      });
    }

    // Check if this is the last question and trigger confetti
    if (currentQuestionIndex === shuffledQuestions.length - 1) {
      setShowConfetti(true);
      setTotalGamesPlayed(prev => prev + 1);
      
      // Calculate final score including this guess if correct
      const finalScore = isGuessCorrect ? score + 10 : score;
      if (finalScore > highScore) {
          setHighScore(finalScore);
      }
    }

    // Prevent spam clicks
    setTimeout(() => setIsProcessing(false), 300);
  }, [currentQuestion, currentQuestionIndex, feedbackState.isAnswered, isProcessing, shuffledQuestions.length, t, score, highScore]);

  // Move to next question
  const handleNextQuestion = useCallback(() => {
    if (currentQuestionIndex < shuffledQuestions.length - 1) {
      setFeedbackState({
        isAnswered: false,
        isCorrect: false,
        feedback: "",
      });
      
      // Use a small delay before changing the question
      setTimeout(() => {
        setCurrentQuestionIndex((prev) => prev + 1);
      }, 50);
    }
  }, [currentQuestionIndex, shuffledQuestions.length]);

  // Restart the game
  const restartGame = useCallback(() => {
    setCurrentQuestionIndex(0);
    setFeedbackState({
      isAnswered: false,
      isCorrect: false,
      feedback: "",
    });
    setScore(0);
    setShowConfetti(false);
  }, []);

  // Handle category change
  const handleCategoryChange = useCallback((category: string | number) => {
    if (typeof category === "string") {
      setSelectedCategory(category);
    }
  }, []);

  // Share score
  const handleShareScore = useCallback(async () => {
    const categoryText = selectedCategory === "all" ? "" : ` (${selectedCategory} category)`;
    const shareMessage = t("nepalGk.shareMessage", {
      score,
      category: categoryText,
      url: "https://piromomo.com/nepal-gk",
    });

    try {
      if (navigator.share && navigator.canShare({ text: shareMessage })) {
        await navigator.share({
          title: t("nepalGk.shareScore"),
          text: shareMessage,
          url: "https://piromomo.com/nepal-gk",
        });
      } else {
        await navigator.clipboard.writeText(shareMessage);
        alert(t("nepalGk.clipboardMessage"));
      }
    } catch (error) {
      console.error("Sharing failed:", error);
      await navigator.clipboard.writeText(shareMessage);
      alert(t("nepalGk.clipboardMessage"));
    }
  }, [score, selectedCategory, t]);

  return (
    <div className="min-h-screen w-full">
      <div className="flex justify-center">
        <div className="hidden lg:block w-[160px] sticky top-24 self-start h-[600px] ml-4">
          <div className="w-[160px] h-[600px]">
            <AdSenseGoogle
              adSlot="6865219846"
              adFormat="vertical"
              style={{ width: "160px", height: "400px" }}
            />
          </div>
        </div>

        <div className="flex-1 px-4 py-8">
        <div className="flex flex-col md:flex-row gap-4 md:gap-6 max-w-5xl mx-auto px-2">
            <div className="hidden md:block md:w-1/3 space-y-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="mb-8">
                  <h1 className="text-3xl font-bold text-left bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-red-500 mb-2">
                    {safeT("nepalGk.title", "Nepal GK Quiz")}
                  </h1>
                  <p className="text-left text-gray-600">
                    {safeT("nepalGk.description", "Test your knowledge about Nepal!")}
                  </p>
                </div>

                <div className="mb-4 flex justify-center">
  <CustomDropdown
    options={categories}
    value={selectedCategory}
    onChange={handleCategoryChange}
    className="w-full max-w-xs"
  />
</div>

                <div>
                  <h2 className="text-sm mb-3">{safeT("nepalGk.score", "Score")}</h2>
                  <div className="bg-gradient-to-r from-blue-600 to-red-500 p-0.5 rounded-lg">
                    <div className="bg-white rounded-md p-2 flex justify-between items-center">
                      <div className="flex items-center">
                        <span className="text-3xl font-bold">{score}</span>
                        <span className="ml-2 text-gray-600">{t("points")}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <GameButton onClick={restartGame} type="neutral" size="sm" fullWidth>
                    {safeT("nepalGk.restart", "Restart Quiz")}
                  </GameButton>

                  {score > 0 && (
                    <GameButton onClick={handleShareScore} type="success" size="sm" fullWidth>
                      {safeT("nepalGk.shareScore", "Share Score")}
                    </GameButton>
                  )}
                </div>
              </div>
            </div>

            <div className="md:w-2/3 w-full">
              <div className="bg-gradient-to-br from-blue-600 to-red-500 p-1 rounded-xl shadow-lg">
              <div className={`rounded-lg p-3 md:p-6 ${feedbackState.isAnswered && currentQuestionIndex === shuffledQuestions.length - 1 ? 'bg-gray-50' : 'bg-white'}`}>
                  <div className="md:hidden mb-6">
                  <h1 className="text-xl md:text-2xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-red-500 mb-2">
                      {safeT("nepalGk.title", "Nepal GK Quiz")}
                    </h1>

                    <div className="mb-6">
  <h2 className="text-sm mb-2">{safeT("nepalGk.categories", "Categories")}</h2>
  <CustomDropdown
    options={categories}
    value={selectedCategory}
    onChange={handleCategoryChange}
    className="w-full"
  />
</div>

<div className="flex flex-col xs:flex-row justify-between items-center gap-2 mb-4">
                      <div className="bg-gray-100 px-3 py-1.5 rounded-lg">
                        <span className="font-bold">
                          {safeT("nepalGk.score", "Score")}: {score}
                        </span>
                      </div>

                      {score > 0 && (
                        <GameButton onClick={handleShareScore} type="neutral" size="sm">
                          {safeT("nepalGk.shareScore", "Share Score")}
                        </GameButton>
                      )}
                    </div>
                  </div>

                  {(shuffledQuestions.length === 0) ? (
  <div className="text-center py-8">
    <p className="text-lg text-gray-600">
      {safeT("nepalGk.noQuestionsInCategory", "No questions available in this category.")}
    </p>
    <GameButton
      onClick={() => setSelectedCategory("all")}
      type="primary"
      className="mt-4"
    >
      {safeT("nepalGk.viewAllCategories", "View All Categories")}
    </GameButton>
  </div>
) : currentQuestion ? (
  <>
    {/* Only show QuizSection if it's not the last question that's been answered */}
    {!(feedbackState.isAnswered && currentQuestionIndex === shuffledQuestions.length - 1) && (
      <QuizSection
        currentQuestion={currentQuestion}
        isAnswered={feedbackState.isAnswered}
        handleGuess={handleGuess}
        handleNextQuestion={handleNextQuestion}
        totalQuestions={shuffledQuestions.length}
        currentIndex={currentQuestionIndex}
        isLastQuestion={currentQuestionIndex === shuffledQuestions.length - 1}
        feedback={feedbackState.feedback}
        isCorrect={feedbackState.isCorrect}
      />
    )}
                      
      {/* Show final screen only on the last question after it's answered */}
      {feedbackState.isAnswered && currentQuestionIndex === shuffledQuestions.length - 1 && (
  <div className=" text-center p-8 relative overflow-hidden">
    {/* Contained confetti inside this div */}
    <ContainedConfetti duration={6000} />

    
    {/* Trophy icon */}
    <div className="inline-flex items-center justify-center w-24 h-24 mb-6 bg-yellow-100 text-yellow-500 rounded-full shadow-md">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    </div>
    
    <h3 className="text-2xl md:text-3xl font-bold text-blue-800 mb-4">
      🎉 {safeT("nepalGk.quizComplete", "Quiz Complete!")}
    </h3>
    
    {/* Score display with animation */}
    <div className="mb-6 py-4 px-8 bg-white rounded-lg shadow-inner inline-block">
  <div className="flex items-center justify-center">
    <div className="text-4xl font-bold text-blue-600">{score}</div>
    <div className="ml-2 text-2xl text-gray-500">{safeT("points", "points")}</div>
  </div>
</div>
    
    {/* Performance feedback based on score */}
    <p className="mb-6 text-lg text-gray-700">
      {score === shuffledQuestions.length * 10 
        ? safeT("nepalGk.perfectScore", "Perfect score! You're a Nepal expert!") 
        : score >= shuffledQuestions.length * 7 
        ? safeT("nepalGk.greatScore", "Great job! You know Nepal well!") 
        : score >= shuffledQuestions.length * 5 
        ? safeT("nepalGk.goodScore", "Good effort! Keep learning about Nepal!") 
        : safeT("nepalGk.tryAgain", "Keep exploring Nepal's rich knowledge!")}
    </p>
    
    {/* Action buttons with improved design */}
    <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
      <GameButton 
        onClick={handleShareScore} 
        type="primary" 
        size="lg"
        className="px-6 py-3 flex items-center justify-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
        </svg>
        {safeT("nepalGk.shareScore", "Share Score")}
      </GameButton>
      
      <GameButton 
        onClick={restartGame} 
        type="success" 
        size="lg"
        className="px-6 py-3 flex items-center justify-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
        </svg>
        {safeT("nepalGk.playAgain", "Play Again")}
      </GameButton>
    </div>
    
    {/* Additional CSS for confetti */}
    <style jsx>{`
      .confetti-piece {
        position: absolute;
        width: 12px;
        height: 12px;
        opacity: 0.6;
        border-radius: 2px;
      }
    `}</style>
  </div>
)}
                    </>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="hidden lg:block w-[160px] sticky top-24 self-start h-[600px] mr-4">
          <div className="w-[160px] h-[600px]">
            <AdSenseGoogle
              adSlot="9978468343"
              adFormat="vertical"
              style={{ width: "160px", height: "400px" }}
            />
          </div>
        </div>
      </div>

      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-2 z-10">
        <div className="flex justify-between items-center">
        <GameButton onClick={restartGame} type="neutral" size="sm" className="py-1 px-2 text-xs">
            {safeT("nepalGk.restart", "Restart Quiz")}
          </GameButton>

          {score > 0 && (
            <GameButton onClick={handleShareScore} type="success" size="sm" className="py-1 text-xs">
              {safeT("nepalGk.shareScore", "Share Score")}
            </GameButton>
          )}
        </div>
      </div>
    </div>
  );
}