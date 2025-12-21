'use client';

import { useState, useEffect } from 'react';
import { updateProfile, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import GameButton from '@/components/ui/GameButton';

interface ProfileFormProps {
  user: User;
}

export default function ProfileForm({ user }: ProfileFormProps) {
  const [displayName, setDisplayName] = useState(user.displayName || '');
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setDisplayName(user.displayName || '');
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: displayName,
        });
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update profile.' });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
      <h2 className="mb-6 text-2xl font-bold text-gray-900">Your Profile</h2>

      {message && (
        <div className={`p-3 mb-4 text-sm rounded-md ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={user.email || ''}
            disabled
            className="w-full px-3 py-2 mt-1 text-gray-500 bg-gray-100 border border-gray-300 rounded-md cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Display Name</label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <GameButton type="primary" disabled={loading} fullWidth>
          {loading ? 'Saving...' : 'Update Profile'}
        </GameButton>
      </form>
      
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Account Info</h3>
        <p className="mt-2 text-sm text-gray-600">
          User ID: <span className="font-mono text-xs">{user.uid}</span>
        </p>
      </div>
    </div>
  );
}
