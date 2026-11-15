import type { ReactNode } from 'react';
import { Link } from '@/i18n/navigation';

/**
 * Layout for the server-rendered content pages (lists of riddles, GK questions,
 * districts). Everything here is in the page's raw HTML, so search engines can
 * read it without running JavaScript.
 */
export default function ContentPage({
  title,
  intro,
  cta,
  children,
}: {
  title: string;
  intro: string[];
  /** Button that sends readers to the matching game. */
  cta: { href: string; label: string };
  children: ReactNode;
}) {
  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{title}</h1>
      {intro.map((text) => (
        <p key={text.slice(0, 24)} className="text-lg text-gray-700 leading-relaxed mb-3">
          {text}
        </p>
      ))}
      <Link
        href={cta.href}
        className="inline-block mt-2 mb-8 rounded-full bg-gradient-to-r from-blue-600 to-red-500 px-5 py-2 font-semibold text-white hover:opacity-90"
      >
        {cta.label}
      </Link>
      {children}
    </main>
  );
}
