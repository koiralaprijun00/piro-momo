'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  sendEmailVerification
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { FirebaseError } from 'firebase/app';
import GameButton from '@/components/ui/GameButton';
import { useRequest } from '@/lib/requestStatus';
import { Link } from '@/i18n/navigation';
import { FaGoogle, FaFacebook } from 'react-icons/fa';

interface AuthFormProps {
  locale: string;
  defaultMode?: 'signin' | 'signup';
}

export default function AuthForm({ locale, defaultMode = 'signin' }: AuthFormProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>(defaultMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  // idle → submitting → success (stays busy while the next page loads) | error
  const request = useRequest();
  const error = request.errorMessage;
  const loading = request.isSubmitting || request.isSuccess;
  const router = useRouter();

  // A message from the other tab (e.g. "Passwords do not match.") doesn't belong here.
  const switchMode = (next: 'signin' | 'signup') => {
    if (loading) return;
    setMode(next);
    request.reset();
  };

  /** Turns Firebase errors into a message the form can show. */
  const toFormError = (err: unknown) =>
    new Error(err instanceof FirebaseError ? getErrorMessage(err.code) : 'An unexpected error occurred.');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    void request.run(async () => {
      if (mode === 'signup' && password !== confirmPassword) {
        throw new Error('Passwords do not match.');
      }
      try {
        if (mode === 'signup') {
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          await updateProfile(userCredential.user, { displayName });
          await sendEmailVerification(userCredential.user);
          router.push(`/${locale}/auth/verify-email`);
        } else {
          await signInWithEmailAndPassword(auth, email, password);
          router.push(`/${locale}/profile`);
        }
      } catch (err) {
        throw toFormError(err);
      }
    });
  };

  const signInWith = (provider: GoogleAuthProvider | FacebookAuthProvider) => {
    if (loading) return;
    void request.run(async () => {
      try {
        await signInWithPopup(auth, provider);
        router.push(`/${locale}/profile`);
      } catch (err) {
        throw toFormError(err);
      }
    });
  };

  const handleGoogleSignIn = () => signInWith(new GoogleAuthProvider());
  const handleFacebookSignIn = () => signInWith(new FacebookAuthProvider());

  const getErrorMessage = (code: string) => {
    switch (code) {
      case 'auth/email-already-in-use':
        return 'Email already in use.';
      case 'auth/invalid-email':
        return 'Invalid email address.';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters.';
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return 'Invalid email or password.';
      case 'auth/popup-closed-by-user':
        return 'Sign-in popup was closed.';
      case 'auth/account-exists-with-different-credential':
        return 'An account already exists with the same email but different sign-in credentials.';
      default:
        return 'An error occurred. Please try again.';
    }
  };

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
      {/* Tab Headers */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => switchMode('signin')}
          className={`flex-1 py-3 text-sm font-medium transition-colors ${
            mode === 'signin'
              ? 'text-orange-600 border-b-2 border-orange-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Sign In
        </button>
        <button
          onClick={() => switchMode('signup')}
          className={`flex-1 py-3 text-sm font-medium transition-colors ${
            mode === 'signup'
              ? 'text-orange-600 border-b-2 border-orange-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Sign Up
        </button>
      </div>

      {error && (
        <div className="p-3 text-sm text-red-500 bg-red-100 rounded-md">
          {error}
        </div>
      )}

      {/* Social Login Buttons */}
      <div className="space-y-3">
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          <FaGoogle className="text-red-500" />
          <span className="text-sm font-medium text-gray-700">Continue with Google</span>
        </button>

        <button
          onClick={handleFacebookSignIn}
          disabled={loading}
          className="w-full flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          <FaFacebook className="text-blue-600" />
          <span className="text-sm font-medium text-gray-700">Continue with Facebook</span>
        </button>
      </div>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or continue with email</span>
        </div>
      </div>

      {/* Email/Password Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === 'signup' && (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Display Name
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {mode === 'signup' && (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        <GameButton
          type="primary"
          disabled={loading}
          fullWidth
        >
          {loading ? 'Processing...' : mode === 'signup' ? 'Sign Up' : 'Sign In'}
        </GameButton>
      </form>
      <p className="text-center text-xs text-gray-500">
        See our{' '}
        <Link href="/privacy" className="underline hover:text-gray-700">
          privacy policy
        </Link>{' '}
        for what we store and how to delete your account.
      </p>
    </div>
  );
}
