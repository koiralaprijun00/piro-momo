'use client';

import React, { useState, useRef } from 'react';
import { useTranslations } from 'next-intl';

// Define available social platforms
type SocialPlatform = 'twitter' | 'facebook' | 'whatsapp' | 'linkedin' | 'copy';

interface ShareButtonProps {
  url?: string;
  text: string;
  hashtags: string[];
  platforms: SocialPlatform[];
  buttonType?: 'primary' | 'neutral' | 'success';
  iconOnly?: boolean;
  placement?: 'horizontal' | 'dropdown';
  className?: string;
}

export default function ShareButton({
  url = typeof window !== 'undefined' ? window.location.href : '',
  text,
  hashtags,
  platforms = ['twitter', 'facebook', 'whatsapp', 'copy'],
  buttonType = 'primary',
  iconOnly = false,
  placement = 'horizontal',
  className = ''
}: ShareButtonProps) {
  const t = useTranslations('Translations');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Define button style based on buttonType
  const buttonStyle = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    neutral: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
    success: 'bg-green-600 hover:bg-green-700 text-white'
  }[buttonType];

  // Close dropdown when clicking outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Reset copy success message after 2 seconds
  React.useEffect(() => {
    if (copySuccess) {
      const timer = setTimeout(() => setCopySuccess(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copySuccess]);

  // Handle sharing functions
  const handleShare = (platform: SocialPlatform) => {
    setDropdownOpen(false);
    
    const hashtagString = hashtags.join(',');
    const encodedText = encodeURIComponent(text);
    const encodedUrl = encodeURIComponent(url);
    const encodedHashtags = encodeURIComponent(hashtagString);
    
    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}&hashtags=${encodedHashtags}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`, '_blank');
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodedText} ${encodedUrl}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(`${text} ${url}`).then(() => {
          setCopySuccess(true);
        });
        break;
    }
  };

  // Platform-specific icons
  const PlatformIcon = ({ platform }: { platform: SocialPlatform }) => {
    switch (platform) {
      case 'twitter':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
          </svg>
        );
      case 'facebook':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
          </svg>
        );
      case 'whatsapp':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path fillRule="evenodd" d="M20.998 11.498c0 5.245-4.251 9.487-9.499 9.5-1.666.01-3.308-.41-4.813-1.206L2 22l2.227-4.63a9.443 9.443 0 01-1.243-4.73c0-5.245 4.252-9.488 9.5-9.488s9.514 4.246 9.514 9.495v.05h-.001zM12.5 5.124a7.74 7.74 0 00-7.735 7.731c-.01 1.459.388 2.877 1.15 4.114l-1.51 3.13 3.247-1.499a7.728 7.728 0 003.846 1.025h.006a7.73 7.73 0 007.729-7.731 7.729 7.729 0 00-7.734-7.77h.001zm4.656 11.062c-.209.59-1.233 1.089-1.697 1.148-.432.056-.848.027-2.285-.55-1.92-.767-3.162-2.648-3.259-2.771-.099-.121-.807-.978-.807-1.864s.51-1.336.688-1.512c.179-.176.39-.22.52-.22l.37.007c.121.007.275-.043.431.325.16.373.542 1.291.59 1.384.05.093.082.202.016.32-.066.121-.099.196-.198.304-.98.108-.2.24-.287.325-.121.117-.248.246-.106.484.142.238.63 1.02 1.353 1.646 1.092 1.058 1.586 1.205 1.844 1.321.26.115.41.101.559-.058.15-.158.64-.69.81-.928.17-.238.342-.196.574-.117.231.08 1.468.69 1.722.819.254.128.418.19.481.299.66.121.066.69-.143 1.279z" clipRule="evenodd" />
          </svg>
        );
      case 'linkedin':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
          </svg>
        );
      case 'copy':
        return copySuccess ? (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
          </svg>
        );
    }
  };

  // Platform-specific labels
  const getPlatformLabel = (platform: SocialPlatform) => {
    switch (platform) {
      case 'twitter':
        return t('twitter');
      case 'facebook':
        return t('facebook');
      case 'whatsapp':
        return t('whatsapp');
      case 'linkedin':
        return t('linkedin');
      case 'copy':
        return copySuccess ? t('copied') : t('copyLink');
    }
  };

  // Render dropdown version
  if (placement === 'dropdown') {
    return (
      <div className={`relative inline-block ${className}`} ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className={`${buttonStyle} flex items-center justify-center rounded-md px-4 py-2`}
          aria-label={t('share')}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
          </svg>
          {!iconOnly && <span className="ml-2">{t('share')}</span>}
        </button>
        
        {dropdownOpen && (
          <div className="absolute z-10 right-0 mt-2 w-48 bg-white rounded-md shadow-lg overflow-hidden">
            <div className="py-1">
              {platforms.map((platform) => (
                <button
                  key={platform}
                  onClick={() => handleShare(platform)}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <span className="mr-2"><PlatformIcon platform={platform} /></span>
                  <span>{getPlatformLabel(platform)}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Render horizontal version
  return (
    <div className={`flex ${platforms.length > 2 ? 'flex-wrap' : ''} gap-2 ${className}`}>
      {platforms.map((platform) => (
        <button
          key={platform}
          onClick={() => handleShare(platform)}
          className={`flex items-center justify-center rounded-md px-4 py-2 ${buttonStyle}`}
          aria-label={getPlatformLabel(platform)}
        >
          <span><PlatformIcon platform={platform} /></span>
          {!iconOnly && <span className="ml-2">{getPlatformLabel(platform)}</span>}
        </button>
      ))}
    </div>
  );
}