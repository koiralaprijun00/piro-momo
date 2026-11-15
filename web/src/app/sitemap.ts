import type { MetadataRoute } from 'next';
import { HTML_LANG, LOCALES, PUBLIC_PATHS, SITE_URL } from '@/lib/site';
import { riddlePageCount, riddlePagePath } from '@/lib/riddleList';

/**
 * Served at /sitemap.xml. Lists every public page in both languages, with hreflang
 * links so search engines know /en/x and /np/x are translations of each other.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  // Pages 2, 3… of the riddle list. Each language has its own riddles and page count,
  // so these have no language alternates.
  const riddlePages = LOCALES.flatMap((locale) =>
    Array.from({ length: riddlePageCount(locale) - 1 }, (_, i) => ({
      url: `${SITE_URL}/${locale}${riddlePagePath(i + 2)}`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    }))
  );

  const pages = PUBLIC_PATHS.flatMap(({ path, priority }) =>
    LOCALES.map((locale) => ({
      url: `${SITE_URL}/${locale}${path}`,
      lastModified,
      changeFrequency: 'weekly' as const,
      priority: locale === 'en' ? priority : Math.max(0.1, priority - 0.1),
      alternates: {
        languages: Object.fromEntries(LOCALES.map((l) => [HTML_LANG[l], `${SITE_URL}/${l}${path}`])),
      },
    }))
  );

  return [...pages, ...riddlePages];
}
