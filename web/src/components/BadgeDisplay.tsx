'use client';

import { Badge, UserBadge, UserStats } from '@/lib/types';
import { BADGES, calculateEarnedBadges } from '@/lib/badges';
import { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';

interface BadgeCardProps {
  badge: Badge;
  isUnlocked: boolean;
  canUnlock: boolean;
  unlockedAt?: string;
  stats: UserStats;
  onUnlock: () => void;
}

function BadgeCard({ badge, isUnlocked, canUnlock, unlockedAt, stats, onUnlock }: BadgeCardProps) {
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const progress = !isUnlocked && badge.progress ? badge.progress(stats) : null;
  const progressPercent = progress ? Math.min((progress.current / progress.target) * 100, 100) : 0;

  const tierColors = {
    bronze: 'from-amber-600 to-amber-800',
    silver: 'from-gray-400 to-gray-600',
    gold: 'from-yellow-400 to-yellow-600'
  };

  const handleUnlock = async () => {
    if (!canUnlock || isUnlocked || isUnlocking) return;
    
    setIsUnlocking(true);
    
    // Trigger unlock
    await onUnlock();
    
    // Show success state
    setTimeout(() => {
      setShowSuccess(true);
    }, 400);
    
    // Reset animation states
    setTimeout(() => {
      setIsUnlocking(false);
      setShowSuccess(false);
    }, 1500);
  };

  return (
    <div 
      className={`flex-shrink-0 w-48 p-4 rounded-xl border-2 transition-all duration-300 ease-out ${
        isUnlocked 
          ? 'bg-gradient-to-br from-orange-50 to-yellow-50 border-orange-200 shadow-md' 
          : canUnlock
          ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-300 shadow-sm cursor-pointer hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]'
          : 'bg-gray-50 border-gray-200 opacity-60'
      } ${isUnlocking ? 'scale-110 shadow-2xl' : ''} ${showSuccess ? 'scale-105' : ''}`}
      onClick={canUnlock && !isUnlocked ? handleUnlock : undefined}
      style={{
        transform: isUnlocking ? 'scale(1.1) translateY(-8px)' : showSuccess ? 'scale(1.05)' : undefined,
        transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'
      }}
    >
      {/* Badge Icon */}
      <div className="flex flex-col items-center text-center space-y-2 relative">
        {/* Success Particles */}
        {showSuccess && (
          <>
            <div className="absolute -top-2 -left-2 text-2xl animate-ping opacity-75">✨</div>
            <div className="absolute -top-2 -right-2 text-2xl animate-ping opacity-75" style={{ animationDelay: '0.1s' }}>✨</div>
            <div className="absolute -bottom-2 left-1/2 text-2xl animate-ping opacity-75" style={{ animationDelay: '0.2s' }}>🎉</div>
          </>
        )}
        
        <div 
          className={`text-5xl transition-all duration-500 ${
            !isUnlocked && !canUnlock && 'grayscale opacity-40'
          } ${isUnlocking ? 'scale-125 rotate-12' : ''} ${showSuccess ? 'scale-110' : ''}`}
          style={{
            filter: isUnlocking ? 'brightness(1.3) drop-shadow(0 0 20px rgba(251, 146, 60, 0.5))' : undefined,
            transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)'
          }}
        >
          {badge.icon}
        </div>
        
        {/* Badge Name */}
        <div className={`transition-all duration-300 ${isUnlocking ? 'opacity-50 scale-95' : 'opacity-100'}`}>
          <h3 className="font-bold text-sm text-gray-900 line-clamp-1">{badge.nameNepali}</h3>
          <p className="text-xs text-gray-600 line-clamp-1">{badge.nameEnglish}</p>
        </div>
        
        {/* Tier Badge */}
        {badge.tier && isUnlocked && (
          <span 
            className={`px-2 py-0.5 text-xs font-semibold text-white rounded bg-gradient-to-r ${tierColors[badge.tier]} transition-all duration-300 ${showSuccess ? 'scale-110' : ''}`}
          >
            {badge.tier.toUpperCase()}
          </span>
        )}
        
        {/* Progress Bar for Locked Badges */}
        {!isUnlocked && progress && (
          <div className="w-full">
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>{progress.current}/{progress.target}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
              <div 
                className={`h-1.5 rounded-full transition-all duration-700 ease-out ${
                  canUnlock ? 'bg-gradient-to-r from-green-400 to-emerald-600' : 'bg-gradient-to-r from-orange-400 to-orange-600'
                }`}
                style={{ 
                  width: `${progressPercent}%`,
                  transform: isUnlocking ? 'scaleX(1.05)' : undefined
                }}
              />
            </div>
          </div>
        )}
        
        {/* Unlock Date */}
        {isUnlocked && unlockedAt && (
          <p className={`text-xs text-gray-400 transition-all duration-300 ${showSuccess ? 'scale-105 text-green-600' : ''}`}>
            {new Date(unlockedAt).toLocaleDateString()}
          </p>
        )}
        
        {/* Lock Icon - Interactive for earned badges */}
        {!isUnlocked && (
          <div className="relative">
            {canUnlock ? (
              <div className={`flex flex-col items-center transition-all duration-300 ${isUnlocking ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}>
                <span className="text-2xl animate-pulse">🔓</span>
                <p className="text-xs text-green-600 font-semibold mt-1">Click to unlock!</p>
              </div>
            ) : (
              <span className="text-xl opacity-30">🔒</span>
            )}
          </div>
        )}
        
        {/* Unlocking State */}
        {isUnlocking && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-orange-400 border-t-transparent rounded-full animate-spin" 
                 style={{ animationDuration: '0.6s' }}
            />
          </div>
        )}
        
        {/* Success Checkmark */}
        {showSuccess && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-4xl animate-bounce">✓</div>
          </div>
        )}
      </div>
    </div>
  );
}

interface BadgeDisplayProps {
  stats: UserStats;
}

export default function BadgeDisplay({ stats }: BadgeDisplayProps) {
  const { user } = useAuth();
  const userBadges = stats.badges || [];
  const unlockedBadgeIds = userBadges.map(b => b.badgeId);
  
  // Calculate which badges can be unlocked
  const earnedBadgeIds = calculateEarnedBadges(stats);
  
  const unlockedCount = unlockedBadgeIds.length;
  const totalCount = BADGES.length;

  const handleUnlockBadge = async (badgeId: string) => {
    if (!user) return;
    
    try {
      const userRef = doc(db, 'user_stats', user.uid);
      const newBadge: UserBadge = {
        badgeId,
        unlockedAt: new Date().toISOString()
      };
      
      await updateDoc(userRef, {
        badges: [...userBadges, newBadge]
      });
      
      // Show celebration (optional - could add confetti here)
      console.log('🎉 Badge unlocked!', badgeId);
    } catch (error) {
      console.error('Error unlocking badge:', error);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900 flex items-center">
          🏅 Badges
        </h2>
        <div className="text-sm font-medium text-gray-600">
          {unlockedCount} / {totalCount}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
        <div className="flex justify-between text-xs text-gray-600 mb-1">
          <span>Progress</span>
          <span>{Math.round((unlockedCount / totalCount) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-orange-400 to-orange-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${(unlockedCount / totalCount) * 100}%` }}
          />
        </div>
      </div>

      {/* Horizontal Scrollable Badge List */}
      <div className="relative">
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
          {BADGES.map(badge => {
            const userBadge = userBadges.find(ub => ub.badgeId === badge.id);
            const isUnlocked = !!userBadge;
            const canUnlock = earnedBadgeIds.includes(badge.id) && !isUnlocked;
            
            return (
              <div key={badge.id} className="snap-start">
                <BadgeCard
                  badge={badge}
                  isUnlocked={isUnlocked}
                  canUnlock={canUnlock}
                  unlockedAt={userBadge?.unlockedAt}
                  stats={stats}
                  onUnlock={() => handleUnlockBadge(badge.id)}
                />
              </div>
            );
          })}
        </div>
        
        {/* Scroll Hint */}
        <div className="absolute right-0 top-0 bottom-4 w-12 bg-gradient-to-l from-gray-50 to-transparent pointer-events-none" />
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
