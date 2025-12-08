import React, { useState } from 'react';
import Image from 'next/image';

interface LogoImageProps {
  src: string;
  alt: string;
  blurred?: boolean;
  width?: number;
  height?: number;
  className?: string;
  onImageLoad?: () => void;
}

/**
 * A component for displaying logo images with optional blurring effect
 */
const LogoImage: React.FC<LogoImageProps> = ({
  src,
  alt,
  blurred = false,
  width = 128,
  height = 128,
  className = '',
  onImageLoad
}) => {
  const [imageError, setImageError] = useState(false);
  
  // Handle image loading errors
  const handleError = () => {
    console.warn(`Failed to load image: ${src}`);
    setImageError(true);
  };
  
  // Use placeholder for missing images
  const imageSrc = imageError ? '/logos/placeholder.png' : src;
  
  return (
    <div 
      className={`relative overflow-hidden ${className}`}
      style={{ 
        width: width || 'auto', 
        height: height || 'auto',
      }}
    >
      <div className={`transition-all duration-500 ${blurred ? 'blur-sm filter-grayscale' : 'filter-none'}`}>
        <Image
          src={imageSrc}
          alt={alt}
          width={width}
          height={height}
          onError={handleError}
          onLoad={onImageLoad}
          className="object-contain max-w-full max-h-full"
        />
      </div>
      
      {/* Prevent right-click to disable easy cheating */}
      <div 
        className="absolute inset-0" 
        onContextMenu={(e) => e.preventDefault()}
      />
    </div>
  );
};

export default LogoImage;