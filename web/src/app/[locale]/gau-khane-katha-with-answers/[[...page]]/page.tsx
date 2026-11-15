import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import ContentPage from '@/components/ContentPage';
import PageSeo from '@/components/PageSeo';
import { buildPageMetadata } from '@/lib/seo';
import { riddlePagePath, riddlesOnPage } from '@/lib/riddleList';
import type { SiteLocale } from '@/lib/site';

// Server-rendered list of riddles with tap-to-show answers. /gau-khane-katha-with-answers
// is page 1; /gau-khane-katha-with-answers/2, /3… hold the next 100 each.

type Params = Promise<{ locale: string; page?: string[] }>;

const toLocale = (value: string): SiteLocale => (value === 'np' ? 'np' : 'en');

const nepaliDigits = (n: number) => String(n).replace(/\d/g, (d) => '०१२३४५६७८९'[Number(d)]);

/** Page number from the URL, or null for anything invalid ("/1", "/abc", "/2/3"). */
function parsePage(segments?: string[]): number | null {
  if (!segments || segments.length === 0) return 1;
  if (segments.length > 1 || !/^[2-9]\d*$|^1\d+$/.test(segments[0])) return null;
  return Number(segments[0]);
}

const COPY = {
  en: {
    title: 'Riddles with Answers',
    intro: [
      'Here are English riddles with their answers, in the style of Nepali gau khane katha. Tap any riddle to see the answer, with the Nepali word in brackets.',
      'Want to test yourself first? Play the riddle game: you type the answer and get three tries before it is shown.',
    ],
    cta: 'Play the riddle game',
    show: 'Show answer',
    page: (n: number, of: number) => `Page ${n} of ${of}`,
    prev: '← Previous',
    next: 'Next →',
    pagination: 'Riddle pages',
    nepaliLink: 'Looking for Nepali riddles? See the Nepali gau khane katha list.',
  },
  np: {
    title: 'गाउँखाने कथा उत्तरसहित',
    intro: [
      'यहाँ हजारभन्दा बढी नेपाली गाउँखाने कथा उत्तरसहित छन्। उत्तर हेर्न कुनै पनि कथामा थिच्नुहोस्; कोष्ठमा अंग्रेजी अर्थ पनि छ।',
      'पहिले आफैं जाँच्न चाहनुहुन्छ? गाउँखाने कथा खेल खेल्नुहोस्: उत्तर टाइप गर्नुहोस्, उत्तर देखाउनुअघि तीन मौका पाइन्छ।',
    ],
    cta: 'गाउँखाने कथा खेल्नुहोस्',
    show: 'उत्तर हेर्नुहोस्',
    page: (n: number, of: number) => `पृष्ठ ${nepaliDigits(n)} / ${nepaliDigits(of)}`,
    prev: '← अघिल्लो',
    next: 'अर्को →',
    pagination: 'कथाका पृष्ठहरू',
    nepaliLink: '',
  },
} as const;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale: localeParam, page: segments } = await params;
  const locale = toLocale(localeParam);
  const page = parsePage(segments);
  if (page === null || !riddlesOnPage(locale, page)) return {};
  const suffix = page > 1 ? (locale === 'np' ? ` – पृष्ठ ${nepaliDigits(page)}` : ` – Page ${page}`) : '';
  return buildPageMetadata('/gau-khane-katha-with-answers', locale, {
    urlPath: riddlePagePath(page),
    titleSuffix: suffix,
    // The English and Nepali lists are different riddles, so only page 1 pairs up.
    hreflang: page === 1,
  });
}

export default async function RiddlesWithAnswersPage({ params }: { params: Params }) {
  const { locale: localeParam, page: segments } = await params;
  const locale = toLocale(localeParam);
  const page = parsePage(segments);
  const data = page === null ? null : riddlesOnPage(locale, page);
  if (!data || page === null) notFound();

  const t = COPY[locale];
  const number = (i: number) => (locale === 'np' ? nepaliDigits(i) : String(i));

  return (
    <>
      <ContentPage
        title={page > 1 ? `${t.title} – ${t.page(page, data.pages)}` : t.title}
        intro={page === 1 ? [...t.intro] : []}
        cta={{ href: '/gau-khane-katha', label: t.cta }}
      >
        <p className="text-sm text-gray-500 mb-4">{t.page(page, data.pages)}</p>
        <ol className="space-y-3 list-none">
          {data.riddles.map((riddle, i) => {
            const translation = locale === 'np' ? riddle.answerEn : riddle.answerNp;
            return (
              <li key={riddle.id} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <details>
                  <summary className="cursor-pointer list-none">
                    <span className="mr-2 font-semibold text-blue-700">{number(data.start + i + 1)}.</span>
                    <span className="text-gray-900">{riddle.question}</span>
                    <span className="ml-2 text-sm text-blue-600 underline">{t.show}</span>
                  </summary>
                  <p className="mt-3 rounded-lg bg-green-50 px-3 py-2 font-medium text-green-800">
                    {riddle.answer}
                    {translation ? <span className="font-normal text-green-700"> ({translation})</span> : null}
                  </p>
                </details>
              </li>
            );
          })}
        </ol>

        <nav aria-label={t.pagination} className="mt-8 flex flex-wrap items-center gap-2">
          {page > 1 && (
            <Link href={riddlePagePath(page - 1)} className="rounded-full border px-3 py-1 text-sm hover:bg-gray-50">
              {t.prev}
            </Link>
          )}
          {Array.from({ length: data.pages }, (_, i) => i + 1).map((n) =>
            n === page ? (
              <span key={n} aria-current="page" className="rounded-full bg-blue-600 px-3 py-1 text-sm text-white">
                {number(n)}
              </span>
            ) : (
              <Link key={n} href={riddlePagePath(n)} className="rounded-full border px-3 py-1 text-sm hover:bg-gray-50">
                {number(n)}
              </Link>
            )
          )}
          {page < data.pages && (
            <Link href={riddlePagePath(page + 1)} className="rounded-full border px-3 py-1 text-sm hover:bg-gray-50">
              {t.next}
            </Link>
          )}
        </nav>

        {locale === 'en' && page === 1 && (
          <p className="mt-6 text-sm text-gray-600">
            <Link href={riddlePagePath(1)} locale="np" className="text-blue-700 underline">
              {t.nepaliLink}
            </Link>
          </p>
        )}
      </ContentPage>
      {page === 1 && <PageSeo path="/gau-khane-katha-with-answers" locale={locale} isGame={false} />}
    </>
  );
}
