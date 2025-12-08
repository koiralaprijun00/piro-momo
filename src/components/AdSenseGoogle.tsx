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

  // Initialize the ad
  useEffect(() => {
    if (typeof window === 'undefined' || !adRef.current) return;

    // Force reinitialize even if previously initialized
    const initAd = () => {
      try {
        // Clear any existing content
        if (adRef.current) {
          adRef.current.innerHTML = '';
        
          // Create ad element
          const adElement = document.createElement('ins');
          adElement.className = 'adsbygoogle';
          adElement.style.display = 'block';
          adElement.style.width = adWidth;
          adElement.style.height = adHeight;
          
          // Set attributes without data-nscript
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
          
          // Ensure adsbygoogle is defined and push the ad
          if (window.adsbygoogle) {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
            setAdInitialized(true);
          } else {
            // Create a retry mechanism for slower loading environments
            const retryTimer = setTimeout(() => {
              if (window.adsbygoogle) {
                (window.adsbygoogle = window.adsbygoogle || []).push({});
                setAdInitialized(true);
              }
            }, 1000);
            
            return () => clearTimeout(retryTimer);
          }
        }
      } catch (error) {
        console.error('AdSense initialization error:', error);
      }
    };

    // Use a lower threshold for better detection
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          initAd();
          observer.disconnect();
        }
      },
      { threshold: 0.01 } // Lower threshold to trigger on minimal visibility
    );

    if (adRef.current) {
      observer.observe(adRef.current);
    }

    // Fallback initialization after a delay (to ensure ads load even if visibility detection fails)
    const fallbackTimer = setTimeout(() => {
      if (!adInitialized && adRef.current) {
        initAd();
      }
    }, 2000);

    return () => {
      observer.disconnect();
      clearTimeout(fallbackTimer);
    };
  }, [adSlot, adWidth, adHeight, adFormat, adInitialized]);

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