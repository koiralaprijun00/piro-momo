import Image from 'next/image';
import ContentPage from '@/components/ContentPage';
import PageSeo from '@/components/PageSeo';
import { districtData } from '@/app/data/district-data';
import { PROVINCES } from '@/lib/provinces';
import { pageMetadata } from '@/lib/seo';
import type { SiteLocale } from '@/lib/site';

// Server-rendered list of Nepal's 77 districts, grouped by province.

export const generateMetadata = pageMetadata('/districts-of-nepal');

const nepaliDigits = (n: number) => String(n).replace(/\d/g, (d) => '०१२३४५६७८९'[Number(d)]);
const byId = new Map(districtData.map((d) => [d.id, d]));

const COPY = {
  en: {
    title: 'List of the 77 Districts of Nepal',
    intro: [
      'Nepal has 77 districts in 7 provinces: Koshi, Madhesh, Bagmati, Gandaki, Lumbini, Karnali and Sudurpashchim. The tables below list every district by province, with its headquarters, its name in Nepali and its outline on the map.',
      'There were 75 districts until 2015. Nawalparasi and Rukum were each split in two, which made 77.',
    ],
    cta: 'Test yourself: Name the Districts quiz',
    contents: 'Provinces',
    districts: (n: number) => `${n} districts`,
    columns: ['#', 'Map', 'District', 'Nepali name', 'Headquarters'],
    source: 'Headquarters: Wikipedia, “List of districts of Nepal”, checked 16 November 2026.',
  },
  np: {
    title: 'नेपालका ७७ जिल्लाको सूची',
    intro: [
      'नेपालमा ७ प्रदेशमा ७७ जिल्ला छन्: कोशी, मधेश, बागमती, गण्डकी, लुम्बिनी, कर्णाली र सुदूरपश्चिम। तलका तालिकामा प्रदेश अनुसार हरेक जिल्ला, यसको सदरमुकाम, अंग्रेजी नाम र नक्सामा आकार दिइएको छ।',
      'वि.सं. २०७२ सम्म नेपालमा ७५ जिल्ला थिए। नवलपरासी र रुकुम दुई-दुई भागमा बाँडिएपछि ७७ जिल्ला भए।',
    ],
    cta: 'आफैं जाँच्नुहोस्: जिल्ला चिन्नुहोस् क्विज',
    contents: 'प्रदेशहरू',
    districts: (n: number) => `${nepaliDigits(n)} जिल्ला`,
    columns: ['#', 'नक्सा', 'जिल्ला', 'अंग्रेजी नाम', 'सदरमुकाम'],
    source: 'सदरमुकाम: विकिपिडिया, “List of districts of Nepal”, १६ नोभेम्बर २०२६ मा हेरिएको।',
  },
} as const;

export default async function DistrictsOfNepalPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params;
  const locale: SiteLocale = localeParam === 'np' ? 'np' : 'en';
  const t = COPY[locale];
  const num = (n: number) => (locale === 'np' ? nepaliDigits(n) : String(n));
  const offsets = PROVINCES.map((_, i) =>
    PROVINCES.slice(0, i).reduce((sum, p) => sum + Object.keys(p.districts).length, 0)
  );

  return (
    <>
      <ContentPage title={t.title} intro={[...t.intro]} cta={{ href: '/name-districts', label: t.cta }}>
        <nav aria-label={t.contents} className="mb-8 rounded-xl bg-gray-50 p-4">
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-500">{t.contents}</h2>
          <ul className="flex flex-wrap gap-2">
            {PROVINCES.map((p) => (
              <li key={p.id}>
                <a href={`#${p.id}`} className="inline-block rounded-full border bg-white px-3 py-1 text-sm text-blue-700 hover:bg-blue-50">
                  {p[locale]} ({num(Object.keys(p.districts).length)})
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {PROVINCES.map((province, provinceIndex) => (
          <section key={province.id} id={province.id} className="mb-10 scroll-mt-24">
            <h2 className="mb-1 text-2xl font-bold text-gray-900">{province[locale]}</h2>
            <p className="mb-3 text-sm text-gray-500">{t.districts(Object.keys(province.districts).length)}</p>
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    {t.columns.map((c) => (
                      <th key={c} scope="col" className="px-3 py-2 font-semibold">
                        {c}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {Object.entries(province.districts).map(([id, headquarters], i) => {
                    const district = byId.get(id);
                    if (!district) return null;
                    const english = district.translations.en;
                    const nepali = district.translations.ne;
                    return (
                      <tr key={id}>
                        <td className="px-3 py-2 text-gray-500">{num(offsets[provinceIndex] + i + 1)}</td>
                        <td className="px-3 py-2">
                          <Image
                            src={district.imagePath}
                            alt={locale === 'np' ? `${nepali} जिल्लाको नक्सा` : `Map outline of ${english} district`}
                            width={40}
                            height={40}
                            unoptimized
                            loading="lazy"
                            className="h-10 w-10 object-contain"
                          />
                        </td>
                        <th scope="row" className="px-3 py-2 font-medium text-gray-900">
                          {locale === 'np' ? nepali : english}
                        </th>
                        <td className="px-3 py-2 text-gray-700">{locale === 'np' ? english : nepali}</td>
                        <td className="px-3 py-2 text-gray-700">{headquarters}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        ))}
        <p className="text-xs text-gray-500">{t.source}</p>
      </ContentPage>
      <PageSeo path="/districts-of-nepal" locale={locale} isGame={false} />
    </>
  );
}
