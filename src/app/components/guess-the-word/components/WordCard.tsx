import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Progress } from './ui/progress';
import { cn } from '../lib/utils';
import { Clock } from 'lucide-react';
import { useGameState } from '../context';
import { useFinalAssessment } from '../hooks';
import { AssessmentControls } from './AssessmentControls';
import { LoadingWordCard } from './LoadingWordCard';

// --- Re-integrating WordDisplay logic ---
const WordDisplayContent: React.FC<{ word: string; timeLeft: number }> = ({ word, timeLeft }) => {
  const urgencyLevel = timeLeft <= 3 ? 'urgent' : timeLeft <= 7 ? 'warning' : 'normal';
  return (
    <div className="relative z-10 text-center space-y-6 flex-1 flex flex-col justify-center">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full animate-float"></div>
        <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-br from-pink-400 to-red-500 rounded-full animate-float-delayed"></div>
      </div>
      <div className={cn(
        "text-6xl md:text-7xl font-bold text-foreground transition-all duration-300 font-devanagari",
        "hover:scale-105 cursor-default select-none",
        urgencyLevel === 'urgent' && "text-red-600"
      )}>
        {word}
      </div>
    </div>
  );
};

// --- Re-integrating WordTimer logic ---
const WordTimerContent: React.FC<{ timeLeft: number; timerDuration: number; meaningsVisible: boolean }> = ({ timeLeft, timerDuration, meaningsVisible }) => {
  const timerProgress = timerDuration > 0 ? ((timerDuration - timeLeft) / timerDuration) * 100 : 0;
  const urgencyLevel = timeLeft <= 3 ? 'urgent' : timeLeft <= 7 ? 'warning' : 'normal';
  if (meaningsVisible) return null;
  return (
    <div className="space-y-4 -mx-4 px-4">
      <div className="relative">
        <Progress value={timerProgress} className={cn("w-full h-3 transition-all duration-300")} />
        <div className={cn("absolute inset-0 rounded-full", urgencyLevel === 'urgent' && "bg-red-500/20")}></div>
      </div>
      <div className="flex items-center justify-center space-x-2">
        <Clock className={cn("w-4 h-4 transition-colors", urgencyLevel === 'urgent' ? "text-red-500" : urgencyLevel === 'warning' ? "text-orange-500" : "text-muted-foreground")} />
        <span className={cn("text-lg font-mono font-semibold transition-colors", urgencyLevel === 'urgent' ? "text-red-500" : urgencyLevel === 'warning' ? "text-orange-500" : "text-muted-foreground")}>
          {timeLeft}s
        </span>
      </div>
    </div>
  );
};

// --- Re-integrating WordMeaning logic ---
const WordMeaningContent: React.FC<{ wordData: { roman: string; meaning_nepali: string; meaning_english: string } }> = ({ wordData }) => {
  return (
    <div className="space-y-6 text-center">
      <div className="text-2xl md:text-3xl font-semibold text-muted-foreground font-english">
        {wordData.roman}
      </div>
      <div className="space-y-4">
        <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-2">नेपाली अर्थ</div>
          <div className="text-lg text-foreground font-devanagari leading-relaxed">{wordData.meaning_nepali}</div>
        </div>
        <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-lg border border-green-200 dark:border-green-800">
          <div className="text-sm font-medium text-green-600 dark:text-green-400 mb-2">English Meaning</div>
          <div className="text-lg text-foreground font-english leading-relaxed">{wordData.meaning_english}</div>
        </div>
      </div>
    </div>
  );
};

export const WordCard: React.FC = () => {
  const { state } = useGameState();
  const finalAssessment = useFinalAssessment();
  const [cardFlipped, setCardFlipped] = useState(false);

  useEffect(() => {
    if (state.currentWord && !state.isLoadingWord) {
      setCardFlipped(false); // Reset flip state when new word comes
    } 
  }, [state.currentWord, state.isLoadingWord]);

  useEffect(() => {
    if (state.meaningsVisible) {
      setCardFlipped(true);
    }
  }, [state.meaningsVisible]);

  if (state.isLoadingWord || !state.currentWord) {
    return <LoadingWordCard isLoadingWord={state.isLoadingWord} />;
  }
  
  const { currentWord, timeLeft, timerDuration, meaningsVisible, assessmentDone } = state;
  const urgencyLevel = timeLeft <= 3 ? 'urgent' : timeLeft <= 7 ? 'warning' : 'normal';

  return (
    <div className="relative w-full perspective-1000 space-y-4" style={{ perspective: '1000px' }}>
      <div 
        className={cn(
          "relative w-full h-96 transition-transform duration-700 transform-style-preserve-3d",
          cardFlipped && "rotate-y-180"
        )}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front of card - Word */}
        <Card
          className={cn(
            "absolute inset-0 shadow-2xl backface-hidden bg-gradient-to-br from-blue-600 to-red-500 p-1 transition-all duration-300",
            urgencyLevel === 'urgent' && "shadow-red-500/50"
          )}
        >
          <CardContent className="bg-card p-8 rounded-md h-full flex flex-col items-center justify-center relative overflow-hidden">
            <WordDisplayContent word={currentWord.nepali} timeLeft={timeLeft} />
            <WordTimerContent timeLeft={timeLeft} timerDuration={timerDuration} meaningsVisible={meaningsVisible} />
          </CardContent>
        </Card>

        {/* Back of card - Meanings */}
        <Card
          className={cn(
            "absolute inset-0 shadow-2xl rotate-y-180 backface-hidden bg-gradient-to-br from-red-500 to-blue-600 p-1"
          )}
        >
          <CardContent className="bg-card p-8 rounded-md h-full flex flex-col justify-center relative overflow-hidden">
            <WordMeaningContent wordData={{
              roman: currentWord.roman,
              meaning_nepali: currentWord.meaning_nepali,
              meaning_english: currentWord.meaning_english
            }} />
          </CardContent>
        </Card>
      </div>
      {/* Assessment Controls - Rendered outside and below the flipping card */}
      {meaningsVisible && !assessmentDone && (
        <AssessmentControls onAssess={finalAssessment} disabled={assessmentDone} />
      )}
    </div>
  );
}; 