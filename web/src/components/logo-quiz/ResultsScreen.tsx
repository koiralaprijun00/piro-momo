import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { FiShare2 } from 'react-icons/fi';
import GameButton from '@/components/ui/GameButton';
import { Logo } from '@/app/data/logo-quiz/getLogos';

interface ResultsScreenProps {
  score: number;
  total: number;
  accuracy: number;
  timeUsed: string;
  logos: Logo[];
  correctAnswers: Record<string, boolean>;
  answers: Record<string, string>;
  onReset: () => void;
  onShare: () => void;
  translations: any;
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({
  score,
  total,
  accuracy,
  timeUsed,
  logos,
  correctAnswers,
  answers,
  onReset,
  onShare,
  translations,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="text-center flex-grow overflow-y-auto">
        <h1 className="text-left text-2xl sm:text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-red-500">
          {translations.title}
        </h1>
        
        <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-800">
          {translations.finalScore}
        </h2>
        <div className="text-4xl sm:text-5xl font-bold mb-2 text-blue-600">{score}/{total}</div>
        <p className="text-lg sm:text-xl mb-2 text-gray-700">
          {accuracy}% Accuracy
        </p>
        <p className="text-md mb-6 text-gray-500">
          Time Used: {timeUsed}
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-3 mb-8">
          <GameButton onClick={onReset} type="primary" className="py-3 text-base">
            {translations.playAgain}
          </GameButton>
          <GameButton onClick={onShare} type="success" className="flex items-center justify-center py-3 text-base">
            <FiShare2 className="mr-2" />
            {translations.shareScore}
          </GameButton>
        </div>
        
        <div className="max-w-5xl mx-auto bg-gray-50 rounded-lg p-4 sm:p-6">
          <h3 className="font-bold mb-4 sm:mb-6 text-lg sm:text-xl">Results Breakdown</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
            {logos.map((logo) => (
              <motion.div 
                key={logo.id} 
                className={`p-3 sm:p-4 rounded-lg border-2 ${
                  correctAnswers[logo.id] 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-red-500 bg-red-50'
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center mb-2">
                  <div className="relative w-8 h-8 sm:w-10 sm:h-10 mr-2 sm:mr-3 flex-shrink-0">
                    <Image 
                      src={logo.imagePath} 
                      alt={logo.name} 
                      fill
                      className="object-contain"
                      sizes="40px"
                    />
                  </div>
                  <div>
                    <div className="font-medium text-sm sm:text-base">
                      {logo.name}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600">
                      {correctAnswers[logo.id] 
                        ? <span className="text-green-600">✓ Correct</span> 
                        : <span className="text-red-600">✗ Incorrect</span>}
                    </div>
                  </div>
                </div>
                <div className="text-xs sm:text-sm">
                  <div><strong>Your answer:</strong> {answers[logo.id] || '(No answer)'}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsScreen;
