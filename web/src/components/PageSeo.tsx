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
      {(about || related.length > 0) && (
        <section
          aria-labelledby={about ? 'about-this-page' : undefined}
          aria-label={about ? undefined : RELATED_HEADING[locale]}
          data-page-about=""
          className="max-w-4xl mx-auto w-full px-4 pt-2 pb-12"
        >
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            {/* Same blue-to-red accent as the game cards above. */}
            <div className="h-1.5 bg-gradient-to-r from-blue-600 to-red-500" aria-hidden="true" />
            <div className="p-5 sm:p-8">
              {about && (
                <>
                  <h2 id="about-this-page" className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
                    {about.heading}
                  </h2>
                  <div className="space-y-3 text-base leading-relaxed text-gray-600">
                    {about.paragraphs.map((text) => (
                      <p key={text.slice(0, 24)}>{text}</p>
                    ))}
                  </div>
                </>
              )}
              {related.length > 0 && (
                <nav aria-label={RELATED_HEADING[locale]} className={about ? 'mt-8 border-t border-gray-100 pt-6' : ''}>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">{RELATED_HEADING[locale]}</h3>
                  <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {related.map((p) => {
                      const [name, ...rest] = PAGE_SEO[p][locale].title.split(' – ');
                      return (
                        <li key={p}>
                          <Link
                            href={p}
                            className="group flex h-full items-center justify-between gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 transition hover:border-transparent hover:bg-gradient-to-r hover:from-blue-600 hover:to-red-500 hover:shadow-md"
                          >
                            <span className="min-w-0">
                              <span className="block font-semibold text-gray-900 group-hover:text-white">{name}</span>
                              {rest.length > 0 && (
                                <span className="block text-sm text-gray-500 group-hover:text-white/90">{rest.join(' – ')}</span>
                              )}
                            </span>
                            <span aria-hidden="true" className="shrink-0 text-lg text-blue-600 transition group-hover:translate-x-0.5 group-hover:text-white">
                              →
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </nav>
              )}
            </div>
          </div>
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
