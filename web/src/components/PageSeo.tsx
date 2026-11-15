import { Link } from '@/i18n/navigation';
import { ABOUT_COPY, RELATED } from '@/lib/seoContent';
import { PAGE_SEO } from '@/lib/seo';
import { HTML_LANG, SITE_URL, type SiteLocale } from '@/lib/site';

/**
 * Server-rendered extras for a public page:
 * - structured data (breadcrumb, and for games a free web app description), and
 * - the short "About this game" section with links to related games.
 * Both are in the raw HTML, so search engines and AI crawlers can read them
 * without running the game's JavaScript.
 */

function JsonLd({ data }: { data: object }) {
  // Escape "<" so text in the data can't close the script tag.
  const json = JSON.stringify(data).replace(/</g, '\\u003c');
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}

const HOME_NAME: Record<SiteLocale, string> = { en: 'Home', np: 'गृहपृष्ठ' };
const RELATED_HEADING: Record<SiteLocale, string> = { en: 'You might also like', np: 'यी पनि खेल्नुहोस्' };

export default function PageSeo({ path, locale: localeParam, isGame = true }: { path: string; locale: string; isGame?: boolean }) {
  const locale: SiteLocale = localeParam === 'np' ? 'np' : 'en';
  const page = PAGE_SEO[path]?.[locale];
  if (!page) return null;

  const url = `${SITE_URL}/${locale}${path}`;
  const about = ABOUT_COPY[path]?.[locale];
  const related = (RELATED[path] ?? []).filter((p) => PAGE_SEO[p]);

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: HOME_NAME[locale], item: `${SITE_URL}/${locale}` },
      { '@type': 'ListItem', position: 2, name: page.title, item: url },
    ],
  };

  // A free browser game. No ratings or reviews: there are no real reviews to show.
  const webApp = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: page.title,
    description: page.description,
    url,
    inLanguage: HTML_LANG[locale],
    applicationCategory: path === '/date-converter' ? 'UtilitiesApplication' : 'GameApplication',
    operatingSystem: 'Any (web browser)',
    isAccessibleForFree: true,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    publisher: { '@id': `${SITE_URL}/#organization` },
  };

  return (
    <>
      <JsonLd data={breadcrumb} />
      {isGame && <JsonLd data={webApp} />}
      {about && (
        <section aria-labelledby="about-this-page" className="max-w-4xl mx-auto px-4 py-10 text-gray-700">
          <h2 id="about-this-page" className="text-xl font-semibold text-gray-900 mb-3">
            {about.heading}
          </h2>
          {about.paragraphs.map((text) => (
            <p key={text.slice(0, 24)} className="mb-3 leading-relaxed">
              {text}
            </p>
          ))}
          {related.length > 0 && (
            <nav aria-label={RELATED_HEADING[locale]} className="mt-6">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-2">
                {RELATED_HEADING[locale]}
              </h3>
              <ul className="flex flex-wrap gap-2">
                {related.map((p) => (
                  <li key={p}>
                    <Link
                      href={p}
                      className="inline-block rounded-full border border-gray-200 px-3 py-1 text-sm text-blue-700 hover:bg-blue-50"
                    >
                      {PAGE_SEO[p][locale].title}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </section>
      )}
    </>
  );
}

/** Site-wide structured data: who runs the site and what it is. Rendered once per page. */
export function SiteJsonLd({ locale: localeParam }: { locale: string }) {
  const locale: SiteLocale = localeParam === 'np' ? 'np' : 'en';
  const organization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: 'Piromomo',
    url: SITE_URL,
    logo: `${SITE_URL}/momo.png`,
    sameAs: ['https://x.com/kastopiromomo', 'https://www.instagram.com/kastopiromomo/'],
  };
  const website = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: 'Piromomo',
    url: `${SITE_URL}/${locale}`,
    inLanguage: HTML_LANG[locale],
    publisher: { '@id': `${SITE_URL}/#organization` },
  };
  return (
    <>
      <JsonLd data={organization} />
      <JsonLd data={website} />
    </>
  );
}
