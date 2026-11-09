'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';

/**
 * Sign-in state as one value instead of `user` + `loading` combinations:
 *
 *   loading ──▶ signedOut
 *          └──▶ unverified (email not verified yet) ──verify──▶ verified
 *
 * Accounts from Google/Facebook come back from Firebase already verified.
 */
export type AuthStatus = 'loading' | 'signedOut' | 'unverified' | 'verified';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  status: AuthStatus;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  status: 'loading',
});

export const useAuth = () => useContext(AuthContext);

export function authStatusFor(user: User | null, loading: boolean): AuthStatus {
  if (loading) return 'loading';
  if (!user) return 'signedOut';
  return user.emailVerified ? 'verified' : 'unverified';
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, status: authStatusFor(user, loading) }}>
      {children}
    </AuthContext.Provider>
  );
};
