'use client';

import React, { useState } from 'react';
import { FiShare2, FiTwitter, FiFacebook } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { useTranslations } from 'next-intl';

interface ShareButtonProps {
  url?: string;               // URL to share (defaults to current URL)
  title?: string;             // Title for the share (defaults to page title)
  text?: string;              // Main text content for the share
  hashtags?: string[];        // Hashtags to include in the share (for Twitter)
  platforms?: ('twitter' | 'facebook' | 'whatsapp' | 'copy')[];  // Platforms to show
  placement?: 'dropdown' | 'horizontal';  // How to display the sharing options
  className?: string;         // Additional CSS classes
  buttonType?: 'primary' | 'neutral' | 'success'; // Button styling
  iconOnly?: boolean;         // Whether to show only the icon (no text)
  onShareComplete?: () => void; // Callback after sharing
  summaryRef?: React.RefObject<HTMLDivElement | null>; // Reference to the summary section
  totalSpent?: number;        // Total amount spent
}

export default function SocialShare({
  url,
  title,
  text,
  hashtags = ['piromomo', 'nepal'],
  platforms = ['twitter', 'facebook', 'whatsapp', 'copy'],
  placement = 'dropdown',
  className = '',
  buttonType = 'primary',
  iconOnly = false,
  onShareComplete,
  summaryRef,
  totalSpent
}: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showCopiedMessage, setShowCopiedMessage] = useState(false);
  const t = useTranslations('Translations'); // Use your existing translations

  // Get the current URL if none is provided
  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const shareTitle = title || (typeof window !== 'undefined' ? document.title : 'Piromomo');

  // Prepare the share text with hashtags for Twitter
  const hashtagString = hashtags.join(',');
  
  // Create share URLs for different platforms
  const getTwitterShareUrl = () => {
    const twitterText = text || t('shareDefaultText');
    return `https://twitter.com/intent/tweet?text=${encodeURIComponent(twitterText)}&url=${encodeURIComponent(shareUrl)}&hashtags=${hashtagString}`;
  };
  
  const getFacebookShareUrl = () => {
    return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
  };
  
  const getWhatsAppShareUrl = () => {
    const whatsappText = text || shareTitle;
    return `https://wa.me/?text=${encodeURIComponent(whatsappText + ' ' + shareUrl)}`;
  };

  // Share handlers
  const handleTwitterShare = () => {
    window.open(getTwitterShareUrl(), '_blank', 'width=550,height=420');
    handleShareComplete();
  };

  const handleFacebookShare = () => {
    window.open(getFacebookShareUrl(), '_blank', 'width=550,height=420');
    handleShareComplete();
  };

  const handleWhatsAppShare = () => {
    window.open(getWhatsAppShareUrl(), '_blank');
    handleShareComplete();
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setShowCopiedMessage(true);
      setTimeout(() => setShowCopiedMessage(false), 2000);
      handleShareComplete();
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  // Use Web Share API if available
  const handleWebShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: text || t('shareDefaultText'),
          url: shareUrl,
        });
        handleShareComplete();
      } catch (err) {
        console.error('Error sharing:', err);
        setIsOpen(true); // Fall back to our custom sharing options
      }
    } else {
      setIsOpen(true); // No Web Share API, show our custom sharing options
    }
  };

  // Callback for when sharing is complete
  const handleShareComplete = () => {
    setIsOpen(false);
    if (onShareComplete) onShareComplete();
  };

  // Button style classes based on buttonType
  const buttonClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    neutral: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
    success: 'bg-green-500 hover:bg-green-600 text-white',
  };

  return (
    <div className={`relative ${className}`}>
      {/* Main share button */}
      <button
        onClick={handleWebShare}
        className={`flex items-center justify-center rounded-lg transition-all duration-200 ${
          buttonClasses[buttonType]
        } ${iconOnly ? 'p-2' : 'px-4 py-2'}`}
        aria-label={t('share') || 'Share'}
      >
        <FiShare2 className={`h-5 w-5 ${iconOnly ? '' : 'mr-2'}`} />
        {!iconOnly && (t('share') || 'Share')}
      </button>

      {/* Dropdown or horizontal share options */}
      {isOpen && (
        <div 
          className={`${
            placement === 'dropdown' 
              ? 'absolute z-50 mt-2 right-0 w-56 bg-white rounded-lg shadow-lg py-2 border border-gray-200' 
              : 'flex space-x-2 mt-2'
          }`}
        >
          {platforms.includes('twitter') && (
            <button
              onClick={handleTwitterShare}
              className={`${
                placement === 'dropdown'
                  ? 'w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center'
                  : 'p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600'
              }`}
              aria-label="Share on Twitter"
            >
              <FiTwitter className="h-5 w-5 mr-2" />
              {placement === 'dropdown' && 'Twitter'}
            </button>
          )}
          
          {platforms.includes('facebook') && (
            <button
              onClick={handleFacebookShare}
              className={`${
                placement === 'dropdown'
                  ? 'w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center'
                  : 'p-2 rounded-full bg-blue-700 text-white hover:bg-blue-800'
              }`}
              aria-label="Share on Facebook"
            >
              <FiFacebook className="h-5 w-5 mr-2" />
              {placement === 'dropdown' && 'Facebook'}
            </button>
          )}
          
          {platforms.includes('whatsapp') && (
            <button
              onClick={handleWhatsAppShare}
              className={`${
                placement === 'dropdown'
                  ? 'w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center'
                  : 'p-2 rounded-full bg-green-500 text-white hover:bg-green-600'
              }`}
              aria-label="Share on WhatsApp"
            >
              <FaWhatsapp className="h-5 w-5 mr-2" />
              {placement === 'dropdown' && 'WhatsApp'}
            </button>
          )}
          
          {platforms.includes('copy') && (
            <button
              onClick={handleCopyLink}
              className={`${
                placement === 'dropdown'
                  ? 'w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center'
                  : 'p-2 rounded-full bg-gray-500 text-white hover:bg-gray-600'
              }`}
              aria-label="Copy link"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
              {placement === 'dropdown' && (showCopiedMessage ? 'Copied!' : 'Copy Link')}
            </button>
          )}
        </div>
      )}
    </div>
  );
}