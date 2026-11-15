import type { SiteLocale } from './site';

/**
 * The short "About this game" text shown at the bottom of each game page.
 * It is rendered on the server, so search engines read it even though the games
 * themselves run in the browser. The first sentence says what the page is and how
 * it works (search engines and AI answers quote short passages, not whole pages).
 *
 * Keep each entry factual: describe only what the game really does.
 */
export interface AboutCopy {
  heading: string;
  paragraphs: string[];
}

export const ABOUT_COPY: Record<string, Record<SiteLocale, AboutCopy>> = {
  '/guess-festival': {
    en: {
      heading: 'About Guess the Festival',
      paragraphs: [
        'Guess the Festival is a free quiz about Nepali festivals. Each round gives you clues about a festival such as Dashain, Tihar, Holi or Teej, and you pick the right one from four options.',
        'Play in standard mode at your own pace, or switch to timed mode: 30 seconds per question and double points. Your score and best streak are saved in your browser.',
      ],
    },
    np: {
      heading: 'चाडपर्व अनुमान गर्नुहोस् खेलको बारेमा',
      paragraphs: [
        'चाडपर्व अनुमान गर्नुहोस् नेपाली चाडपर्वबारे निःशुल्क क्विज हो। हरेक पटक दशैं, तिहार, होली वा तीज जस्ता चाडका संकेत दिइन्छ, र तपाईंले चार विकल्पमध्ये सही चाड छान्नुहुन्छ।',
        'आफ्नै गतिमा साधारण मोडमा खेल्नुहोस्, वा समय मोडमा: हरेक प्रश्नमा ३० सेकेन्ड र दोब्बर अंक। तपाईंको अंक र उत्कृष्ट स्ट्रिक तपाईंको ब्राउजरमा सुरक्षित रहन्छ।',
      ],
    },
  },
  '/gau-khane-katha': {
    en: {
      heading: 'About Gau Khane Katha',
      paragraphs: [
        'Gau khane katha are traditional Nepali riddles. Read the riddle, type your answer and get three tries before the answer is shown. You can answer in English or Nepali.',
        'There are hundreds of riddles, shown in random order. Correct answers build your streak, and you can send in your own riddle for others to solve.',
      ],
    },
    np: {
      heading: 'गाउँखाने कथाको बारेमा',
      paragraphs: [
        'गाउँखाने कथा परम्परागत नेपाली पहेली हुन्। कथा पढ्नुहोस्, उत्तर टाइप गर्नुहोस्; उत्तर देखाउनुअघि तपाईंसँग तीन मौका हुन्छ। उत्तर नेपाली वा अंग्रेजीमा दिन सकिन्छ।',
        'यहाँ हजारभन्दा बढी गाउँखाने कथा छन्, जुन अनियमित क्रममा आउँछन्। सही उत्तरले स्ट्रिक बढाउँछ, र तपाईं आफ्नै गाउँखाने कथा पनि पठाउन सक्नुहुन्छ।',
      ],
    },
  },
  '/general-knowledge': {
    en: {
      heading: 'About the Nepal GK Quiz',
      paragraphs: [
        'This is a free general knowledge quiz about Nepal, with more than 250 multiple-choice questions on history, geography, culture, sports and more.',
        'Pick a category or play them all. Each correct answer is worth 10 points, and your high score is saved in your browser. Useful practice for Loksewa-style GK and for anyone curious about Nepal.',
      ],
    },
    np: {
      heading: 'नेपाल सामान्य ज्ञान क्विजको बारेमा',
      paragraphs: [
        'यो नेपालबारे निःशुल्क सामान्य ज्ञान क्विज हो, जसमा इतिहास, भूगोल, संस्कृति, खेलकुद लगायतका बहुविकल्पीय प्रश्नहरू छन्।',
        'कुनै एक विषय छान्नुहोस् वा सबै खेल्नुहोस्। हरेक सही उत्तरमा १० अंक, र तपाईंको उच्च अंक ब्राउजरमा सुरक्षित रहन्छ। लोकसेवा शैलीको सामान्य ज्ञान अभ्यासका लागि पनि उपयोगी।',
      ],
    },
  },
  '/kings-of-nepal': {
    en: {
      heading: 'About the Kings of Nepal Quiz',
      paragraphs: [
        'Can you name all 12 kings of the Shah dynasty, from Prithvi Narayan Shah to Gyanendra Shah? Type each name from memory; first names are enough.',
        'Each correct name appears in the list with its reign years. Give up at any time to see the ones you missed, or read the history page to learn more about each king.',
      ],
    },
    np: {
      heading: 'नेपालका राजाहरू क्विजको बारेमा',
      paragraphs: [
        'पृथ्वीनारायण शाहदेखि ज्ञानेन्द्र शाहसम्म, शाह वंशका सबै १२ राजाको नाम भन्न सक्नुहुन्छ? सम्झेर हरेक नाम टाइप गर्नुहोस्; पहिलो नाम मात्र भए पनि पुग्छ।',
        'हरेक सही नाम शासनकालसहित सूचीमा देखिन्छ। जुनसुकै बेला छोडेर छुटेका नाम हेर्न सक्नुहुन्छ, वा इतिहास पृष्ठमा हरेक राजाबारे थप पढ्न सक्नुहुन्छ।',
      ],
    },
  },
  '/name-districts': {
    en: {
      heading: 'About Name the Districts',
      paragraphs: [
        'Name the Districts is a map quiz covering all 77 districts of Nepal. Each round shows the outline of one district; type its name or pick from three options.',
        'You have 20 minutes to name as many as you can. Your score is 100 points per district plus a bonus for time left, and the gallery at the end shows the ones you missed.',
      ],
    },
    np: {
      heading: 'जिल्ला चिन्नुहोस् खेलको बारेमा',
      paragraphs: [
        'जिल्ला चिन्नुहोस् नेपालका सबै ७७ जिल्ला समेट्ने नक्सा क्विज हो। हरेक पटक एउटा जिल्लाको आकार देखाइन्छ; नाम टाइप गर्नुहोस् वा तीन विकल्पमध्ये छान्नुहोस्।',
        'सकेजति जिल्ला चिन्न तपाईंसँग २० मिनेट हुन्छ। हरेक जिल्लामा १०० अंक र बाँकी समयको बोनस पाइन्छ, अनि अन्त्यमा छुटेका जिल्ला देखाइन्छ।',
      ],
    },
  },
  '/mandir-chineu': {
    en: {
      heading: 'About Guess the Temple',
      paragraphs: [
        'Guess the Temple shows photos of famous temples, stupas and sacred sites across Nepal. Type the name, or the common short name, to score points.',
        'Filter by province or the Kathmandu Valley to focus on one region. Reach 100 points to win the round.',
      ],
    },
    np: {
      heading: 'मन्दिर चिन्नुहोस् खेलको बारेमा',
      paragraphs: [
        'मन्दिर चिन्नुहोस् खेलमा नेपालभरका प्रसिद्ध मन्दिर, स्तूप र तीर्थस्थलका तस्बिर देखाइन्छ। अंक पाउन नाम वा छोटो प्रचलित नाम टाइप गर्नुहोस्।',
        'एउटै क्षेत्रमा ध्यान दिन प्रदेश वा काठमाडौं उपत्यका छान्नुहोस्। १०० अंक पुर्‍याएर खेल जित्नुहोस्।',
      ],
    },
  },
  '/chineu-ta': {
    en: {
      heading: 'About the Nepal Logo Quiz',
      paragraphs: [
        'The Nepal Logo Quiz tests how well you know the logos of Nepali and popular brands. Each logo starts blurred and becomes clearer with every wrong guess.',
        'You get three tries per logo and five minutes in total. Pause the timer whenever you need, and share your score at the end.',
      ],
    },
    np: {
      heading: 'लोगो क्विजको बारेमा',
      paragraphs: [
        'लोगो क्विजले नेपाली र लोकप्रिय ब्रान्डका लोगो कत्तिको चिन्नुहुन्छ भनेर जाँच्छ। हरेक लोगो धमिलो देखिन्छ र हरेक गलत अनुमानपछि झन् स्पष्ट हुन्छ।',
        'हरेक लोगोमा तीन मौका र जम्मा पाँच मिनेट हुन्छ। चाहेको बेला टाइमर रोक्न सकिन्छ, र अन्त्यमा आफ्नो अंक शेयर गर्न सकिन्छ।',
      ],
    },
  },
  '/yo-ki-tyo': {
    en: {
      heading: 'About Yo Ki Tyo',
      paragraphs: [
        'Yo Ki Tyo is a Nepali "would you rather" game. Each question gives you two very Nepali situations; pick one and see what percentage of players chose the same.',
        'You can also send in your own question to be added to the game.',
      ],
    },
    np: {
      heading: 'यो कि त्यो खेलको बारेमा',
      paragraphs: [
        'यो कि त्यो नेपाली "के छान्नुहुन्छ?" खेल हो। हरेक प्रश्नमा दुई नेपाली परिस्थिति हुन्छन्; एउटा छान्नुहोस् र कति प्रतिशत खेलाडीले त्यही छाने हेर्नुहोस्।',
        'खेलमा थप्नका लागि आफ्नै प्रश्न पनि पठाउन सक्नुहुन्छ।',
      ],
    },
  },
  '/guess-the-word': {
    en: {
      heading: 'About Guess the Word',
      paragraphs: [
        'Guess the Word is a Nepali vocabulary game. A Nepali word appears with a short timer; recall its meaning, then reveal the Nepali and English meanings and mark whether you knew it.',
        'Choose easy, medium or difficult words and your own timer. Words you find hard come back more often, so you learn the ones you need.',
      ],
    },
    np: {
      heading: 'शब्द चिन्नुहोस् खेलको बारेमा',
      paragraphs: [
        'शब्द चिन्नुहोस् नेपाली शब्दभण्डार खेल हो। छोटो समयसँगै एउटा नेपाली शब्द देखिन्छ; अर्थ सम्झनुहोस्, त्यसपछि नेपाली र अंग्रेजी अर्थ हेरेर तपाईंलाई आयो कि आएन चिनो लगाउनुहोस्।',
        'सजिलो, मध्यम वा कठिन शब्द र आफ्नै समय छान्नुहोस्। गाह्रो लागेका शब्द धेरै पटक आउँछन्, ताकि चाहिएका शब्द सिक्न सकियोस्।',
      ],
    },
  },
  '/first-of-nepal': {
    en: {
      heading: 'About Firsts of Nepal',
      paragraphs: [
        'Firsts of Nepal is a collection of the people who did something first in Nepal, from the first president to pioneering athletes, scientists and artists.',
        'Browse by category, then take the 8-question quiz to see how many firsts you remember.',
      ],
    },
    np: {
      heading: 'नेपालका पहिलोहरूको बारेमा',
      paragraphs: [
        'नेपालका पहिलोहरू नेपालमा कुनै काम पहिलो पटक गर्ने व्यक्तिहरूको संग्रह हो, पहिलो राष्ट्रपतिदेखि अग्रगामी खेलाडी, वैज्ञानिक र कलाकारसम्म।',
        'विधा अनुसार हेर्नुहोस्, अनि ८ प्रश्नको क्विज खेलेर कति याद रह्यो जाँच्नुहोस्।',
      ],
    },
  },
  '/life-checklist': {
    en: {
      heading: 'About the Nepali Life Checklist',
      paragraphs: [
        'The Nepali Life Checklist is a list of very Nepali experiences, from eating momos until you can’t move to a packed bus ride. Tick the ones you have done.',
        'Your progress is saved in your browser, and you can share your score to see who among your friends is the most Nepali.',
      ],
    },
    np: {
      heading: 'नेपाली जीवन चेकलिस्टको बारेमा',
      paragraphs: [
        'नेपाली जीवन चेकलिस्ट ठेट नेपाली अनुभवहरूको सूची हो, पेट नअटिउन्जेल मोमो खानेदेखि खचाखच बसको यात्रासम्म। तपाईंले गरेकामा चिनो लगाउनुहोस्।',
        'तपाईंको प्रगति ब्राउजरमा सुरक्षित रहन्छ, र साथीहरूमध्ये को सबैभन्दा नेपाली रहेछ भनेर स्कोर शेयर गर्न सक्नुहुन्छ।',
      ],
    },
  },
  '/spend': {
    en: {
      heading: "About Spend Binod Chaudhary's Money",
      paragraphs: [
        "Spend Binod Chaudhary's Money gives you a budget of NPR 237.5 billion, inspired by the wealth of Nepal's first billionaire, and asks how you would spend it.",
        'Buy everything from plates of momos to buses and buildings, watch the budget shrink, and get a receipt of your spending at the end.',
      ],
    },
    np: {
      heading: 'बिनोद चौधरीको पैसा खर्च गर्नुहोस् खेलको बारेमा',
      paragraphs: [
        'यो खेलले नेपालका पहिलो अर्बपतिको सम्पत्तिबाट प्रेरित भई तपाईंलाई रु. २ खर्ब ३७ अर्ब ५० करोडको बजेट दिन्छ, र तपाईं कसरी खर्च गर्नुहुन्छ भनेर सोध्छ।',
        'मोमोको प्लेटदेखि बस र भवनसम्म किन्नुहोस्, बजेट घट्दै गएको हेर्नुहोस्, र अन्त्यमा खर्चको रसिद पाउनुहोस्।',
      ],
    },
  },
  '/date-converter': {
    en: {
      heading: 'About the Nepali Date Converter',
      paragraphs: [
        'This converter changes dates between the Nepali calendar, Bikram Sambat (BS), and the English Gregorian calendar (AD), in both directions.',
        'Pick a date in either calendar and the converted date appears instantly, with the day of the week. Useful for birthdays, official documents and festival dates.',
      ],
    },
    np: {
      heading: 'नेपाली मिति रूपान्तरणको बारेमा',
      paragraphs: [
        'यसले नेपाली विक्रम सम्वत् (वि.सं.) र अंग्रेजी ग्रेगोरियन (ई.सं.) मितिबीच दुवैतर्फ रूपान्तरण गर्छ।',
        'कुनै पनि पात्रोको मिति छान्नुहोस्, बारसहित रूपान्तरित मिति तुरुन्तै देखिन्छ। जन्मदिन, सरकारी कागजात र चाडपर्वका मितिका लागि उपयोगी।',
      ],
    },
  },
};

/** Up to three other games linked from each page ("You might also like"). */
export const RELATED: Record<string, string[]> = {
  // The list pages link to each other and back to their games.
  '/gau-khane-katha-with-answers': ['/gau-khane-katha', '/nepal-gk-questions', '/yo-ki-tyo'],
  '/nepal-gk-questions': ['/general-knowledge', '/districts-of-nepal', '/kings-of-nepal/about'],
  '/districts-of-nepal': ['/name-districts', '/nepal-gk-questions', '/mandir-chineu'],
  '/guess-festival': ['/mandir-chineu', '/gau-khane-katha', '/general-knowledge'],
  '/gau-khane-katha': ['/gau-khane-katha-with-answers', '/yo-ki-tyo', '/guess-the-word'],
  '/general-knowledge': ['/nepal-gk-questions', '/kings-of-nepal', '/name-districts'],
  '/kings-of-nepal': ['/kings-of-nepal/about', '/first-of-nepal', '/general-knowledge'],
  '/name-districts': ['/districts-of-nepal', '/mandir-chineu', '/general-knowledge'],
  '/mandir-chineu': ['/guess-festival', '/name-districts', '/general-knowledge'],
  '/chineu-ta': ['/spend', '/yo-ki-tyo', '/life-checklist'],
  '/yo-ki-tyo': ['/life-checklist', '/gau-khane-katha', '/spend'],
  '/guess-the-word': ['/gau-khane-katha', '/general-knowledge', '/date-converter'],
  '/first-of-nepal': ['/kings-of-nepal', '/general-knowledge', '/name-districts'],
  '/life-checklist': ['/yo-ki-tyo', '/spend', '/guess-festival'],
  '/spend': ['/about-binod', '/chineu-ta', '/life-checklist'],
  '/date-converter': ['/guess-festival', '/general-knowledge', '/guess-the-word'],
};
