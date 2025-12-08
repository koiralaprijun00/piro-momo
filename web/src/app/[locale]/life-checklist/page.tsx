'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import AdSenseGoogle from '@/components/AdSenseGoogle';
import GameButton from '@/components/ui/GameButton';
import { IoCheckmark } from 'react-icons/io5';

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  image: string;
}

// Safe translation function to prevent errors
const safeT = (t: (key: string, params?: Record<string, any>) => string, key: string, defaultValue: string = '', params: Record<string, any> = {}) => {
  try {
    return t(key, params);
  } catch (error) {
    console.warn(`Translation key not found: ${key}`);
    return defaultValue;
  }
};

export default function NepalChecklistPage() {
  const t = useTranslations();
  const mainT = useTranslations('Translations');

  const items: ChecklistItem[] = React.useMemo(() => {
    const checklistData = t.raw('lifeChecklist');
    return Object.entries(checklistData).map(([key, item]) => {
      return item as ChecklistItem;
    });
  }, [t]);

  const [userProgress, setUserProgress] = useState<{ [key: string]: boolean }>({});
  const [adsLoaded, setAdsLoaded] = useState(false);

  useEffect(() => {
    const savedProgress = localStorage.getItem('nepalChecklistProgress');
    if (savedProgress) {
      setTimeout(() => setUserProgress(JSON.parse(savedProgress)), 0);
    }
    
    // Delay ad loading slightly to ensure containers are ready
    const timer = setTimeout(() => {
      setAdsLoaded(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem('nepalChecklistProgress', JSON.stringify(userProgress));
  }, [userProgress]);

  const handleToggleItem = (itemId: string) => {
    setUserProgress((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  const handleShareProgress = async () => {
    const shareMessage = `I've completed ${stats.completedItems} out of ${stats.totalItems} items on my Nepal Life Checklist! (${stats.percentComplete}%) #NepalLifeChecklist`;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'My Nepal Life Checklist Progress',
          text: shareMessage,
          url: 'https://piromomo.com/life-checklist'
        });
      } else {
        await navigator.clipboard.writeText(shareMessage);
        alert('Progress copied to clipboard! Paste it to share.');
      }
    } catch (error) {
      console.error('Sharing failed:', error);
      await navigator.clipboard.writeText(shareMessage);
      alert('Progress copied to clipboard! Paste it to share.');
    }
  };

  // eslint-disable-next-line react-hooks/preserve-manual-memoization
  const stats = React.useMemo(() => {
    const totalItems = items.length;
    const completedItems = Object.keys(userProgress).filter((id) => userProgress[id]).length;
    return {
      totalItems,
      completedItems,
      percentComplete: totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0,
    };
  }, [userProgress, items]);

  const restartProgress = () => {
    setUserProgress({});
  };

  return (
    <div className="min-h-screen w-full">
      {/* Main layout with sidebars */}
      <div className="flex justify-center">
        {/* Left sidebar ad - hidden on mobile */}
        <div className="hidden lg:block w-[160px] sticky top-24 self-start h-[600px] ml-4">
          <div className="w-[160px] h-[600px]">
            <AdSenseGoogle
              adSlot="6865219846"
              adFormat="vertical"
              style={{ width: '160px', height: '400px' }}
            />
          </div>
        </div>
        
        {/* Main content area */}
        <div className="flex-1 px-4 py-8">
          <div className="flex flex-col md:flex-row gap-6 max-w-5xl mx-auto">
            {/* Left column - Title, Progress, Actions */}
            <div className="hidden md:block md:w-1/3 space-y-6 sticky top-8">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="mb-8">
                  <h1 className="text-3xl font-bold text-left bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-red-500 mb-2">
                    {safeT(mainT, 'nepalChecklist.navbarTitle', 'Nepal Life Checklist')}
                  </h1>
                  <p className="text-left text-gray-600">
                    {safeT(mainT, 'nepalChecklist.subtitle', 'Track your journey in Nepal')}
                  </p>
                </div>
                
                {/* Progress Display */}
                <div>
                  <h2 className="text-sm mb-3">Progress</h2>
                  <div className="bg-gradient-to-r from-blue-600 to-red-500 p-0.5 rounded-lg">
                    <div className="bg-white rounded-md p-2 flex justify-between items-center">
                      <div className="flex items-center">
                        <span className="text-3xl font-bold">{stats.completedItems}</span>
                        <span className="ml-2 text-gray-600">/ {stats.totalItems}</span>
                      </div>
                      
                      <div className="bg-gray-100 px-2 py-0.5 rounded-full">
                        <span className="font-mono text-gray-800 ">
                          {stats.percentComplete}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="mt-6 space-y-3">
                  <GameButton
                    onClick={restartProgress}
                    type="neutral"
                    size="sm"
                    fullWidth
                  >
                    Reset Progress
                  </GameButton>
                  
                  {stats.completedItems > 0 && (
                    <GameButton
                      onClick={handleShareProgress}
                      type="success"
                      size="sm"
                      fullWidth
                    >
                      Share Progress
                    </GameButton>
                  )}
                </div>
              </div>
            </div>

            {/* Right column - Checklist Items */}
            <div className="md:w-2/3 w-full">
              <div className="bg-gradient-to-br from-blue-600 to-red-500 p-1 rounded-xl shadow-lg">
                <div className="bg-white rounded-lg p-4 md:p-6 max-h-[calc(100vh-4rem)] overflow-y-auto">
                  {/* Mobile header */}
                  <div className="md:hidden mb-6">
                    <h1 className="text-2xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-red-500 mb-2">
                      {safeT(mainT, 'nepalChecklist.navbarTitle', 'Nepal Life Checklist')}
                    </h1>
                    <div className="w-full max-w-3xl mx-auto">
                      <p className="text-lg mb-2 text-center">
                        {safeT(mainT, 'nepalChecklist.completionText', '{completed} / {total} ({percent}%)', { 
                          completed: stats.completedItems, 
                          total: stats.totalItems, 
                          percent: stats.percentComplete 
                        })}
                      </p>
                      <div className="w-full bg-gray-200 rounded-full h-4">
                        <div
                          className="bg-green-600 h-4 rounded-full transition-all duration-500"
                          style={{ width: `${stats.percentComplete}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Checklist Items Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => handleToggleItem(item.id)}
                        className={`p-4 rounded-lg border-2 transition-all cursor-pointer hover:scale-105 ${
                          userProgress[item.id]
                            ? 'bg-green-50  border-green-500'
                            : 'bg-white  border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        <div className="flex items-start space-x-4">
                          <div className="flex-shrink-0">
                            {userProgress[item.id] ? (
                              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                              <IoCheckmark className="h-4 w-4 text-white" />
                              </div>
                            ) : (
                              <div className="w-6 h-6 border-2 border-gray-300 rounded-full"></div>
                            )}
                          </div>
                          <div>
                            <h3 className="text-lg font-lora font-semibold mb-2 text-gray-900">
                              {item.title}
                            </h3>
                            <p className="text-gray-600 text-sm">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right sidebar ad - hidden on mobile */}
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

      {/* Mobile Footer */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-2 z-10">
        <div className="flex justify-between items-center">
          <GameButton
            onClick={restartProgress}
            type="neutral"
            size="sm"
            className="py-1 text-xs"
          >
            Reset Progress
          </GameButton>
          
          {stats.completedItems > 0 && (
            <GameButton
              onClick={handleShareProgress}
              type="success"
              size="sm"
              className="py-1 text-xs"
            >
              Share Progress
            </GameButton>
          )}
        </div>
      </div>
    </div>
  );
}