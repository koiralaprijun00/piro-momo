'use client'

import Link from "next/link";
import Image from "next/image";
import { useTranslations, useLocale } from 'next-intl';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import AdSense from "../components/AdSenseGoogle";

// Dynamically import non-critical components
const FeedbackButton = dynamic(() => import("../components/FeedbackButton"), {
  ssr: false
});

// Centralized card data
const cards = [
  {
    href: '/spend',
    gradient: 'from-purple-700 to-pink-700',
    badge: { icon: '💰', key: 'billionaireBadge', color: 'purple' },
    image: '/spend-money.png',
    titleKey: 'spendBinodTitle',
    descKey: 'spendBinodDescription',
    priority: true,
    focusRing: 'purple',
  },
  {
    href: '/guess-festival',
    gradient: 'from-red-700 to-amber-600',
    badge: { icon: '✨', key: 'quizBadge', color: 'orange' },
    image: '/guess-the-festival.png',
    titleKey: 'games.guessFestival.title',
    descKey: 'games.guessFestival.description',
    loading: 'lazy',
    focusRing: 'orange',
  },
  {
    href: '/kings-of-nepal',
    gradient: 'from-teal-700 to-blue-500',
    badge: { icon: '👑', key: 'kingsOfNepal.badge', color: 'blue' },
    image: '/kings-of-nepal.png',
    titleKey: 'kingsOfNepal.title',
    descKey: 'kingsOfNepal.description',
    loading: 'lazy',
    focusRing: 'blue',
  },
  {
    href: '/name-districts',
    gradient: 'from-cyan-700 to-emerald-500',
    badge: { icon: '🗺️', key: 'geography', color: 'blue' },
    image: '/guess-district.png',
    titleKey: 'nameDistrictTitle',
    descKey: 'nameDistrictDescription',
    loading: 'lazy',
    focusRing: 'blue',
  },
  {
    href: '/gau-khane-katha',
    gradient: 'from-lime-700 to-cyan-500',
    badge: { icon: '🔍', key: 'RiddlesGame.badgeTitle', color: 'green' },
    image: '/gau-khane-katha.png',
    titleKey: 'RiddlesGame.title',
    descKey: 'RiddlesGame.subtitle',
    loading: 'lazy',
    focusRing: 'green',
  },
  {
    href: '/general-knowledge',
    gradient: 'from-indigo-700 to-lime-600',
    badge: { icon: '🧠', key: 'quizBadge', color: 'blue' },
    image: '/gk-nepal.png',
    titleKey: 'nepalGk.titleshort',
    descKey: 'nepalGk.shortdescription',
    loading: 'lazy',
    focusRing: 'blue',
  },
  {
    href: '/chineu-ta',
    gradient: 'from-purple-700 to-pink-500',
    badge: { icon: '🎨', key: 'logoQuiz.badge', color: 'purple' },
    image: '/logo-chineu.png',
    titleKey: 'logoQuiz.title',
    descKey: 'logoQuiz.subtitle',
    loading: 'lazy',
    focusRing: 'purple',
  },
  {
    href: '/first-of-nepal',
    gradient: 'from-amber-700 to-violet-500',
    badge: { icon: '✨', key: 'firstofNepalBadge', color: 'orange' },
    image: '/first-of-nepal.png',
    titleKey: 'firstofNepalTitle',
    descKey: 'firstofNepalShortSubtitle',
    loading: 'lazy',
    focusRing: 'orange',
  },
  {
    href: '/yo-ki-tyo',
    gradient: 'from-purple-700 to-pink-500',
    badge: { icon: '🤔', key: 'wouldYouRather.badge', color: 'purple' },
    image: '/yo-ki-tyo.png',
    titleKey: 'wouldYouRather.title',
    descKey: 'wouldYouRather.shortDescription',
    loading: 'lazy',
    focusRing: 'purple',
  },
];

// Add type for Card props
interface CardProps {
  data: any;
  t: any;
}

function Card({ data, t }: CardProps) {
  const { href, gradient, badge, image, titleKey, descKey, priority, loading = 'lazy', focusRing } = data;
  return (
    <Link href={href} className={`block transform transition hover:scale-105 focus:outline-none focus:ring-4 focus:ring-${focusRing}-300 rounded-3xl`}>
      <div className={`relative px-6 py-12 bg-gradient-to-br ${gradient} rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl`}>
        <div className={`absolute top-3 right-3 bg-white text-${badge.color}-600 font-bold text-xs py-1 px-3 rounded-full shadow-md flex items-center gap-1`}>
          <span>{badge.icon}</span>
          <span>{t(badge.key)}</span>
        </div>
        <div className="flex items-center relative z-10">
          <div className="w-20 h-20 flex items-center justify-center rounded-full bg-white shadow-md mr-4">
            <Image
              src={image}
              alt={t(titleKey)}
              width={64}
              height={64}
              priority={!!priority}
              loading={priority ? undefined : loading}
              className="object-cover"
            />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white drop-shadow-sm">{t(titleKey)}</h2>
            <p className="mt-1 text-white text-opacity-90">{t(descKey)}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function HomePage() {
  const t = useTranslations("Translations"); 

  // Check current language (assuming 'ne' for Nepali and 'en' for English)
  const language = useLocale();

  return (
    <main className="min-h-screen">
      <div className="relative z-10 container mx-auto flex flex-col items-start justify-between px-4">
        {/* Header Section - Simplified animation for better performance */}
        <div className="py-4 w-full">
        <h1
  className={`nepali-text-title relative inline font-extrabold text-left bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent ${
    language === 'np' 
      ? "font-rozha text-4xl md:text-7xl" 
      : "font-capso text-3xl md:text-6xl"
  }`}
>
  {t('piromomo')}
</h1>
        </div>

        {/* Fun Card Section - Prioritize content and add loading strategy */}
        <div className="w-full mb-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl">
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