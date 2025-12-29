'use client';

import { useState } from 'react';
import { Share2, Check, Copy } from 'lucide-react';
import { 
  FaWhatsapp, 
  FaFacebookF, 
  FaTwitter 
} from 'react-icons/fa';

interface ShareScoreProps {
  score: number;
  total: number;
  gameTitle: string;
  className?: string;
  gameUrl?: string; // e.g. "kings-of-nepal"
}

export default function ShareScore({ score, total, gameTitle, className = '', gameUrl = '' }: ShareScoreProps) {
  const [copied, setCopied] = useState(false);

  const getShareText = () => {
    // Determine performance emoji
    const percentage = (score / total) * 100;
    let rankEmoji = '🤔';
    if (percentage === 100) rankEmoji = '👑';
    else if (percentage >= 80) rankEmoji = '🔥';
    else if (percentage >= 50) rankEmoji = '👍';

    return `🇳🇵 I scored ${score}/${total} ${rankEmoji} in ${gameTitle}!\n\nCan you beat me? Play properly Nepali games here:\nhttps://piromomo.com/${gameUrl}\n\n#Piromomo #Nepal`;
  };

  const handleShare = async () => {
    const text = getShareText();
    const url = `https://piromomo.com/${gameUrl}`;

    // Try Native Share API first (Mobile)
    if (navigator.share) {
      try {
        await navigator.share({
          title: `My Score in ${gameTitle}`,
          text: text,
          url: url
        });
        return;
      } catch (err) {
        console.log('Error sharing:', err);
      }
    }

    // Fallback to Clipboard (Desktop)
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      <button
        onClick={handleShare}
        className="relative group bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2 w-full justify-center sm:w-auto"
      >
        {copied ? <Check className="w-5 h-5" /> : <Share2 className="w-5 h-5" />}
        <span>{copied ? 'Copied!' : 'Share Score'}</span>
        
        {!copied && (
           <span className="absolute -top-1 -right-1 flex h-3 w-3">
             <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
             <span className="relative inline-flex rounded-full h-3 w-3 bg-pink-500"></span>
           </span>
        )}
      </button>
      
      <p className="text-xs text-gray-500 text-center">
        Challenge your friends on WhatsApp or Facebook!
      </p>
    </div>
  );
}
