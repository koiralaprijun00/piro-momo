/**
 * Public URLs of the site. The sitemap is generated from this list, so when you add
 * a page, add its path here and it shows up in search engines.
 */

/** Canonical domain (no www), matching metadataBase and robots.txt. */
export const SITE_URL = 'https://piromomo.com';

export const LOCALES = ['en', 'np'] as const;
export type SiteLocale = (typeof LOCALES)[number];

/** BCP-47 language for <html lang> and hreflang. 'np' is our URL prefix; Nepali's code is 'ne'. */
export const HTML_LANG: Record<SiteLocale, string> = { en: 'en', np: 'ne' };

/** Every public page, without the locale prefix. '' is the home page. */
export const PUBLIC_PATHS: { path: string; priority: number }[] = [
  { path: '', priority: 1.0 },
  { path: '/guess-festival', priority: 0.9 },
  { path: '/gau-khane-katha', priority: 0.9 },
  { path: '/general-knowledge', priority: 0.9 },
  { path: '/kings-of-nepal', priority: 0.9 },
  { path: '/name-districts', priority: 0.9 },
  { path: '/mandir-chineu', priority: 0.9 },
  { path: '/chineu-ta', priority: 0.9 },
  { path: '/yo-ki-tyo', priority: 0.9 },
  { path: '/guess-the-word', priority: 0.9 },
  { path: '/first-of-nepal', priority: 0.9 },
  { path: '/life-checklist', priority: 0.9 },
  { path: '/spend', priority: 0.9 },
  { path: '/date-converter', priority: 0.8 },
  { path: '/kings-of-nepal/about', priority: 0.7 },
  { path: '/about', priority: 0.6 },
  { path: '/about-binod', priority: 0.6 },
];
