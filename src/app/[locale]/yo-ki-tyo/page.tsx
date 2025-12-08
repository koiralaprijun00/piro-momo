'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { getQuestionsByLocale } from '../../data/would-you-rather/getQuestions';
import GameButton from '@/components/ui/GameButton';
import AdSenseGoogle from '@/components/AdSenseGoogle';
import { FiShare2, FiRefreshCw, FiSend } from 'react-icons/fi';
import { ImSpinner8 } from 'react-icons/im';
import { useLocale } from 'next-intl';

interface WouldYouRatherQuestion {
  id: string;
  optionA: string;
  optionB: string;
  optionAVotes: number;
  optionBVotes: number;
}

export default function WouldYouRatherPage() {
  const locale = useLocale();
  const t = useTranslations('Translations');
  
  const allQuestions = getQuestionsByLocale(locale);
  
  const [questions, setQuestions] = useState<WouldYouRatherQuestion[]>([]);
  const [showInput, setShowInput] = useState(false);
const [question, setQuestion] = useState('');
const [fullName, setFullName] = useState('');
const [submitted, setSubmitted] = useState(false);
const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<'A' | 'B' | null>(null);
  const [loading, setLoading] = useState(false);
  const [realVoteCounts, setRealVoteCounts] = useState<{[key: string]: {optionA: number, optionB: number}}>({});

  const shuffleQuestions = React.useCallback(() => {
    const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
    setQuestions(shuffled);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
  }, [allQuestions]);

  useEffect(() => {
    if (allQuestions.length > 0) {
      shuffleQuestions();
    }
  }, [allQuestions, shuffleQuestions]);

  const fetchVoteCounts = React.useCallback(async (questionId: string) => {
    try {
      if (realVoteCounts[questionId]) return;
      
      const response = await fetch(`/api/would-you-rather?questionId=${questionId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch vote counts');
      }
      
      const data = await response.json();
      
      setRealVoteCounts(prev => ({
        ...prev,
        [questionId]: {
          optionA: data.optionA,
          optionB: data.optionB
        }
      }));
      
    } catch (error) {
      console.error('Error fetching vote counts:', error);
    }
  }, [realVoteCounts]);

  useEffect(() => {
    if (questions.length > 0 && currentQuestionIndex < questions.length) {
      fetchVoteCounts(questions[currentQuestionIndex].id);
    }
  }, [questions, currentQuestionIndex, fetchVoteCounts]);

  const submitVote = async (questionId: string, vote: 'A' | 'B') => {
    try {
      setLoading(true);
      
      const response = await fetch('/api/would-you-rather', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ questionId, vote }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit vote');
      }
      
      const data = await response.json();
      
      setRealVoteCounts(prev => ({
        ...prev,
        [questionId]: {
          optionA: data.optionA,
          optionB: data.optionB
        }
      }));
      
    } catch (error) {
      console.error('Error submitting vote:', error);
      setQuestions(prevQuestions => {
        const updatedQuestions = [...prevQuestions];
        if (vote === 'A') {
          updatedQuestions[currentQuestionIndex] = {
            ...updatedQuestions[currentQuestionIndex],
            optionAVotes: updatedQuestions[currentQuestionIndex].optionAVotes + 1
          };
        } else {
          updatedQuestions[currentQuestionIndex] = {
            ...updatedQuestions[currentQuestionIndex],
            optionBVotes: updatedQuestions[currentQuestionIndex].optionBVotes + 1
          };
        }
        return updatedQuestions;
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOptionSelect = (option: 'A' | 'B') => {
    if (selectedOption || loading) return;
    
    setSelectedOption(option);
    
    if (currentQuestion) {
      submitVote(currentQuestion.id, option);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
    } else {
      setCurrentQuestionIndex(0);
      setSelectedOption(null);
    }
  };

  const handleShareResult = async () => {
    if (!selectedOption || !currentQuestion) return;
    
    const chosenOption = selectedOption === 'A' ? currentQuestion.optionA : currentQuestion.optionB;
    const percentageChosen = selectedOption === 'A' ? percentageA : percentageB;
    
    const shareText = t('wouldYouRather.shareText', {
      question: `Would you rather ${currentQuestion.optionA} OR ${currentQuestion.optionB}?`,
      choice: chosenOption,
      percentage: percentageChosen
    });
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: t('wouldYouRather.title'),
          text: shareText,
          url: 'https://piromomo.com/would-you-rather'
        });
      } else {
        await navigator.clipboard.writeText(shareText);
        alert(t('clipboardMessage'));
      }
    } catch (error) {
      console.error('Error sharing:', error);
      await navigator.clipboard.writeText(shareText);
      alert(t('clipboardMessage'));
    }
  };

  const getVoteCounts = () => {
    if (!currentQuestion) return { optionA: 0, optionB: 0 };
    
    if (realVoteCounts[currentQuestion.id]) {
      return realVoteCounts[currentQuestion.id];
    }
    
    return {
      optionA: currentQuestion.optionAVotes,
      optionB: currentQuestion.optionBVotes
    };
  };

  const calculatePercentage = (votes: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((votes / total) * 100);
  };

  const currentQuestion = questions[currentQuestionIndex];
  
  if (!currentQuestion) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">{t('loading')}</p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !fullName.trim()) return;
    
    try {
      setIsSubmitting(true);
      
      const response = await fetch('/api/would-you-rather/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          question: question.trim(),
          fullName: fullName.trim() 
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit question');
      }
      
      // Show success message
      setSubmitted(true);
      setQuestion('');
      setFullName('');
      
      // Reset form after a delay
      setTimeout(() => {
        setShowInput(false);
        setSubmitted(false);
      }, 3000);
      
    } catch (error) {
      console.error('Error submitting question:', error);
      alert(t('wouldYouRather.errorSubmitting') || 'Error submitting question. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };


  const votes = getVoteCounts();
  const totalVotes = votes.optionA + votes.optionB;
  const percentageA = calculatePercentage(votes.optionA, totalVotes);
  const percentageB = calculatePercentage(votes.optionB, totalVotes);

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
        <div className="flex-1 max-w-4xl mx-auto px-4 py-8">
          <div className="min-h-screen w-full py-8 px-4 md:px-6">
            <div className="max-w-3xl mx-auto">
              {/* Main Game Card */}
              <div className="bg-gradient-to-br from-blue-600 to-red-500 p-1 rounded-xl shadow-lg mb-6">
                <div className="box-border px-4 py-8 text-white">
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">
                    {t('wouldYouRather.questionPrefix') || 'Would you rather...'}
                  </h1>
                  <p className="text-base sm:text-lg">
                    {t('wouldYouRather.description') || 'Pick a Nepali scenario and see how your choice stacks up!'}
                  </p>
                </div>

                <div className="bg-white rounded-lg p-6">
                  <div className="flex justify-end items-center mb-4">
                    <button
                      onClick={shuffleQuestions}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg px-3 py-2 text-sm flex items-center transition"
                    >
                      <FiRefreshCw className="mr-2 h-4 w-4" />
                      {t('wouldYouRather.newQuestions') || 'New Questions'}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <button
                      onClick={() => handleOptionSelect('A')}
                      disabled={selectedOption !== null || loading}
                      className={`p-6 rounded-xl text-lg font-medium transition transform hover:scale-105 focus:outline-none ${
                        loading ? 'opacity-75 cursor-wait' : ''
                      } ${
                        selectedOption === 'A'
                          ? 'bg-blue-100 border-2 border-blue-600 text-blue-900'
                          : selectedOption === 'B'
                          ? 'bg-gray-100 border border-gray-300 text-gray-500'
                          : 'bg-blue-100 border-2 border-blue-200 text-gray-800 hover:bg-blue-200 hover:border-blue-600'
                      }`}
                    >
                      <div className="mb-3 text-3xl">🇦</div>
                      <div>{currentQuestion.optionA}</div>
                      
                      {selectedOption && (
                        <div className="mt-4">
                          <div className="h-4 w-full bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-600 transition-all duration-1000 ease-out"
                              style={{ width: `${percentageA}%` }}
                            ></div>
                          </div>
                          <div className="mt-2 flex justify-between items-center">
                            <span className="text-sm font-bold text-blue-700">{percentageA}%</span>
                            <span className="text-sm text-gray-500">{votes.optionA} votes</span>
                          </div>
                        </div>
                      )}
                    </button>
                    
                    <button
                      onClick={() => handleOptionSelect('B')}
                      disabled={selectedOption !== null || loading}
                      className={`p-6 rounded-xl text-lg font-medium transition transform hover:scale-105 focus:outline-none ${
                        loading ? 'opacity-75 cursor-wait' : ''
                      } ${
                        selectedOption === 'B'
                          ? 'bg-red-100 border-2 border-red-600 text-red-900'
                          : selectedOption === 'A'
                          ? 'bg-gray-100 border border-gray-300 text-gray-500'
                          : 'bg-red-100 border-2 border-red-200 text-gray-800 hover:bg-red-200 hover:border-red-600'
                      }`}
                    >
                      <div className="mb-3 text-3xl">🇧</div>
                      <div>{currentQuestion.optionB}</div>
                      
                      {selectedOption && (
                        <div className="mt-4">
                          <div className="h-4 w-full bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-red-600 transition-all duration-1000 ease-out"
                              style={{ width: `${percentageB}%` }}
                            ></div>
                          </div>
                          <div className="mt-2 flex justify-between items-center">
                            <span className="text-sm font-bold text-red-700">{percentageB}%</span>
                            <span className="text-sm text-gray-500">{votes.optionB} votes</span>
                          </div>
                        </div>
                      )}
                    </button>
                  </div>
                  
                  {loading && (
                    <div className="flex justify-center items-center my-4">
                      <div className="animate-spin h-5 w-5 border-2 border-blue-600 rounded-full border-t-transparent"></div>
                      <span className="ml-2 text-sm text-gray-600">{t('loading')}</span>
                    </div>
                  )}
                  
                  {selectedOption && !loading && (
                    <div className="mb-6 p-4 bg-gray-50 rounded-lg text-center">
                      <p className="text-gray-700">
                        {t('wouldYouRather.resultMessage', {
                          percentage: selectedOption === 'A' ? percentageA : percentageB
                        }) || `${selectedOption === 'A' ? percentageA : percentageB}% of people agree with you!`}
                      </p>
                    </div>
                  )}
                  
                  <div className="flex justify-center mt-6">
                    {selectedOption && !loading ? (
                      <div className="flex gap-4">
                        <GameButton onClick={handleShareResult} type="neutral" className="flex items-center">
                          <FiShare2 className="mr-2" />
                          {t('wouldYouRather.share') || 'Share'}
                        </GameButton>
                        <GameButton onClick={handleNextQuestion} type="primary">
                          {t('wouldYouRather.next') || 'Next Question'} →
                        </GameButton>
                      </div>
                    ) : (
                      <div className="text-center text-gray-500 text-sm py-2">
                        {loading 
                          ? t('loading') || 'Processing...' 
                          : t('wouldYouRather.choosePrompt') || 'Select an option to see how others voted'}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <h3 className="font-medium text-yellow-800 mb-2">
                  {t('wouldYouRather.submitYourOwn') || 'Have a great "Would You Rather" idea?'}
                </h3>
                <p className="text-sm text-yellow-700 mb-3">
                  {t('wouldYouRather.submitDescription') || 'Submit your own questions for possible inclusion in the game!'}
                </p>

                {showInput ? (
                  submitted ? (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded-md flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <p className="font-medium">{t('wouldYouRather.thankYou') || 'धन्यवाद! तपाईंको प्रश्न पठाइएको छ।'}</p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-3">
                      <div>
                        <label htmlFor="fullName" className="block text-sm font-medium text-yellow-800 mb-1">
                          {t('wouldYouRather.fullName') || 'Your Full Name'}
                        </label>
                        <input
                          type="text"
                          id="fullName"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder={t('wouldYouRather.fullNamePlaceholder') || 'Enter your name...'}
                          className="w-full border border-yellow-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                          disabled={isSubmitting}
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="questionInput" className="block text-sm font-medium text-yellow-800 mb-1">
                          {t('wouldYouRather.yourQuestion') || 'Your Would You Rather Question'}
                        </label>
                        <textarea
                          id="questionInput"
                          value={question}
                          onChange={(e) => setQuestion(e.target.value)}
                          placeholder={t('wouldYouRather.questionPlaceholder') || 'Would you rather...'}
                          className="w-full border border-yellow-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                          disabled={isSubmitting}
                          rows={3}
                        />
                      </div>
                      
                      <div className="flex justify-end">
                        <button
                          type="submit"
                          disabled={isSubmitting || !question.trim() || !fullName.trim()}
                          className={`inline-flex items-center px-4 py-2 bg-yellow-600 text-white text-sm font-medium rounded hover:bg-yellow-700 transition ${
                            isSubmitting || !question.trim() || !fullName.trim() ? 'opacity-70 cursor-not-allowed' : ''
                          }`}
                        >
                          {isSubmitting ? (
                            <>
                              <ImSpinner8 className="animate-spin mr-2 h-4 w-4" />
                              {t('submitting') || 'पठाउँदै...'}
                            </>
                          ) : (
                            <>
                              <FiSend className="mr-2" />
                              {t('wouldYouRather.submitButton') || 'प्रश्न पठाउनुहोस्'}
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  )
                ) : (
                  <button
                    onClick={() => setShowInput(true)}
                    className="inline-flex items-center px-3 py-2 bg-yellow-600 text-white text-sm font-medium rounded hover:bg-yellow-700 transition"
                  >
                    <FiSend className="mr-2" />
                    {t('wouldYouRather.submitButton') || 'प्रश्न पठाउनुहोस्'}
                  </button>
                )}
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