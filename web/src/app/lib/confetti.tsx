// lib/confetti.tsx
'use client';

import React, { useEffect, useState } from 'react';

interface ContainedConfettiProps {
  duration?: number; // Duration in milliseconds
}

const ContainedConfetti: React.FC<ContainedConfettiProps> = ({ duration = 8000 }) => {
  const [isActive, setIsActive] = useState(true);
  const [confettiItems, setConfettiItems] = useState<React.ReactNode[]>([]);
  
  useEffect(() => {
    // Generate confetti pieces
    const colors = [
      'bg-yellow-400', 'bg-blue-500', 'bg-red-400', 
      'bg-green-400', 'bg-purple-400', 'bg-pink-400'
    ];
    
    const items: React.ReactNode[] = [];
    for (let i = 0; i < 70; i++) {
      const left = Math.random() * 100;
      const top = -10 - (Math.random() * 20); // Start above the container
      // Make animation much slower - between 3 and 7 seconds
      const animationDuration = 3 + Math.random() * 4;
      // More staggered delays - up to 2 seconds
      const animationDelay = Math.random() * 2;
      const size = 5 + Math.random() * 10; // Slightly larger pieces
      const rotate = Math.random() * 360;
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      items.push(
        <div
          key={i}
          className={`absolute ${color} opacity-70 rounded-sm`}
          style={{
            left: `${left}%`,
            top: `${top}%`,
            width: `${size}px`,
            height: `${size}px`,
            transform: `rotate(${rotate}deg)`,
            // Use ease-out for a more natural falling motion
            animation: `confetti-fall ${animationDuration}s ease-out ${animationDelay}s forwards`
          }}
        />
      );
    }
    
    setTimeout(() => {
      setConfettiItems(items);
    }, 0);
    
    // Set a timeout to hide confetti after the specified duration
    // Extended to 8 seconds by default
    const timer = setTimeout(() => {
      setIsActive(false);
    }, duration);
    
    return () => clearTimeout(timer);
  }, [duration]);
  
  if (!isActive) return null;
  
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
      {confettiItems}
      <style jsx>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0.7;
          }
          50% {
            opacity: 0.8; /* Keep confetti visible longer */
          }
          100% {
            transform: translateY(1000px) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default ContainedConfetti;