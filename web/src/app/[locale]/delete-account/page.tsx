'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import {
  deleteUser,
  EmailAuthProvider,
  FacebookAuthProvider,
  GoogleAuthProvider,
  reauthenticateWithCredential,
  reauthenticateWithPopup,
  type User,
} from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { collection, deleteDoc, doc, getDoc, getDocs, writeBatch } from 'firebase/firestore';
import { Link } from '@/i18n/navigation';
import { useAuth } from '@/context/AuthContext';
import { auth, db } from '@/lib/firebase';
import { useRequest } from '@/lib/requestStatus';
import { allGameStorageKeys, clearSaved } from '@/lib/storage';
import ContentPage from '@/components/ContentPage';

/**
 * Account deletion, required by Google Play for apps that let people sign up.
 * Anyone can read how it works; a signed-in user can delete their account here.
 *
 *   signed out ──sign in──▶ ready ──delete──▶ deleting ──▶ done
 *                                                └──▶ error (e.g. wrong password) ──▶ ready
 */

const COPY = {
  en: {
    title: 'Delete your Piromomo account',
    intro: [
      'You can delete your Piromomo account at any time. This permanently deletes the account and the game progress saved for it in the cloud (scores, streaks and badges), for both the website and the Piro Momo Android app.',
      'In the Android app: open Profile and tap “Delete account”. On the website: sign in and use the button below.',
    ],
    signedOut: 'Sign in to the account you want to delete, then come back to this page.',
    signIn: 'Sign in',
    signedInAs: 'Signed in as',
    confirm: 'I understand that my account and saved progress will be permanently deleted.',
    password: 'Your password',
    button: 'Delete my account',
    deleting: 'Deleting…',
    done: 'Your account has been deleted. Thank you for playing Piromomo.',
    other:
      'To delete something you sent us (feedback, a riddle or a question), or if you cannot sign in, contact us as described in the',
    privacy: 'privacy policy',
    loading: 'Checking your sign-in…',
  },
  np: {
    title: 'पिरोमोमो खाता मेटाउनुहोस्',
    intro: [
      'तपाईं जुनसुकै बेला आफ्नो पिरोमोमो खाता मेटाउन सक्नुहुन्छ। यसले खाता र क्लाउडमा राखिएको खेलको प्रगति (स्कोर, स्ट्रिक, ब्याज) वेबसाइट र Piro Momo एन्ड्रोइड एप दुवैबाट स्थायी रूपमा मेटाउँछ।',
      'एन्ड्रोइड एपमा: Profile खोलेर “Delete account” थिच्नुहोस्। वेबसाइटमा: साइन इन गरेर तलको बटन थिच्नुहोस्।',
    ],
    signedOut: 'मेटाउन चाहेको खातामा साइन इन गर्नुहोस्, अनि यो पृष्ठमा फर्कनुहोस्।',
    signIn: 'साइन इन',
    signedInAs: 'साइन इन गरिएको खाता',
    confirm: 'मेरो खाता र सुरक्षित प्रगति स्थायी रूपमा मेटिन्छ भन्ने मैले बुझेँ।',
    password: 'तपाईंको पासवर्ड',
    button: 'मेरो खाता मेटाउनुहोस्',
    deleting: 'मेटाउँदै…',
    done: 'तपाईंको खाता मेटियो। पिरोमोमो खेल्नुभएकोमा धन्यवाद।',
    other: 'हामीलाई पठाएको कुरा (प्रतिक्रिया, गाउँखाने कथा वा प्रश्न) मेटाउन, वा साइन इन गर्न नसके, यहाँ भनिएझैं सम्पर्क गर्नुहोस्:',
    privacy: 'गोपनीयता नीति',
    loading: 'साइन इन जाँच्दै…',
  },
} as const;

const usesPassword = (user: User) => user.providerData.some((p) => p.providerId === 'password');

function messageFor(error: unknown): string {
  if (error instanceof FirebaseError) {
    switch (error.code) {
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return 'Incorrect password. Please try again.';
      case 'auth/popup-closed-by-user':
      case 'auth/cancelled-popup-request':
        return 'Sign-in was cancelled, so the account was not deleted.';
      case 'auth/requires-recent-login':
        return 'For your security, please sign out, sign in again, and then delete your account.';
      case 'permission-denied':
        return 'Your saved progress could not be deleted. Please contact us so we can delete it for you.';
    }
  }
  return error instanceof Error && error.message ? error.message : 'Something went wrong. Please try again.';
}

/** Firebase only deletes accounts that signed in recently, so sign in again first. */
async function reauthenticate(user: User, password: string) {
  if (usesPassword(user)) {
    if (!user.email || !password) throw new Error('Enter your password to delete your account.');
    await reauthenticateWithCredential(user, EmailAuthProvider.credential(user.email, password));
    return;
  }
  const providerId = user.providerData[0]?.providerId;
  if (providerId === 'google.com') await reauthenticateWithPopup(user, new GoogleAuthProvider());
  else if (providerId === 'facebook.com') await reauthenticateWithPopup(user, new FacebookAuthProvider());
}

/** Deletes the cloud progress saved by the website (user_stats) and by the app (users/{uid}). */
async function deleteCloudData(uid: string) {
  const progress = await getDocs(collection(db, 'users', uid, 'progress'));
  const batch = writeBatch(db);
  progress.forEach((entry) => batch.delete(entry.ref));
  batch.delete(doc(db, 'users', uid));
  await batch.commit();

  const webStats = doc(db, 'user_stats', uid);
  if ((await getDoc(webStats)).exists()) await deleteDoc(webStats);
}

export default function DeleteAccountPage() {
  const locale = useLocale() === 'np' ? 'np' : 'en';
  const t = COPY[locale];
  const { user, status } = useAuth();
  const [confirmed, setConfirmed] = useState(false);
  const [password, setPassword] = useState('');
  const request = useRequest();

  const handleDelete = () => {
    const current = auth.currentUser;
    if (!current || !confirmed || request.isSubmitting) return;
    void request.run(async () => {
      try {
        await reauthenticate(current, password);
        await deleteCloudData(current.uid);
        await deleteUser(current);
        // Progress saved in this browser belonged to the deleted account.
        allGameStorageKeys().forEach(clearSaved);
      } catch (error) {
        throw new Error(messageFor(error));
      }
    });
  };

  return (
    <ContentPage title={t.title} intro={[...t.intro]}>
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8">
        {request.isSuccess ? (
          <p className="rounded-lg bg-green-50 p-4 font-medium text-green-800" role="status">
            {t.done}
          </p>
        ) : status === 'loading' ? (
          <p className="text-gray-600">{t.loading}</p>
        ) : !user ? (
          <div className="space-y-4">
            <p className="text-gray-700">{t.signedOut}</p>
            <Link
              href="/auth/signin"
              className="inline-block rounded-full bg-gradient-to-r from-blue-600 to-red-500 px-6 py-2.5 font-semibold text-white shadow-md hover:opacity-90"
            >
              {t.signIn}
            </Link>
          </div>
        ) : (
          <form
            className="space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              handleDelete();
            }}
          >
            <p className="text-gray-700">
              {t.signedInAs} <strong>{user.email ?? user.displayName}</strong>
            </p>
            {usesPassword(user) && (
              <label className="block">
                <span className="text-sm font-medium text-gray-700">{t.password}</span>
                <input
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </label>
            )}
            <label className="flex items-start gap-3 text-gray-700">
              <input
                type="checkbox"
                className="mt-1 h-4 w-4"
                checked={confirmed}
                onChange={(event) => setConfirmed(event.target.checked)}
              />
              <span>{t.confirm}</span>
            </label>
            {request.errorMessage && (
              <p className="rounded-md bg-red-50 p-3 text-sm text-red-700" role="alert">
                {request.errorMessage}
              </p>
            )}
            <button
              type="submit"
              disabled={!confirmed || request.isSubmitting}
              className="rounded-full bg-red-600 px-6 py-2.5 font-semibold text-white shadow-md transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {request.isSubmitting ? t.deleting : t.button}
            </button>
          </form>
        )}
        <p className="mt-6 border-t border-gray-100 pt-4 text-sm text-gray-500">
          {t.other}{' '}
          <Link href="/privacy" className="text-blue-700 underline">
            {t.privacy}
          </Link>
          .
        </p>
      </div>
    </ContentPage>
  );
}
