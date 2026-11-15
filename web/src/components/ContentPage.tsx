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
  cta?: { href: string; label: string };
  children: ReactNode;
}) {
  return (
    <main className="max-w-4xl mx-auto w-full px-4 py-8 sm:py-12">
      {/* Same gradient card header as the game pages. */}
      <header className="bg-gradient-to-br from-blue-600 to-red-500 p-1 rounded-xl shadow-lg mb-8">
        <div className="px-4 py-6 sm:px-6 sm:py-8 text-white">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">{title}</h1>
        </div>
        <div className="bg-white rounded-b-lg p-5 sm:p-8">
          <div className="space-y-3 text-base sm:text-lg leading-relaxed text-gray-600">
            {intro.map((text) => (
              <p key={text.slice(0, 24)}>{text}</p>
            ))}
          </div>
          {cta && (
            <Link
              href={cta.href}
              className="inline-block mt-5 rounded-full bg-gradient-to-r from-blue-600 to-red-500 px-6 py-2.5 font-semibold text-white shadow-md transition hover:opacity-90 hover:shadow-lg"
            >
              {cta.label} →
            </Link>
          )}
        </div>
      </header>
      {children}
    </main>
  );
}
