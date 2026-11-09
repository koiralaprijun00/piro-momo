'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedRoute({ children, locale }: { children: React.ReactNode, locale: string }) {
  const { status } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (status === 'signedOut') {
      router.push(`/${locale}/auth/signin`);
    } else if (status === 'unverified') {
      router.push(`/${locale}/auth/verify-email`);
    }
  }, [status, router, locale]);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-b-2 border-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Only verified users see protected content (no flash before the redirect).
  if (status !== 'verified') {
    return null;
  }

  return <>{children}</>;
}
