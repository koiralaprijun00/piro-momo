'use client';

import React from 'react';

interface AdPlaceholderProps {
  width?: string | number;
  height?: string | number;
  className?: string;
  message?: string;
}

/**
 * A component to show while ads are loading
 * This helps identify if the ad container is rendering correctly
 */
export default function AdPlaceholder({
  width = '100%',
  height = '100%',
  className = '',
  message = 'Advertisement'
}: AdPlaceholderProps) {
  // Format dimensions
  const formattedWidth = typeof width === 'number' ? `${width}px` : width;
  const formattedHeight = typeof height === 'number' ? `${height}px` : height;
  
  return (
    <div 
      className={`bg-gray-100 border border-gray-200 flex items-center justify-center ${className}`}
      style={{ 
        width: formattedWidth, 
        height: formattedHeight,
        maxWidth: '100%'
      }}
    >
      <div className="text-gray-400 text-sm font-medium text-center opacity-70">
        {message}
      </div>
    </div>
  );
}