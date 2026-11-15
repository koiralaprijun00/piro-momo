import ContentPage from '@/components/ContentPage';
import PageSeo from '@/components/PageSeo';
import { gkSections } from '@/lib/gkList';
import { pageMetadata } from '@/lib/seo';
import type { SiteLocale } from '@/lib/site';

// Server-rendered list of the GK quiz questions with their answers, grouped by topic.

export const generateMetadata = pageMetadata('/nepal-gk-questions');

const nepaliDigits = (n: number) => String(n).replace(/\d/g, (d) => '०१२३४५६७८९'[Number(d)]);
const LETTERS = { en: ['A', 'B', 'C', 'D', 'E'], np: ['क', 'ख', 'ग', 'घ', 'ङ'] };

const COPY = {
  en: {
    title: 'Nepal GK Questions and Answers',
    intro: (n: number) => [
      `This page lists ${n} general knowledge questions about Nepal with their answers, grouped by topic. Each question has four options, and the correct one is shown under it.`,
      'Useful for Loksewa and school GK practice. To test yourself without seeing the answers, play the quiz version.',
    ],
    cta: 'Play the Nepal GK quiz',
    contents: 'Topics',
    answer: 'Answer',
  },
  np: {
    title: 'नेपाल सामान्य ज्ञान प्रश्नोत्तर',
    intro: (n: number) => [
      `यस पृष्ठमा नेपालसम्बन्धी ${nepaliDigits(n)} सामान्य ज्ञान प्रश्न उत्तरसहित विषय अनुसार छन्। हरेक प्रश्नमा चार विकल्प छन्, र सही उत्तर तल देखाइएको छ।`,
      'लोकसेवा र विद्यालयको सामान्य ज्ञान अभ्यासका लागि उपयोगी। उत्तर नहेरी आफैं जाँच्न क्विज खेल्नुहोस्।',
    ],
    cta: 'नेपाल सामान्य ज्ञान क्विज खेल्नुहोस्',
    contents: 'विषयहरू',
    answer: 'उत्तर',
  },
} as const;

export default async function NepalGkQuestionsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params;
  const locale: SiteLocale = localeParam === 'np' ? 'np' : 'en';
  const t = COPY[locale];
  const sections = gkSections(locale);
  const total = sections.reduce((sum, s) => sum + s.questions.length, 0);
  const num = (n: number) => (locale === 'np' ? nepaliDigits(n) : String(n));
  // Questions are numbered continuously across sections.
  const offsets = sections.map((_, i) => sections.slice(0, i).reduce((sum, s) => sum + s.questions.length, 0));

  return (
    <>
      <ContentPage title={t.title} intro={[...t.intro(total)]} cta={{ href: '/general-knowledge', label: t.cta }}>
        <nav aria-label={t.contents} className="mb-8 rounded-xl bg-gray-50 p-4">
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-500">{t.contents}</h2>
          <ul className="flex flex-wrap gap-2">
            {sections.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="inline-block rounded-full border bg-white px-3 py-1 text-sm text-blue-700 hover:bg-blue-50">
                  {s[locale]} ({num(s.questions.length)})
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {sections.map((s, sectionIndex) => (
          <section key={s.id} id={s.id} className="mb-10 scroll-mt-24">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">{s[locale]}</h2>
            <ol className="list-none space-y-4">
              {s.questions.map((q, i) => {
                const number = offsets[sectionIndex] + i + 1;
                return (
                  <li key={q.id} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                    <p className="font-medium text-gray-900">
                      <span className="mr-2 text-blue-700">{num(number)}.</span>
                      {q.question}
                    </p>
                    <ul className="mt-2 grid gap-1 text-gray-700 sm:grid-cols-2">
                      {q.options.map((option, i) => (
                        <li key={option}>
                          {LETTERS[locale][i]}) {option}
                        </li>
                      ))}
                    </ul>
                    <p className="mt-2 text-green-800">
                      <strong>{t.answer}:</strong> {q.correctAnswer}
                    </p>
                  </li>
                );
              })}
            </ol>
          </section>
        ))}
      </ContentPage>
      <PageSeo path="/nepal-gk-questions" locale={locale} isGame={false} />
    </>
  );
}
