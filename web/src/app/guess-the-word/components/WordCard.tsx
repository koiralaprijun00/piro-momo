import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Progress } from './ui/progress';
import { Clock } from 'lucide-react';
import { useGameState } from '../context';
import { useFinalAssessment } from '../hooks';
import { AssessmentControls } from './AssessmentControls';
import { LoadingWordCard } from './LoadingWordCard';

// --- Re-integrating WordDisplay logic ---
const WordDisplayContent: React.FC<{ word: string; timeLeft: number }> = ({ word, timeLeft }) => {
  const urgencyLevel = timeLeft <= 3 ? 'urgent' : timeLeft <= 7 ? 'warning' : 'normal';
  return (
    <div
      style={{
        position: 'relative',
        zIndex: 10,
        textAlign: 'center',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: '1.5rem',
      }}
    >
      <div style={{ position: 'absolute', inset: 0, opacity: 0.05 }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: 128, height: 128, background: 'linear-gradient(to bottom right, #60a5fa, #a21caf)', borderRadius: '50%' }}></div>
        <div style={{ position: 'absolute', bottom: 0, right: 0, width: 96, height: 96, background: 'linear-gradient(to bottom right, #f472b6, #ef4444)', borderRadius: '50%' }}></div>
      </div>
      <div
        className={"font-devanagari"}
        style={{
          fontSize: '3.75rem', // text-6xl
          fontWeight: 700,
          color: urgencyLevel === 'urgent' ? '#dc2626' : 'hsl(var(--foreground))',
          transition: 'all 0.3s',
          lineHeight: 1.1,
          cursor: 'default',
          userSelect: 'none',
        }}
      >
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
    <div style={{ marginLeft: -16, marginRight: -16, paddingLeft: 16, paddingRight: 16, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ position: 'relative' }}>
        <Progress value={timerProgress} style={{ width: '100%', height: 12, transition: 'all 0.3s' }} />
        <div style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 9999,
          background: urgencyLevel === 'urgent' ? 'rgba(239, 68, 68, 0.2)' : undefined,
        }}></div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
        <Clock style={{ width: 16, height: 16, color: urgencyLevel === 'urgent' ? '#ef4444' : urgencyLevel === 'warning' ? '#f59e42' : 'hsl(var(--muted-foreground))', transition: 'color 0.3s' }} />
        <span style={{ fontSize: '1.125rem', fontFamily: 'monospace', fontWeight: 600, color: urgencyLevel === 'urgent' ? '#ef4444' : urgencyLevel === 'warning' ? '#f59e42' : 'hsl(var(--muted-foreground))', transition: 'color 0.3s' }}>
          {timeLeft}s
        </span>
      </div>
    </div>
  );
};

// --- Re-integrating WordMeaning logic ---
const WordMeaningContent: React.FC<{ wordData: { roman: string; meaning_nepali: string; meaning_english: string } }> = ({ wordData }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', textAlign: 'center' }}>
      <div className="font-english" style={{ fontSize: '1.5rem', fontWeight: 600, color: 'hsl(var(--muted-foreground))' }}>{wordData.roman}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{
          padding: 16,
          background: 'linear-gradient(to right, #eff6ff, #eef2ff)',
          borderRadius: 12,
          border: '1px solid #bfdbfe',
        }}>
          <div style={{ fontSize: '0.875rem', fontWeight: 500, color: '#2563eb', marginBottom: 8 }}>नेपाली अर्थ</div>
          <div className="font-devanagari" style={{ fontSize: '1.125rem', color: 'hsl(var(--foreground))', lineHeight: 1.6 }}>{wordData.meaning_nepali}</div>
        </div>
        <div style={{
          padding: 16,
          background: 'linear-gradient(to right, #f0fdf4, #ecfdf5)',
          borderRadius: 12,
          border: '1px solid #bbf7d0',
        }}>
          <div style={{ fontSize: '0.875rem', fontWeight: 500, color: '#16a34a', marginBottom: 8 }}>English Meaning</div>
          <div className="font-english" style={{ fontSize: '1.125rem', color: 'hsl(var(--foreground))', lineHeight: 1.6 }}>{wordData.meaning_english}</div>
        </div>
      </div>
    </div>
  );
};

export const WordCard: React.FC = () => {
  const { state } = useGameState();
  const { finalAssessment, isProcessing } = useFinalAssessment();
  const [cardFlipped, setCardFlipped] = useState(false);

  useEffect(() => {
    if (state.currentWord && !state.isLoadingWord) {
      setTimeout(() => setCardFlipped(false), 0); // Reset flip state when new word comes
    } 
  }, [state.currentWord, state.isLoadingWord]);

  useEffect(() => {
    if (state.meaningsVisible) {
      setTimeout(() => setCardFlipped(true), 0);
    }
  }, [state.meaningsVisible]);

  if (state.isLoadingWord || !state.currentWord) {
    return <LoadingWordCard isLoadingWord={state.isLoadingWord} />;
  }
  
  const { currentWord, timeLeft, timerDuration, meaningsVisible, assessmentDone } = state;
  const urgencyLevel = timeLeft <= 3 ? 'urgent' : timeLeft <= 7 ? 'warning' : 'normal';

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        perspective: '1000px',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: 384, // h-96
          transition: 'transform 0.7s',
          transformStyle: 'preserve-3d',
          transform: cardFlipped ? 'rotateY(180deg)' : undefined,
        }}
      >
        {/* Front of card - Word */}
        <Card
          style={{
            position: 'absolute',
            inset: 0,
            boxShadow: urgencyLevel === 'urgent' ? '0 25px 50px -12px rgba(239,68,68,0.5)' : '0 25px 50px -12px rgba(0,0,0,0.25)',
            background: '#fff',
            padding: 4,
            transition: 'all 0.3s',
            backfaceVisibility: 'hidden',
          }}
        >
          <CardContent
            style={{
              background: 'hsl(var(--card))',
              padding: 32,
              borderRadius: 6,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <WordDisplayContent word={currentWord.nepali} timeLeft={timeLeft} />
            <WordTimerContent timeLeft={timeLeft} timerDuration={timerDuration} meaningsVisible={meaningsVisible} />
          </CardContent>
        </Card>

        {/* Back of card - Meanings */}
        <Card
          style={{
            position: 'absolute',
            inset: 0,
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
            background: '#fff',
            padding: 4,
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <CardContent
            style={{
              background: 'hsl(var(--card))',
              padding: 32,
              borderRadius: 6,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
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
        <AssessmentControls onAssess={finalAssessment} disabled={assessmentDone || isProcessing} />
      )}
    </div>
  );
}; 
