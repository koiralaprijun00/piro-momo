'use client';

import React, { useState, useRef, useEffect } from 'react';
import { FiShare2 } from 'react-icons/fi';
import { FaTwitter, FaFacebook, FaWhatsapp, FaLinkedin, FaReddit } from 'react-icons/fa';
import { HiOutlineClipboardCopy } from 'react-icons/hi';
import { useTranslations } from 'next-intl';

interface NavBarShareButtonProps {
  className?: string;
}

export default function NavBarShareButton({ className = '' }: NavBarShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const t = useTranslations('Translations');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen]);

  // Reset copy message after 2 seconds
  useEffect(() => {
    if (copySuccess) {
      const timer = setTimeout(() => setCopySuccess(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copySuccess]);

  // Get current URL and page title
  const getUrl = () => window.location.href;
  const getTitle = () => document.title || 'Piromomo';

  // Share handlers
  const handleTwitterShare = () => {
    const url = getUrl();
    const text = t('shareDefaultText');
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}&hashtags=Piromomo,Nepal`,
      '_blank'
    );
    setIsOpen(false);
  };

  const handleFacebookShare = () => {
    const url = getUrl();
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
    setIsOpen(false);
  };

  const handleWhatsAppShare = () => {
    const url = getUrl();
    const text = t('shareDefaultText');
    window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
    setIsOpen(false);
  };

  const handleLinkedInShare = () => {
    const url = getUrl();
    const title = getTitle();
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      '_blank'
    );
    setIsOpen(false);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(getUrl());
      setCopySuccess(true);
      setTimeout(() => {
        setIsOpen(false);
        setCopySuccess(false);
      }, 1000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Share icon button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-red-500  hover:text-orange-700 transition-colors duration-200 p-1 rounded-md focus:outline-none focus:ring-1 focus:ring-red-700"
        aria-expanded={isOpen}
        aria-label={t('shareTitle')}
      >
        <FiShare2 className="text-xl" />
      </button>

      {/* Dropdown with sharing options */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-10">
          <button
            onClick={handleTwitterShare}
            className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center text-gray-700"
          >
            <FaTwitter className="mr-3 text-[#1DA1F2]" />
            <span>{t('twitter')}</span>
          </button>
          
          <button
            onClick={handleFacebookShare}
            className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center text-gray-700"
          >
            <FaFacebook className="mr-3 text-[#4267B2]" />
            <span>{t('facebook')}</span>
          </button>
          
          <button
            onClick={handleWhatsAppShare}
            className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center text-gray-700"
          >
            <FaWhatsapp className="mr-3 text-[#25D366]" />
            <span>{t('whatsapp')}</span>
          </button>
          
          <button
            onClick={handleLinkedInShare}
            className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center text-gray-700"
          >
            <FaLinkedin className="mr-3 text-[#0077B5]" />
            <span>{t('linkedin') || 'LinkedIn'}</span>
          </button>
          
          <button
            onClick={handleCopyLink}
            className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center text-gray-700"
          >
            <HiOutlineClipboardCopy className="mr-3" />
            <span>{copySuccess ? t('copied') : t('copyLink')}</span>
          </button>
        </div>
      )}
    </div>
  );
}