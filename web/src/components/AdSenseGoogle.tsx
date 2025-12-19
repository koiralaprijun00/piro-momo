'use client';

import { useEffect, useRef, useState } from 'react';

interface AdSenseProps {
  adSlot: string;
  adFormat?: 'auto' | 'horizontal' | 'vertical' | 'rectangle';
  style?: React.CSSProperties;
  className?: string;
}

export default function AdSenseGoogle({
  adSlot,
  adFormat = 'auto',
  style = {},
  className = '',
}: AdSenseProps) {
  const adRef = useRef<HTMLDivElement>(null);
  const [adInitialized, setAdInitialized] = useState(false);

  // Set up standard ad sizes based on format
  let adWidth = '100%';
  let adHeight = '100%';

  // Set standard sizes based on format
  switch (adFormat) {
    case 'horizontal':
      adWidth = '728px';
      adHeight = '90px';
      break;
    case 'vertical':
      adWidth = '160px';
      adHeight = '600px';
      break;
    case 'rectangle':
      adWidth = '300px';
      adHeight = '250px';
      break;
    // auto will use responsive sizing
  }

  // Override with any custom sizes
  if (style.width) adWidth = typeof style.width === 'string' ? style.width : `${style.width}px`;
  if (style.height) adHeight = typeof style.height === 'string' ? style.height : `${style.height}px`;
  const isInitializedRef = useRef(false);

  // Initialize the ad
  useEffect(() => {
    if (typeof window === 'undefined' || !adRef.current || isInitializedRef.current) return;

    const initAd = () => {
      if (isInitializedRef.current || !adRef.current) return;
      
      try {
        // Clear any existing content to be safe
        adRef.current.innerHTML = '';
      
        // Create ad element
        const adElement = document.createElement('ins');
        adElement.className = 'adsbygoogle';
        adElement.style.display = 'block';
        adElement.style.width = adWidth;
        adElement.style.height = adHeight;
        
        // Set attributes
        adElement.setAttribute('data-ad-client', 'ca-pub-4708248697764153');
        adElement.setAttribute('data-ad-slot', adSlot);
        
        if (adFormat === 'auto') {
          adElement.setAttribute('data-ad-format', 'auto');
          adElement.setAttribute('data-full-width-responsive', 'true');
        } else {
          adElement.setAttribute('data-full-width-responsive', 'false');
        }
        
        // Append to container
        adRef.current.appendChild(adElement);
        
        // Mark as initialized BEFORE pushing to prevent race conditions
        isInitializedRef.current = true;
        setAdInitialized(true);

        // Define push function
        const pushAd = () => {
          try {
            if (window.adsbygoogle) {
              (window.adsbygoogle = window.adsbygoogle || []).push({});
            }
          } catch (e) {
            console.error('Inner AdSense push error:', e);
          }
        };

        if (window.adsbygoogle) {
          pushAd();
        } else {
          // Retry if script isn't loaded yet
          const retryTimer = setTimeout(pushAd, 1000);
          return () => clearTimeout(retryTimer);
        }
      } catch (error) {
        console.error('AdSense initialization error:', error);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isInitializedRef.current) {
          initAd();
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(adRef.current);

    // Initial check in case it's already visible
    const fallbackTimer = setTimeout(() => {
      if (!isInitializedRef.current) {
        initAd();
      }
    }, 1500);

    return () => {
      observer.disconnect();
      clearTimeout(fallbackTimer);
    };
  }, [adSlot, adWidth, adHeight, adFormat]);

  return (
    <div
      ref={adRef}
      className={`adsense-container ${className}`}
      style={{
        display: 'block',
        width: adWidth,
        height: adHeight,
        overflow: 'hidden',
        ...style,
      }}
    />
  );
}

// Type definition
declare global {
  interface Window {
    adsbygoogle: Record<string, unknown>[];
  }
}