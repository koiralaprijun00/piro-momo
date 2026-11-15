import type { ReactNode } from 'react';
import { Link } from '@/i18n/navigation';
import ContentPage from '@/components/ContentPage';
import PageSeo from '@/components/PageSeo';
import { pageMetadata } from '@/lib/seo';

/**
 * Privacy policy for piromomo.com and the Piro Momo Android app.
 * Google Play links to this page, so keep it in step with what the code does:
 * if you add a new kind of data (analytics, ads in the app, a new form), add it here.
 */

export const generateMetadata = pageMetadata('/privacy');

const LAST_UPDATED = '16 November 2026';

const INTRO = {
  en: [
    'Piromomo makes free games and quizzes about Nepal, on piromomo.com and in the Piro Momo Android app. This page explains what information we collect, why, and how you can delete it.',
    `Last updated: ${LAST_UPDATED}.`,
  ],
  np: [
    'पिरोमोमोले piromomo.com र Piro Momo एन्ड्रोइड एपमा नेपालबारे निःशुल्क खेल र क्विज बनाउँछ। हामी कुन जानकारी किन राख्छौं र तपाईं त्यसलाई कसरी मेटाउन सक्नुहुन्छ भन्ने यो पृष्ठमा छ। (नीति तल अंग्रेजीमा छ।)',
    `अन्तिम अद्यावधिक: ${LAST_UPDATED}।`,
  ],
};

const TITLE = { en: 'Privacy Policy', np: 'गोपनीयता नीति' };

const SECTIONS: { heading: string; body: ReactNode }[] = [
  {
    heading: 'Playing without an account',
    body: (
      <p>
        You can play every game without signing up. Your scores, streaks and answers are then saved only on your own
        device (in your browser&apos;s storage, or in the app&apos;s storage on your phone). We do not receive them.
      </p>
    ),
  },
  {
    heading: 'If you create an account',
    body: (
      <>
        <p>
          Accounts are optional and are used to save your progress in the cloud. Sign-in is handled by Google Firebase
          Authentication. We receive your email address, and if you sign in with Google or Facebook, your name and
          profile photo from that account. We send a verification email to email accounts.
        </p>
        <p>
          Your game progress (scores, best streaks, badges and when you last played) is stored in Google Cloud
          Firestore, linked to your account, so it can follow you between devices.
        </p>
      </>
    ),
  },
  {
    heading: 'Things you send us',
    body: (
      <p>
        If you send feedback, submit a riddle or a &ldquo;Yo Ki Tyo&rdquo; question, or vote in &ldquo;Yo Ki
        Tyo&rdquo;, we store what you wrote (and the email address or name you choose to add) together with your IP
        address. The IP address is only used to stop spam and to count one vote per visitor. This data is stored in
        MongoDB Atlas.
      </p>
    ),
  },
  {
    heading: 'Advertising and cookies on the website',
    body: (
      <p>
        The website shows ads from Google AdSense. Google uses cookies to show and measure these ads, and in some
        regions to personalise them. You can manage this in your browser or at{' '}
        <a className="text-blue-700 underline" href="https://adssettings.google.com" rel="noopener noreferrer" target="_blank">
          Google Ad Settings
        </a>
        . See{' '}
        <a
          className="text-blue-700 underline"
          href="https://policies.google.com/technologies/partner-sites"
          rel="noopener noreferrer"
          target="_blank"
        >
          how Google uses information from sites that use its services
        </a>
        . The Android app shows no ads and does not use analytics.
      </p>
    ),
  },
  {
    heading: 'Hosting and logs',
    body: (
      <p>
        The website is hosted by Vercel, which keeps short-lived technical logs (such as IP address and browser type)
        to run and protect the service.
      </p>
    ),
  },
  {
    heading: 'Who we share data with',
    body: (
      <p>
        We do not sell your data. It is only processed by the services named above (Google Firebase and Cloud
        Firestore, Google AdSense on the website, MongoDB Atlas and Vercel) to run Piromomo. All connections use
        HTTPS.
      </p>
    ),
  },
  {
    heading: 'Children',
    body: (
      <p>
        Piromomo is made for a general audience and is not directed at children under 13. We do not knowingly collect
        personal information from children under 13. If you believe a child has created an account, contact us and we
        will delete it.
      </p>
    ),
  },
  {
    heading: 'Deleting your account and data',
    body: (
      <>
        <p>
          You can delete your account at any time. In the Android app, open Profile and tap &ldquo;Delete
          account&rdquo;. On the website, use the{' '}
          <Link className="text-blue-700 underline" href="/delete-account">
            delete account page
          </Link>
          . This permanently deletes your account and the progress saved in the cloud. Progress saved only on your
          device stays there until you clear the app&apos;s data or your browser storage.
        </p>
        <p>
          To delete something you sent us (feedback or a submission), contact us and tell us what to remove.
        </p>
      </>
    ),
  },
  {
    heading: 'Contact',
    body: (
      <p>
        Use the feedback button on any page of piromomo.com, or message us on{' '}
        <a className="text-blue-700 underline" href="https://www.instagram.com/kastopiromomo/" rel="noopener noreferrer" target="_blank">
          Instagram
        </a>{' '}
        or{' '}
        <a className="text-blue-700 underline" href="https://x.com/kastopiromomo" rel="noopener noreferrer" target="_blank">
          X
        </a>
        .
      </p>
    ),
  },
  {
    heading: 'Changes',
    body: <p>If this policy changes, we will update this page and the date at the top.</p>,
  },
];

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params;
  const locale = localeParam === 'np' ? 'np' : 'en';

  return (
    <>
    <ContentPage title={TITLE[locale]} intro={INTRO[locale]}>
      <div className="space-y-4">
        {SECTIONS.map((section) => (
          <section key={section.heading} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="mb-2 text-xl font-bold text-gray-900">{section.heading}</h2>
            <div className="space-y-3 leading-relaxed text-gray-700">{section.body}</div>
          </section>
        ))}
      </div>
    </ContentPage>
    <PageSeo path="/privacy" locale={locale} isGame={false} />
    </>
  );
}
