'use client';

import { useState } from 'react';
import FeedbackModal from './FeedbackModal';
import { BiMessageDetail } from 'react-icons/bi';

export default function FeedbackButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
        aria-label="Give Feedback"
        title="Give Feedback"
      >
       <BiMessageDetail className="h-5 w-5" />
      </button>
      
      <FeedbackModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}