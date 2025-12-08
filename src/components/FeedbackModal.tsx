'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { ImSpinner8 } from 'react-icons/im';
import { IoCloseOutline } from 'react-icons/io5';
import { BsCheckLg } from 'react-icons/bs';


interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
  const [feedback, setFeedback] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);


  const t = useTranslations("Translations"); 

  // Handle click outside the modal
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Handle escape key
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscKey);
    return () => {
      window.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, onClose]);

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!feedback.trim()) return;
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Send feedback to your MongoDB API endpoint
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          feedback,
          email: email.trim() || null,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit feedback');
      }
      
      // Show success message
      setSubmitted(true);
      
      // Reset the form after a few seconds
      setTimeout(() => {
        setFeedback('');
        setEmail('');
        onClose();
        setSubmitted(false);
      }, 3000);
      
    } catch (err) {
      console.error('Error submitting feedback:', err);
      setError('Failed to submit feedback. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center backdrop-blur-sm transition-all duration-300">
      <div
        ref={modalRef}
        className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden transform transition-all duration-300"
      >
        {submitted ? (
          <div className="p-6 text-center">
            <div className="w-16 h-16 bg-green-100  rounded-full flex items-center justify-center mx-auto mb-4">
            <BsCheckLg className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Thank You!</h3>
            <p className="text-gray-600 ">
              Your feedback has been submitted. We appreciate your input!
            </p>
          </div>
        ) : (
          <>
            <div className="bg-gradient-to-r from-blue-800 to-red-900 p-4 text-white">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">{t('shareFeedbackTitle')}</h2>
                <button
                  onClick={onClose}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <IoCloseOutline className="w-5 h-5" />
                </button>
              </div>
              <p className="mt-2 text-sm font-semibold text-white text-opacity-90">
              {t('feedbackDescription')}
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-md">
                  {error}
                </div>
              )}
              
              <div className="mb-4">
                <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Feedback
                </label>
                <textarea
                  id="feedback"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Tell us what you think about Piromomo..."
                  className="w-full px-3 py-2 border border-gray-300  rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  rows={4}
                  required
                ></textarea>
              </div>
              
              <div className="mb-6">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700  mb-1">
                  Email (optional)
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="mr-2 px-4 py-2 text-gray-700 hover:text-gray-900 "
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !feedback.trim()}
                  className={`px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-md shadow-sm hover:from-orange-600 hover:to-red-600 transition-colors ${
                    isSubmitting || !feedback.trim() ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <ImSpinner8 className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                      Submitting...
                    </span>
                  ) : (
                    'Submit Feedback'
                  )}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}