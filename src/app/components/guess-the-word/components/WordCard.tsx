import React, { useState, useEffect, useCallback } from 'react';
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

  const [flipped, setFlipped] = useState(false);
  const [pendingAssessment, setPendingAssessment] = useState<null | boolean>(null);
  const prevWordId = React.useRef<number | null>(null);

  // When the word changes, reset the flip
  useEffect(() => {
    if (state.currentWord && state.currentWord.id !== prevWordId.current) {
      setFlipped(false);
      setPendingAssessment(null);
      prevWordId.current = state.currentWord.id;
    }
  }, [state.currentWord]);

  // Automatically flip the card when meanings become visible (timer ended)
  useEffect(() => {
    if (
      state.meaningsVisible &&
      !state.assessmentDone &&
      pendingAssessment === null &&
      !flipped
    ) {
      setFlipped(true);
    }
  }, [state.meaningsVisible, state.assessmentDone, pendingAssessment, flipped]);

  // Handler to trigger flip and then call assessment
  const handleAssessWithFlip = useCallback((knewIt: boolean) => {
    setPendingAssessment(knewIt);
    // Toggle the flip state so the card animates back to the front
    setFlipped(prev => !prev);
  }, []);

  // After flip animation, call assessment and load next word
  useEffect(() => {
    if (pendingAssessment !== null) {
      const timeout = setTimeout(() => {
        finalAssessment(pendingAssessment);
        setFlipped(false); // reset for next word
        setPendingAssessment(null);
      }, 500); // match the flip duration
      return () => clearTimeout(timeout);
    }
  }, [pendingAssessment, finalAssessment]);

  if (state.isLoadingWord || !state.currentWord) {
    return <LoadingWordCard isLoadingWord={state.isLoadingWord} />;
  }

  const { currentWord, timeLeft, timerDuration, meaningsVisible, assessmentDone } = state;
  const urgencyLevel = timeLeft <= 3 ? 'urgent' : timeLeft <= 7 ? 'warning' : 'normal';

  return (
    <div className="space-y-4">
      <div className="perspective-1000">
        <div
          className={cn(
            "relative w-full h-full transition-transform duration-500",
            flipped ? 'rotate-y-180' : ''
          )}
          style={{ minHeight: 340 }}
        >
          {/* Card Front */}
          <div
            className={cn(
              "absolute inset-0 w-full h-full z-10",
              "[backface-visibility:hidden]"
            )}
          >
            <Card className={cn(
              "w-full shadow-2xl bg-white p-1 h-full flex flex-col",
              urgencyLevel === 'urgent' && "shadow-red-500/50"
            )}>
              <CardContent className="bg-white p-8 rounded-md h-full flex flex-col items-center justify-center space-y-6">
                <WordDisplayContent word={currentWord.nepali} timeLeft={timeLeft} />
                <WordTimerContent timeLeft={timeLeft} timerDuration={timerDuration} meaningsVisible={meaningsVisible} />
              </CardContent>
            </Card>
          </div>
          {/* Card Back */}
          <div
            className={cn(
              "absolute inset-0 w-full h-full z-20 rotate-y-180",
              "[backface-visibility:hidden]"
            )}
          >
            <Card className="w-full shadow-2xl bg-white p-1 h-full flex flex-col">
              <CardContent className="bg-white p-8 rounded-md h-full flex flex-col items-center justify-center space-y-6">
                <WordMeaningContent
                  wordData={{
                    roman: currentWord.roman,
                    meaning_nepali: currentWord.meaning_nepali,
                    meaning_english: currentWord.meaning_english,
                  }}
                />
                <AssessmentControls
                  onAssess={handleAssessWithFlip}
                  disabled={!!pendingAssessment}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

// Add CSS for perspective and flip animation
// .perspective-1000 { perspective: 1000px; }
// .rotate-y-180 { transform: rotateY(180deg); }
// [backface-visibility:hidden] { backface-visibility: hidden; }
