import type { Metadata } from 'next';
import { HTML_LANG, LOCALES, SITE_URL, type SiteLocale } from './site';

/**
 * Search titles and descriptions for every public page, in English and Nepali.
 * Each page gets its own title, description and canonical URL, so Google can tell
 * the games apart (identical titles made it treat pages as duplicates).
 *
 * Titles are shown as "<title> | Piromomo" (added in buildPageMetadata).
 * Keep titles under ~60 characters and descriptions under ~160.
 */
type Copy = { title: string; description: string };
type PageSeo = Record<SiteLocale, Copy>;

export const PAGE_SEO: Record<string, PageSeo> = {
  '': {
    en: {
      title: 'Fun Nepali Games, Quizzes & Riddles',
      description:
        'Play free Nepali games online: guess festivals and temples, solve gau khane katha riddles, name the kings and 77 districts of Nepal, and more.',
    },
    np: {
      title: 'रमाइला नेपाली खेल, क्विज र गाउँखाने कथा',
      description:
        'निःशुल्क नेपाली खेलहरू खेल्नुहोस्: चाडपर्व र मन्दिर चिन्नुहोस्, गाउँखाने कथा सुल्झाउनुहोस्, नेपालका राजा र ७७ जिल्लाको नाम भन्नुहोस्।',
    },
  },
  '/guess-festival': {
    en: {
      title: 'Guess the Festival – Nepali Festival Quiz',
      description:
        'How well do you know Dashain, Tihar, Holi and other Nepali festivals? Read the clues, pick the festival and build your streak.',
    },
    np: {
      title: 'चाडपर्व अनुमान गर्नुहोस् – नेपाली चाडपर्व क्विज',
      description:
        'दशैं, तिहार, होली र अन्य नेपाली चाडपर्व कत्तिको चिन्नुहुन्छ? संकेत पढ्नुहोस्, सही चाड छान्नुहोस् र आफ्नो स्ट्रिक बढाउनुहोस्।',
    },
  },
  '/gau-khane-katha': {
    en: {
      title: 'Gau Khane Katha – Nepali Riddles Game',
      description:
        'Solve classic Nepali riddles (gau khane katha) online. Three tries per riddle, score points and keep your streak going.',
    },
    np: {
      title: 'गाउँखाने कथा – नेपाली पहेली खेल',
      description:
        'पुराना र रमाइला नेपाली गाउँखाने कथा अनलाइन सुल्झाउनुहोस्। हरेक कथामा तीन मौका, अंक जोड्नुहोस् र स्ट्रिक बचाउनुहोस्।',
    },
  },
  '/general-knowledge': {
    en: {
      title: 'Nepal General Knowledge Quiz (GK)',
      description:
        'Test your general knowledge about Nepal: history, geography, culture, sports and more. Pick a category and beat your high score.',
    },
    np: {
      title: 'नेपाल सामान्य ज्ञान क्विज',
      description:
        'नेपालको इतिहास, भूगोल, संस्कृति, खेलकुद र अन्य विषयमा आफ्नो सामान्य ज्ञान जाँच्नुहोस्। विषय छान्नुहोस् र उच्च अंक बनाउनुहोस्।',
    },
  },
  '/kings-of-nepal': {
    en: {
      title: 'Kings of Nepal Quiz – Name Every King',
      description:
        'Can you name all the kings of Nepal from the Shah dynasty? Type their names from memory and see how many you get.',
    },
    np: {
      title: 'नेपालका राजाहरू क्विज – सबै राजाको नाम भन्नुहोस्',
      description:
        'शाह वंशका नेपालका सबै राजाहरूको नाम सम्झन सक्नुहुन्छ? सम्झेर टाइप गर्नुहोस् र कतिवटा मिल्छ हेर्नुहोस्।',
    },
  },
  '/kings-of-nepal/about': {
    en: {
      title: 'Kings of Nepal – History of the Shah Dynasty',
      description:
        'A short history of the kings of Nepal, from Prithvi Narayan Shah to the last king of the Shah dynasty, with reign dates.',
    },
    np: {
      title: 'नेपालका राजाहरू – शाह वंशको इतिहास',
      description:
        'पृथ्वीनारायण शाहदेखि शाह वंशका अन्तिम राजासम्म, शासनकालसहित नेपालका राजाहरूको छोटो इतिहास।',
    },
  },
  '/name-districts': {
    en: {
      title: 'Name the 77 Districts of Nepal – Map Quiz',
      description:
        'Guess every district of Nepal from its shape. A 20-minute geography challenge covering all 77 districts.',
    },
    np: {
      title: 'नेपालका ७७ जिल्ला चिन्नुहोस् – नक्सा क्विज',
      description:
        'आकार हेरेर नेपालका सबै जिल्ला चिन्नुहोस्। ७७ वटै जिल्ला समेट्ने २० मिनेटको भूगोल चुनौती।',
    },
  },
  '/mandir-chineu': {
    en: {
      title: 'Guess the Temple – Nepal Temples Quiz',
      description:
        'Identify famous temples and sacred sites of Nepal from photos, from Pashupatinath to Pathibhara. Filter by province.',
    },
    np: {
      title: 'मन्दिर चिन्नुहोस् – नेपालका मन्दिर क्विज',
      description:
        'पशुपतिनाथदेखि पाथीभरासम्म, तस्बिर हेरेर नेपालका प्रसिद्ध मन्दिर र तीर्थस्थल चिन्नुहोस्। प्रदेश अनुसार छान्न सकिन्छ।',
    },
  },
  '/chineu-ta': {
    en: {
      title: 'Nepal Logo Quiz – Guess the Brand',
      description:
        'How many Nepali brand logos can you recognise? Guess blurred logos in five minutes, with three tries each.',
    },
    np: {
      title: 'लोगो चिन्नुहोस् – नेपाली ब्रान्ड क्विज',
      description:
        'कति वटा नेपाली ब्रान्डका लोगो चिन्नुहुन्छ? धमिलो लोगो पाँच मिनेटभित्र चिन्नुहोस्, हरेकमा तीन मौका।',
    },
  },
  '/yo-ki-tyo': {
    en: {
      title: 'Yo Ki Tyo – Nepali Would You Rather',
      description:
        'Pick between two very Nepali situations and see how your choice compares with everyone else’s votes.',
    },
    np: {
      title: 'यो कि त्यो – के छान्नुहुन्छ?',
      description:
        'दुई नेपाली परिस्थितिमध्ये एउटा छान्नुहोस् र अरूले के छाने त्यससँग आफ्नो छनौट तुलना गर्नुहोस्।',
    },
  },
  '/guess-the-word': {
    en: {
      title: 'Guess the Word – Nepali Vocabulary Game',
      description:
        'Practise Nepali words against the clock. See a word, recall its meaning and track which words you know.',
    },
    np: {
      title: 'शब्द चिन्नुहोस् – नेपाली शब्दभण्डार खेल',
      description:
        'समयसँग होड गर्दै नेपाली शब्द अभ्यास गर्नुहोस्। शब्द हेर्नुहोस्, अर्थ सम्झनुहोस् र कुन शब्द आउँछ हेर्नुहोस्।',
    },
  },
  '/first-of-nepal': {
    en: {
      title: 'Firsts of Nepal – Pioneers Quiz',
      description:
        'Who was the first in Nepal to do it? Learn about the pioneers who made history and test yourself with a quick quiz.',
    },
    np: {
      title: 'नेपालका पहिलोहरू – अग्रगामी व्यक्तित्व क्विज',
      description:
        'नेपालमा पहिलो पटक कसले के गरे? इतिहास रच्ने अग्रगामी व्यक्तिहरूबारे जान्नुहोस् र छोटो क्विज खेल्नुहोस्।',
    },
  },
  '/life-checklist': {
    en: {
      title: 'Nepali Life Checklist – Are You a Real Nepali?',
      description:
        'From momos to Dashain chaos: tick off the very Nepali things you have done and share your score with friends.',
    },
    np: {
      title: 'नेपाली जीवन चेकलिस्ट – के तपाईं सक्कली नेपाली हो?',
      description:
        'मोमोदेखि दशैंको भीडसम्म: तपाईंले गरेका नेपाली कुराहरूमा चिनो लगाउनुहोस् र साथीहरूसँग स्कोर शेयर गर्नुहोस्।',
    },
  },
  '/spend': {
    en: {
      title: "Spend Binod Chaudhary's Money",
      description:
        "Nepal's only billionaire has money to spare. Buy momos, buses and buildings and see how fast you can spend it all.",
    },
    np: {
      title: 'बिनोद चौधरीको पैसा खर्च गर्नुहोस्',
      description:
        'नेपालका एक मात्र अर्बपतिको पैसा तपाईंको हातमा। मोमो, बस र भवन किन्नुहोस् र कति छिटो सकिन्छ हेर्नुहोस्।',
    },
  },
  '/date-converter': {
    en: {
      title: 'Nepali Date Converter – BS to AD and AD to BS',
      description:
        'Convert dates between the Nepali calendar (Bikram Sambat) and the English calendar instantly, in both directions.',
    },
    np: {
      title: 'नेपाली मिति रूपान्तरण – वि.सं. देखि ई.सं.',
      description:
        'विक्रम सम्वत् र अंग्रेजी मितिबीच दुवैतर्फ तुरुन्तै मिति रूपान्तरण गर्नुहोस्।',
    },
  },
  '/about': {
    en: {
      title: 'About Piromomo',
      description:
        "Piromomo makes Nepal's culture, history and geography fun with free games and quizzes for Nepalis everywhere.",
    },
    np: {
      title: 'पिरोमोमोको बारेमा',
      description:
        'पिरोमोमोले निःशुल्क खेल र क्विजमार्फत नेपालको संस्कृति, इतिहास र भूगोललाई रमाइलो बनाउँछ।',
    },
  },
  '/about-binod': {
    en: {
      title: "Who Is Binod Chaudhary? Nepal's Billionaire",
      description:
        "The story of Binod Chaudhary, Nepal's first billionaire: the Chaudhary Group, Wai Wai noodles and his net worth.",
    },
    np: {
      title: 'बिनोद चौधरी को हुन्? नेपालका अर्बपति',
      description:
        'नेपालका पहिलो अर्बपति बिनोद चौधरीको कथा: चौधरी ग्रुप, वाइवाइ चाउचाउ र उनको सम्पत्ति।',
    },
  },
};

const OG_IMAGE = { url: `${SITE_URL}/momo.png`, width: 800, height: 600, alt: 'Piromomo – fun Nepali games' };

function isLocale(value: string): value is SiteLocale {
  return (LOCALES as readonly string[]).includes(value);
}

/** Canonical + hreflang links for one page: each language version points to itself and lists the other. */
export function alternatesFor(path: string, locale: SiteLocale): Metadata['alternates'] {
  return {
    canonical: `/${locale}${path}`,
    languages: {
      ...Object.fromEntries(LOCALES.map((l) => [HTML_LANG[l], `/${l}${path}`])),
      'x-default': `/en${path}`,
    },
  };
}

/** Builds the metadata for a public page. Used by each route's layout.tsx. */
export function buildPageMetadata(path: string, localeParam: string): Metadata {
  const locale: SiteLocale = isLocale(localeParam) ? localeParam : 'en';
  const copy = PAGE_SEO[path]?.[locale] ?? PAGE_SEO[''][locale];
  return {
    // `absolute` so nested layouts can't drop the brand suffix.
    title: { absolute: `${copy.title} | Piromomo` },
    description: copy.description,
    alternates: alternatesFor(path, locale),
    openGraph: {
      title: copy.title,
      description: copy.description,
      url: `/${locale}${path}`,
      siteName: 'Piromomo',
      locale: locale === 'np' ? 'ne_NP' : 'en_US',
      type: 'website',
      images: [OG_IMAGE],
    },
    twitter: {
      card: 'summary_large_image',
      title: copy.title,
      description: copy.description,
      images: [OG_IMAGE.url],
    },
  };
}

/** For a route's layout.tsx: `export const generateMetadata = pageMetadata('/spend');` */
export function pageMetadata(path: string) {
  return async ({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> => {
    const { locale } = await params;
    return buildPageMetadata(path, locale);
  };
}

/** Account pages (profile, sign-in) shouldn't appear in search results. */
export const PRIVATE_PAGE_METADATA: Metadata = {
  robots: { index: false, follow: false },
};
