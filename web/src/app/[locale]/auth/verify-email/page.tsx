'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { sendEmailVerification, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { FaEnvelope, FaPaperPlane, FaSignOutAlt, FaRedo } from 'react-icons/fa';

export default function VerifyEmailPage({ params }: { params: Promise<{ locale: string }> }) {
  const { user, loading } = useAuth();
  const [resendStatus, setResendStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const router = useRouter();
  const [locale, setLocale] = useState('en');

  useEffect(() => {
    params.then(p => setLocale(p.locale));
  }, [params]);

  useEffect(() => {
    // If not loading and no user, redirect to signin
    if (!loading && !user) {
      router.push(`/${locale}/auth/signin`);
      return;
    }

    // If user is already verified, redirect to profile
    if (!loading && user?.emailVerified) {
      router.push(`/${locale}/profile`);
    }
  }, [user, loading, router, locale]);

  const handleResendEmail = async () => {
    if (!user) return;
    setResendStatus('sending');
    try {
      await sendEmailVerification(user);
      setResendStatus('sent');
      setTimeout(() => setResendStatus('idle'), 5000); // Reset after 5s
    } catch (error: any) {
      console.error("Error sending verification email", error);
      setResendStatus('error');
      // Firebase throws error if too many requests
      if (error.code === 'auth/too-many-requests') {
        setErrorMsg('Too many requests. Please wait a moment.');
      } else {
        setErrorMsg('Failed to send email. Try again later.');
      }
    }
  };

  const checkVerification = async () => {
    if (user) {
      await user.reload();
      if (user.emailVerified) {
        window.location.reload(); // Force full reload to update all context
      } else {
         // Maybe show a toast or message saying "Not yet verified"
         alert("Not verified yet. Check your email!");
      }
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
    router.push(`/${locale}/auth/signin`);
  };

  if (loading || !user) {
     return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
     )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-orange-100 mb-6">
            <FaEnvelope className="h-8 w-8 text-orange-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Check your email</h2>
          <p className="text-gray-600 mb-6">
            We sent a verification link to <strong>{user.email}</strong>. 
            Please check your inbox and click the link to confirm your account.
          </p>

          <div className="space-y-4">
            <button
              onClick={checkVerification}
              className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              <FaRedo className="mr-2" />
              I&apos;ve Verified My Email
            </button>

            <button
               onClick={handleResendEmail}
               disabled={resendStatus === 'sending' || resendStatus === 'sent'}
               className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
            >
               {resendStatus === 'sending' ? (
                   <span className="flex items-center">Sending...</span>
               ) : resendStatus === 'sent' ? (
                   <span className="flex items-center text-green-600">Email Sent!</span>
               ) : (
                   <span className="flex items-center"><FaPaperPlane className="mr-2"/> Resend Verification Email</span>
               )}
            </button>
            
            {resendStatus === 'error' && (
                <p className="text-sm text-red-600 mt-2">{errorMsg}</p>
            )}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
             <button
                onClick={handleSignOut}
                className="text-sm text-gray-500 hover:text-gray-700 flex items-center justify-center w-full"
             >
                <FaSignOutAlt className="mr-2" /> Sign Out
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
