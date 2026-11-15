import { riddlesData } from '@/app/data/gau-khane-katha/gau-khane-katha-data';
import type { Riddle } from '@/app/data/gau-khane-katha/gau-khane-katha-type';
import type { SiteLocale } from './site';

/** Riddles shown per page of the "with answers" list. */
export const RIDDLES_PER_PAGE = 100;

/** The locale's riddles in their stored order, without repeated questions. */
export function listRiddles(locale: SiteLocale): Riddle[] {
  const seen = new Set<string>();
  return (riddlesData[locale] ?? []).filter((riddle) => {
    const key = riddle.question.trim();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function riddlePageCount(locale: SiteLocale): number {
  return Math.max(1, Math.ceil(listRiddles(locale).length / RIDDLES_PER_PAGE));
}

/** Riddles for page `page` (1-based), or null if that page doesn't exist. */
export function riddlesOnPage(locale: SiteLocale, page: number) {
  const all = listRiddles(locale);
  const pages = riddlePageCount(locale);
  if (!Number.isInteger(page) || page < 1 || page > pages) return null;
  const start = (page - 1) * RIDDLES_PER_PAGE;
  return { riddles: all.slice(start, start + RIDDLES_PER_PAGE), start, total: all.length, pages };
}

/** URL path of a page: page 1 is the base URL, later pages add "/2", "/3"… */
export const riddlePagePath = (page: number) =>
  page <= 1 ? '/gau-khane-katha-with-answers' : `/gau-khane-katha-with-answers/${page}`;
