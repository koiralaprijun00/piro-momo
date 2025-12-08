import React, { useState } from 'react';
import { Button } from './ui/button';
import { CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '@/lib/guess-the-word/utils';

interface AssessmentControlsProps {
  onAssess: (knewIt: boolean) => void;
  disabled?: boolean;
}

export const AssessmentControls: React.FC<AssessmentControlsProps> = ({
  onAssess,
  disabled = false
}) => {
  const [selectedButton, setSelectedButton] = useState<boolean | null>(null);

  const handleAssess = (knewIt: boolean) => {
    setSelectedButton(knewIt); // For visual feedback during the 300ms
    setTimeout(() => {
      onAssess(knewIt);
      setSelectedButton(null); // Reset visual feedback state after action is called
    }, 300);
  };

  return (
    <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-6 sm:space-y-0 justify-center mt-8 w-full items-stretch">
      <Button
        variant="outline"
        size="lg"
        className={cn(
          "w-full sm:w-auto bg-gradient-to-r from-green-500/10 to-emerald-500/10 hover:from-green-500/20 hover:to-emerald-500/20 border-green-500 text-green-700 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 transition-all duration-300 transform hover:scale-105 hover:shadow-lg group",
          selectedButton === true && "scale-110 shadow-xl bg-green-500 text-white border-green-600" // Feedback based on internal selectedButton
        )}
        onClick={() => handleAssess(true)}
        disabled={disabled || selectedButton !== null} // Disable while feedback is active
      >
        <div className="flex items-center space-x-3">
          <div className={cn(
            "w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center transition-all group-hover:bg-green-500/30",
            selectedButton === true && "bg-white/20"
          )}>
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <span className="font-semibold">I Knew It!</span>
          <p className="text-gray-600 mb-6">Let&apos;s see how much you&apos;ve learned!</p>
          <span className="text-xs opacity-70">(Y)</span>
        </div>
      </Button>
      
      <Button
        variant="outline"
        size="lg"
        className={cn(
          "w-full sm:w-auto bg-gradient-to-r from-red-500/10 to-rose-500/10 hover:from-red-500/20 hover:to-rose-500/20 border-red-500 text-red-700 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-all duration-300 transform hover:scale-105 hover:shadow-lg group",
          selectedButton === false && "scale-110 shadow-xl bg-red-500 text-white border-red-600" // Feedback based on internal selectedButton
        )}
        onClick={() => handleAssess(false)}
        disabled={disabled || selectedButton !== null} // Disable while feedback is active
      >
        <div className="flex items-center space-x-3">
          <div className={cn(
            "w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center transition-all group-hover:bg-red-500/30",
            selectedButton === false && "bg-white/20"
          )}>
            <XCircle className="w-5 h-5" />
          </div>
          <span className="font-semibold">I Didn&apos;t Know</span>
          <span className="text-xs opacity-70">(N)</span>
        </div>
      </Button>
    </div>
  );
}; 