import { questionsEn } from '@/app/data/general-knowledge/data-gk.en';
import { questionsNp } from '@/app/data/general-knowledge/data-gk.np';
import type { Question } from '@/app/data/general-knowledge/question';
import type { SiteLocale } from './site';

/**
 * Groups the GK quiz questions into a handful of readable sections for the
 * "questions and answers" page. The quiz data has 40+ category labels
 * (e.g. "History & Media"); each label goes to the section of its first word.
 */
export interface GkSection {
  id: string;
  en: string;
  np: string;
  questions: Question[];
}

const SECTIONS: { id: string; en: string; np: string; match: string[] }[] = [
  { id: 'geography', en: 'Geography', np: 'भूगोल', match: ['Geography'] },
  { id: 'history', en: 'History', np: 'इतिहास', match: ['History'] },
  { id: 'politics', en: 'Politics and Constitution', np: 'राजनीति र संविधान', match: ['Politics', 'Language'] },
  { id: 'culture', en: 'Culture and Food', np: 'संस्कृति र खानपान', match: ['Culture', 'Food', 'Demography', 'Architecture'] },
  { id: 'jatra', en: 'Jatras of the Kathmandu Valley', np: 'काठमाडौं उपत्यकाका जात्रा', match: ['Jatra of Kathmandu Valley'] },
  { id: 'religion', en: 'Religion, Mythology and Philosophy', np: 'धर्म, पौराणिक कथा र दर्शन', match: ['Religion', 'Mythology', 'Philosophy'] },
  { id: 'sports', en: 'Sports', np: 'खेलकुद', match: ['Sports'] },
  { id: 'science', en: 'Science, Nature and Environment', np: 'विज्ञान, प्रकृति र वातावरण', match: ['Science', 'Conservation', 'Environment', 'Agriculture'] },
  { id: 'literature', en: 'Literature and Education', np: 'साहित्य र शिक्षा', match: ['Literature', 'Education'] },
  { id: 'economy', en: 'Economy and Infrastructure', np: 'अर्थतन्त्र र पूर्वाधार', match: ['Economy', 'Infrastructure', 'Transportation'] },
  { id: 'international', en: 'Nepal and the World', np: 'नेपाल र विश्व', match: ['International'] },
  { id: 'entertainment', en: 'Entertainment, Music and Media', np: 'मनोरञ्जन, संगीत र सञ्चार', match: ['Entertainment', 'Music', 'Media'] },
];

function sectionFor(category: string): string {
  if (category === 'Jatra of Kathmandu Valley') return 'jatra';
  if (category === 'Religion & Mythology') return 'religion';
  const first = category.split('&')[0].trim();
  const match = SECTIONS.find((s) => s.match.some((m) => first.startsWith(m)));
  return match?.id ?? 'culture';
}

export function gkSections(locale: SiteLocale): GkSection[] {
  const all = locale === 'np' ? questionsNp : questionsEn;
  const seen = new Set<string>();
  // Skip repeated questions and any whose answer isn't among its options.
  const usable = all.filter((q) => {
    const key = q.question.trim();
    if (seen.has(key) || !q.options.includes(q.correctAnswer)) return false;
    seen.add(key);
    return true;
  });
  return SECTIONS.map((s) => ({
    id: s.id,
    en: s.en,
    np: s.np,
    questions: usable.filter((q) => sectionFor(q.category) === s.id),
  })).filter((s) => s.questions.length > 0);
}
