'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Dynamically import non-critical components
const FeedbackButton = dynamic(() => import('../components/FeedbackButton'), {
  ssr: false,
});

// Centralized card data
const cards = [
  {
    href: '/spend',
    gradient: 'from-purple-600 to-pink-500', // Adjusted gradient for a softer look
    image: '/spend-money.png',
    titleKey: 'spendBinodTitle',
    descKey: 'spendBinodDescription',
    priority: true,
    focusRing: 'purple',
  },
  {
    href: '/guess-festival',
    gradient: 'from-red-500 to-amber-400', // Adjusted gradient
    image: '/guess-the-festival.png',
    titleKey: 'games.guessFestival.title',
    descKey: 'games.guessFestival.description',
    loading: 'lazy',
    focusRing: 'orange',
  },
  {
    href: '/kings-of-nepal',
    gradient: 'from-teal-600 to-blue-500', // Adjusted gradient
    image: '/kings-of-nepal.png',
    titleKey: 'kingsOfNepal.title',
    descKey: 'kingsOfNepal.description',
    loading: 'lazy',
    focusRing: 'blue',
  },
  {
    href: '/name-districts',
    gradient: 'from-cyan-600 to-emerald-500', // Adjusted gradient
    image: '/guess-district.png',
    titleKey: 'nameDistrictTitleHomePage',
    descKey: 'nameDistrictDescription',
    loading: 'lazy',
    focusRing: 'blue',
  },
  {
    href: '/gau-khane-katha',
    gradient: 'from-lime-600 to-cyan-500', // Adjusted gradient
    image: '/gau-khane-katha.png',
    titleKey: 'RiddlesGame.title',
    descKey: 'RiddlesGame.subtitle',
    loading: 'lazy',
    focusRing: 'green',
  },
  {
    href: '/general-knowledge',
    gradient: 'from-indigo-600 to-lime-500', // Adjusted gradient
    image: '/gk-nepal.png',
    titleKey: 'nepalGk.titleshort',
    descKey: 'nepalGk.shortdescription',
    loading: 'lazy',
    focusRing: 'blue',
  },
  {
    href: '/chineu-ta',
    gradient: 'from-purple-600 to-pink-500', // Adjusted gradient
    image: '/logo-chineu.png',
    titleKey: 'logoQuiz.title',
    descKey: 'logoQuiz.subtitle',
    loading: 'lazy',
    focusRing: 'purple',
  },
  {
    href: '/first-of-nepal',
    gradient: 'from-amber-600 to-violet-500', // Adjusted gradient
    image: '/first-of-nepal.png',
    titleKey: 'firstofNepalTitle',
    descKey: 'firstofNepalShortSubtitle',
    loading: 'lazy',
    focusRing: 'orange',
  },
  {
    href: '/yo-ki-tyo',
    gradient: 'from-purple-600 to-pink-500', // Adjusted gradient
    image: '/yo-ki-tyo.png',
    titleKey: 'wouldYouRather.title',
    descKey: 'wouldYouRather.shortDescription',
    loading: 'lazy',
    focusRing: 'purple',
  },
];

// Add type for Card props
interface CardProps {
  data: (typeof cards)[0]; // Use typeof cards[0] for better type inference
  t: any;
}

function Card({ data, t }: CardProps) {
  const { href, gradient, image, titleKey, descKey, priority, loading = 'lazy', focusRing } = data;
  return (
    <Link
      href={href}
      className={`block transform transition-all duration-300 hover:scale-[1.03] focus:outline-none focus:ring-4 focus:ring-${focusRing}-400 rounded-xl group`}
    >
      <div
        className={`relative p-6 sm:p-8 bg-gradient-to-br ${gradient} rounded-xl shadow-lg overflow-hidden transition-all duration-300 group-hover:shadow-2xl group-hover:brightness-110`}
      >
        {/* Background elements for visual flair */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
        
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-white rounded-full mix-blend-overlay transform translate-x-1/2 translate-y-1/2"></div>
        </div>

        <div className="flex items-start relative z-10">
          <div className="w-16 h-16 sm:w-20 sm:h-20 flex flex-shrink-0 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm shadow-md mr-2 p-2">
            {' '}
            {/* Adjusted size and added blur */}
            <Image
              src={image}
              alt={t(titleKey)}
              width={64}
              height={64}
              priority={!!priority}
              loading={priority ? undefined : (loading as 'lazy' | 'eager')}
              className="object-contain" // Use object-contain to ensure image fits without cropping
            />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white leading-tight drop-shadow-md">
              {t(titleKey)}
            </h2>
            <p className="mt-1 text-white text-opacity-90 text-sm sm:text-base">
              {t(descKey)}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function HomePage() {
  const t = useTranslations('Translations');

  const language = useLocale();

  return (
    <main className="bg-gray-50 dark:bg-gray-900 overflow-visible relative">

      <div className="relative z-10 container mx-auto flex flex-col items-center justify-start py-8 px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="w-full text-center overflow-visible mb-4 md:mb-6">
          <h1
      className={`
      relative inline-block overflow-visible bg-gradient-to-r
      from-purple-500 to-pink-500 bg-clip-text text-transparent leading-tight mb-1
      ${
        language === 'np'
          ? 'font-rozha text-7xl md:text-8xl'
          : 'font-capso text-6xl md:text-7xl'
      }
    `}
          >
            {t('piromomo')}
          </h1>
          <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto mt-0">
            {t('homePageTagline')}
          </p>
        </div>

        {/* Fun Card Section */}
        <div className="w-full mb-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 max-w-7xl">
          {cards.map((card, idx) => (
            <Card key={idx} data={card} t={t} />
          ))}
        </div>
      </div>

      {/* Lazy load Feedback Button */}
      <Suspense fallback={null}>
        <FeedbackButton />
      </Suspense>
    </main>
  );
}