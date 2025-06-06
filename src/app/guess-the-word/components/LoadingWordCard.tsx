import React from 'react';
import { Card, CardContent } from './ui/card'; // Updated path

interface LoadingWordCardProps {
  isLoadingWord: boolean;
}

export const LoadingWordCard: React.FC<LoadingWordCardProps> = ({
  isLoadingWord
}) => {
  return (
    <div className="relative w-full h-96 flex items-center justify-center">
      <Card className="w-full shadow-2xl bg-gradient-to-br from-gradient-yellow via-gradient-orange to-gradient-magenta p-1 animate-pulse">
        <CardContent className="bg-card p-8 rounded-md h-full flex flex-col items-center justify-center space-y-4">
          <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 animate-spin">
            <div className="w-full h-full rounded-full border-4 border-white border-t-transparent"></div>
          </div>
          <div className="text-xl font-medium text-muted-foreground animate-bounce">
            {isLoadingWord ? 'Preparing next word...' : 'Ready to start learning!'}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 