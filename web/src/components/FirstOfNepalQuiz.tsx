import { useState, useEffect, useCallback } from 'react';
import { X, Check, XCircle, BookOpen } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface QuizQuestion {
  question: string;
  correctAnswer: string;
}

interface FirstOfNepalQuizProps {
  locale: string;
}

export default function FirstOfNepalQuiz({ locale }: FirstOfNepalQuizProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [quizzesCompleted, setQuizzesCompleted] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);

    // Load from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('firstOfNepalState');
    if (savedState) {
        try {
            const parsed = JSON.parse(savedState);
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setHighScore(parsed.highScore || 0);
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setQuizzesCompleted(parsed.quizzesCompleted || 0);
        } catch (e) {
            console.error("Failed to parse First of Nepal state", e);
        }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (highScore > 0 || quizzesCompleted > 0) {
        const stateToSave = {
            highScore,
            quizzesCompleted,
            lastPlayed: new Date().toISOString()
        };
        localStorage.setItem('firstOfNepalState', JSON.stringify(stateToSave));
    }
  }, [highScore, quizzesCompleted]);
  
  const MAX_QUESTIONS = 8; // Limit to 8 questions
  
  const t = useTranslations('firstsOfNepal');

  // Fisher-Yates shuffle algorithm
  const shuffleArray = useCallback((array: QuizQuestion[]): QuizQuestion[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }, []);

  // Function to generate random quiz questions
  const generateRandomQuestions = useCallback(() => {
    // Get all items from translations
    const items = Object.keys(t.raw('items'));
    
    // Create quiz questions from the items
    const allQuestions: QuizQuestion[] = items.map((itemKey) => {
      const item = t.raw(`items.${itemKey}`);
      const category = item.category;
      const name = item.name;

      return {
        question: locale === 'en' 
          ? `Who was the first ${category.toLowerCase()} of Nepal?`
          : `नेपालको पहिलो ${category.toLowerCase()} को हुन्?`,
        correctAnswer: name
      };
    });
    
    // Shuffle and limit to MAX_QUESTIONS
    const randomizedQuestions = shuffleArray(allQuestions).slice(0, MAX_QUESTIONS);
    setQuizQuestions(randomizedQuestions);
  }, [t, locale, shuffleArray]);

  // Initialize randomized questions when quiz opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => generateRandomQuestions(), 0);
    }
  }, [isOpen, generateRandomQuestions]);

  const currentQuestion = quizQuestions[currentQuestionIndex];

  const handleAnswer = () => {
    setShowFeedback(true);
    const userAnswerLower = userAnswer.toLowerCase().trim();
    const correctAnswerLower = currentQuestion?.correctAnswer.toLowerCase().trim();
    const correctFirstNameLower = correctAnswerLower.split(' ')[0];
    
    // Accept exact match in any language, or just the first name
    const isCorrect = 
      userAnswerLower === correctAnswerLower || // Full name in English
      userAnswerLower === correctFirstNameLower || // First name only in English
      (currentQuestion && isMatchingInNepali(userAnswerLower, currentQuestion)); // Check for Nepali match
    
    if (isCorrect) {
      setScore(score + 1);
    }
  };
  
  // Helper function to check if answer matches in Nepali
  const isMatchingInNepali = (userAnswer: string, question: QuizQuestion): boolean => {
    // Try to get the Nepali name for this question by finding the item key
    const items = Object.keys(t.raw('items'));
    for (const itemKey of items) {
      const item = t.raw(`items.${itemKey}`);
      if (item.name === question.correctAnswer) {
        // If we have a Nepali version, check against it
        const nepaliName = locale === 'np' ? item.name : '';
        if (nepaliName) {
          const nepaliNameLower = nepaliName.toLowerCase().trim();
          const nepaliFirstNameLower = nepaliNameLower.split(' ')[0];
          
          return userAnswer === nepaliNameLower || userAnswer === nepaliFirstNameLower;
        }
        break;
      }
    }
    return false;
  };

  const handleNext = () => {
    setShowFeedback(false);
    setUserAnswer('');
    if (currentQuestionIndex < MAX_QUESTIONS - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowResult(true);
      setQuizzesCompleted(prev => prev + 1);
      if (score > highScore) {
          setHighScore(score);
      }
    }
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setUserAnswer('');
    setScore(0);
    setShowResult(false);
    setShowFeedback(false);
    generateRandomQuestions(); // Regenerate questions for a new quiz
  };

  return (
    <>
      {!isOpen && (
       <button
       onClick={() => setIsOpen(true)}
       className="fixed bottom-4 right-4 bg-gradient-to-r from-red-600 to-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:from-red-700 hover:to-blue-700 transition-all flex items-center gap-2 font-medium"
     >
           <BookOpen size={18} />
          {t('takeQuiz')}
        </button>
      )}

      {isOpen && (
        <>
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[100]" onClick={() => setIsOpen(false)} />
          <div className="fixed bottom-4 right-4 w-80 h-[380px] bg-white rounded-lg shadow-2xl p-4 z-[101] overflow-y-auto">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold text-gray-800">{t('quizTitle')}</h3>
              <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>

            {!showResult && quizQuestions.length > 0 ? (
              <div className="space-y-3">
                <p className="text-gray-700 font-medium">{currentQuestion?.question}</p>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && userAnswer.trim() && !showFeedback) {
                        handleAnswer();
                      }
                    }}
                    disabled={showFeedback}
                    placeholder={locale === 'en' ? "Type your answer..." : "उत्तर टाइप गर्नुहोस्..."}
                    className="w-full p-2.5 rounded-lg border border-gray-300 focus:border-red-500 focus:ring focus:ring-red-200 focus:ring-opacity-50 focus:outline-none"
                  />
                  {showFeedback && (
                    <div className={`p-2.5 rounded-lg ${
                      score > 0 && (currentQuestionIndex === 0 || score > currentQuestionIndex)
                        ? 'bg-green-100 text-green-800 border-2 border-green-500'
                        : 'bg-red-100 text-red-800 border-2 border-red-500'
                    }`}>
                      <div className="flex flex-col space-y-2">
                        <div className="flex items-center">
                          {score > 0 && (currentQuestionIndex === 0 || score > currentQuestionIndex) ? (
                            <Check className="mr-2" size={16} />
                          ) : (
                            <XCircle className="mr-2" size={16} />
                          )}
                          <span>
                            {score > 0 && (currentQuestionIndex === 0 || score > currentQuestionIndex)
                              ? locale === 'en' ? "Correct!" : "सही!"
                              : locale === 'en' ? "Incorrect" : "गलत"}
                          </span>
                        </div>
                        {!(score > 0 && (currentQuestionIndex === 0 || score > currentQuestionIndex)) && (
                          <div className="text-sm">
                            {locale === 'en' 
                              ? `The correct answer is: ${currentQuestion?.correctAnswer}`
                              : `सही उत्तर हो: ${currentQuestion?.correctAnswer}`}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex justify-between items-center mt-4 pt-3 border-t">
                  <span className="text-sm text-gray-500">
                    {t('questionProgress', { current: currentQuestionIndex + 1, total: MAX_QUESTIONS })}
                  </span>
                  {!showFeedback ? (
                    <button
                      onClick={handleAnswer}
                      disabled={!userAnswer.trim()}
                      className="bg-gradient-to-r from-red-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-red-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {t('submitAnswer')}
                    </button>
                  ) : (
                    <button
                      onClick={handleNext}
                      className="bg-gradient-to-r from-red-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-red-700 hover:to-blue-700 transition-all"
                    >
                      {t('nextQuestion')}
                    </button>
                  )}
                </div>
              </div>
            ) : showResult ? (
              <div className="text-center space-y-4">
                <h3 className="text-xl font-semibold text-gray-800">{t('quizComplete')}</h3>
                <div className="text-2xl font-bold text-red-600">
                  {score} / {MAX_QUESTIONS}
                </div>
                <p className="text-gray-600">
                  {score === MAX_QUESTIONS
                    ? t('perfectScore')
                    : score > MAX_QUESTIONS / 2
                    ? t('goodScore')
                    : t('keepLearning')}
                </p>
                <button
                  onClick={resetQuiz}
                  className="bg-gradient-to-r from-red-600 to-blue-600 text-white px-6 py-2 rounded-lg hover:from-red-700 hover:to-blue-700 transition-all"
                >
                  {t('tryAgain')}
                </button>
              </div>
            ) : (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-600"></div>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}