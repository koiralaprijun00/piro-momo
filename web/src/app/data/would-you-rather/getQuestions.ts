// src/app/data/would-you-rather/getQuestions.ts

export interface WouldYouRatherQuestion {
  id: string;
  optionA: string;
  optionB: string;
  optionAVotes: number;
  optionBVotes: number;
}

// Sample English questions
const englishQuestions: WouldYouRatherQuestion[] = [
  // Food Category
  {
    id: 'food-1',
    optionA: 'eat momo every day for a year',
    optionB: 'never eat momo again',
    optionAVotes: 865,
    optionBVotes: 135
  },
  {
    id: 'food-2',
    optionA: 'only eat Newari cuisine for the rest of your life',
    optionB: 'only eat Thakali cuisine for the rest of your life',
    optionAVotes: 423,
    optionBVotes: 577
  },
  {
    id: 'food-3',
    optionA: 'give up sel roti forever',
    optionB: 'give up aloo tama forever',
    optionAVotes: 320,
    optionBVotes: 680
  },
  {
    id: 'food-4',
    optionA: 'drink chiya without sugar for life',
    optionB: 'drink chiya without milk for life',
    optionAVotes: 289,
    optionBVotes: 711
  },
  {
    id: 'food-5',
    optionA: 'eat only buff momo',
    optionB: 'eat only veg momo',
    optionAVotes: 521,
    optionBVotes: 479
  },
  
  // Travel Category
  {
    id: 'travel-1',
    optionA: 'climb to Everest Base Camp',
    optionB: 'raft all of the Karnali River',
    optionAVotes: 723,
    optionBVotes: 277
  },
  {
    id: 'travel-2',
    optionA: 'be stuck in Kathmandu traffic for 3 hours',
    optionB: 'walk up 1,000 steps to a hilltop temple',
    optionAVotes: 245,
    optionBVotes: 755
  },
  {
    id: 'travel-3',
    optionA: 'live in Pokhara with no electricity',
    optionB: 'live in Kathmandu with no internet',
    optionAVotes: 657,
    optionBVotes: 343
  },
  {
    id: 'travel-4',
    optionA: 'trek the entire Annapurna Circuit in monsoon season',
    optionB: 'spend a month in Dolpa during winter',
    optionAVotes: 421,
    optionBVotes: 579
  },
  {
    id: 'travel-5',
    optionA: 'drive a scooter through Thamel during peak tourist season',
    optionB: 'take a crowded local bus from Kathmandu to Pokhara during Dashain',
    optionAVotes: 513,
    optionBVotes: 487
  },
  
  // Culture Category
  {
    id: 'culture-1',
    optionA: 'experience Holi in Kathmandu',
    optionB: 'experience Dashain in your ancestral village',
    optionAVotes: 325,
    optionBVotes: 675
  },
  {
    id: 'culture-2',
    optionA: 'join a silent retreat with Buddhist monks for a week',
    optionB: 'spend a day in Gorkha Palace learning from Prithvi Narayan Shah’s generals',
    optionAVotes: 310,
    optionBVotes: 690
  },
  {
    id: 'culture-3',
    optionA: 'attend Indra Jatra every year',
    optionB: 'attend Bisket Jatra every year',
    optionAVotes: 558,
    optionBVotes: 442
  },
  {
    id: 'culture-4',
    optionA: 'be an incredible classical Nepali dancer',
    optionB: 'be an exceptional traditional Nepali musician',
    optionAVotes: 372,
    optionBVotes: 628
  },
  {
    id: 'culture-5',
    optionA: 'receive tika from 100 relatives during Dashain',
    optionB: 'give tika to 100 relatives during Dashain',
    optionAVotes: 462,
    optionBVotes: 538
  },
  
  // Daily Life Category
  {
    id: 'daily-1',
    optionA: 'live without electricity for a month',
    optionB: 'live without water for 5 days',
    optionAVotes: 699,
    optionBVotes: 301
  },
  {
    id: 'daily-2',
    optionA: 'speak only Nepali for the rest of your life',
    optionB: 'speak any language but Nepali for the rest of your life',
    optionAVotes: 532,
    optionBVotes: 468
  },
  {
    id: 'daily-3',
    optionA: 'be caught in a sudden monsoon rain without an umbrella',
    optionB: 'be caught in Kathmandu dust storm without a mask',
    optionAVotes: 843,
    optionBVotes: 157
  },
  {
    id: 'daily-5',
    optionA: 'work in Thamel shops during peak tourist season',
    optionB: 'work as a porter on the Everest Base Camp trek',
    optionAVotes: 621,
    optionBVotes: 379
  },
  
  // History Category
  {
    id: 'history-1',
    optionA: 'witness the unification of Nepal by Prithvi Narayan Shah',
    optionB: 'witness the signing of the 2015 Constitution',
    optionAVotes: 765,
    optionBVotes: 235
  },
  {
    id: 'history-2',
    optionA: 'be present during the construction of Pashupatinath Temple',
    optionB: 'be present during the construction of Swayambhunath Stupa',
    optionAVotes: 477,
    optionBVotes: 523
  },
  {
    id: 'history-3',
    optionA: 'meet Araniko and learn about his architectural genius',
    optionB: 'meet Bhrikuti and learn about her influence in Tibet',
    optionAVotes: 413,
    optionBVotes: 587
  },
  {
    id: 'history-4',
    optionA: 'live during the Malla period',
    optionB: 'live during the early Shah period',
    optionAVotes: 614,
    optionBVotes: 386
  },
  {
    id: 'history-5',
    optionA: 'be a royal courtier in medieval Nepal',
    optionB: 'be a Buddhist monk in ancient Nepal',
    optionAVotes: 398,
    optionBVotes: 602
  },
  
  // Hypothetical Category
  {
    id: 'hypothetical-1',
    optionA: 'have the ability to speak every Nepali language and dialect',
    optionB: 'be able to cook every Nepali dish perfectly',
    optionAVotes: 497,
    optionBVotes: 503
  },
  {
    id: 'hypothetical-2',
    optionA: 'add one more public holiday to the Nepali calendar',
    optionB: 'remove one existing public holiday from the Nepali calendar',
    optionAVotes: 887,
    optionBVotes: 113
  },
  {
    id: 'hypothetical-3',
    optionA: 'have an endless supply of momo',
    optionB: 'have an endless supply of dal bhat',
    optionAVotes: 634,
    optionBVotes: 366
  },
  {
    id: 'hypothetical-4',
    optionA: 'own a luxury penthouse in Kathmandu',
    optionB: 'own a traditional house with land in a scenic village',
    optionAVotes: 225,
    optionBVotes: 775
  },
  {
    id: 'hypothetical-5',
    optionA: 'be a famous Nepali actor/actress',
    optionB: 'be a respected Nepali politician',
    optionAVotes: 643,
    optionBVotes: 357
  },
  {
    id: 'quirky-2',
    optionA: 'be able to instantly refill any dal bhat plate',
    optionB: 'be able to summon a perfect cup of chiya anytime, anywhere',
    optionAVotes: 480,
    optionBVotes: 520
  },
  {
    id: 'quirky-3',
    optionA: 'accidentally wear your chappals on the wrong feet for an entire day in public',
    optionB: 'accidentally call a respected elder "tँ" (tã) instead of "तपाईं" (tapāī̃) loudly',
    optionAVotes: 710,
    optionBVotes: 290
  },
  {
    id: 'quirky-4',
    optionA: 'have your scooter horn permanently stuck playing "Resham Firiri"',
    optionB: 'have your phone ringtone permanently stuck as a loud rooster crow',
    optionAVotes: 420,
    optionBVotes: 580
  },
  {
    id: 'quirky-5',
    optionA: 'only be able to communicate using Nepali proverbs',
    optionB: 'only be able to communicate by singing folk dohori verses',
    optionAVotes: 390,
    optionBVotes: 610
  },
  
  {
    id: 'quirky-7',
    optionA: 'have a tika mark that changes color',
    optionB: 'have a dhaka topi that magically keeps you cool in summer and warm in winter',
    optionAVotes: 405,
    optionBVotes: 595
  },
  {
    id: 'quirky-8',
    optionA: 'trip and fall spectacularly during a wedding procession (janti)',
    optionB: 'completely forget the steps during a group cultural dance performance',
    optionAVotes: 540,
    optionBVotes: 460
  },
   {
    id: 'quirky-9',
    optionA: 'be chased by a mischievous monkey in Swayambhunath',
    optionB: 'be persistently followed by a street cow in Pashupatinath',
    optionAVotes: 690,
    optionBVotes: 310
  },
  {
    id: 'quirky-10',
    optionA: 'have your life narrated by Rajesh Hamal',
    optionB: 'have your daily activities commented on by Hari Bansha Acharya',
    optionAVotes: 500,
    optionBVotes: 500
  },

  // --- Food Continued ---
  {
    id: 'food-6',
    optionA: 'eat gundruk everyday',
    optionB: 'eat sinki everyday',
    optionAVotes: 588,
    optionBVotes: 412
  },
  {
    id: 'food-7',
    optionA: 'only drink Mohi (buttermilk)',
    optionB: 'only drink Aila (Newari alcohol)',
    optionAVotes: 720,
    optionBVotes: 280
  },
  {
    id: 'food-8',
    optionA: 'master the art of making perfect round Sel Roti',
    optionB: 'master the art of making 20 different types of Achar',
    optionAVotes: 450,
    optionBVotes: 550
  },
  {
    id: 'food-9',
    optionA: 'eat the spiciest Akabare chilli challenge',
    optionB: 'eat a whole plate of Timmur (Szechuan pepper) achar',
    optionAVotes: 380,
    optionBVotes: 620
  },
  {
    id: 'food-10',
    optionA: 'have an unlimited supply of Wai Wai noodles',
    optionB: 'have an unlimited supply of Sukuti (dried meat)',
    optionAVotes: 530,
    optionBVotes: 470
  },

  // --- Travel Continued ---
  {
    id: 'travel-6',
    optionA: 'ride a yak across the Tibetan plateau',
    optionB: 'ride a rhino (safely!) through Chitwan National Park',
    optionAVotes: 485,
    optionBVotes: 515
  },
  {
    id: 'travel-7',
    optionA: 'get hopelessly lost in the narrow alleys (gallis) of Bhaktapur',
    optionB: 'get stuck on a suspension bridge during high winds',
    optionAVotes: 610,
    optionBVotes: 390
  },
  {
    id: 'travel-8',
    optionA: 'navigate the Ring Road during rush hour on a bicycle',
    optionB: 'take a microbus packed beyond capacity from Kalanki to Ratna Park',
    optionAVotes: 350,
    optionBVotes: 650
  },
  {
    id: 'travel-9',
    optionA: 'spend a night in a haunted Rana palace',
    optionB: 'spend a night alone in a remote mountain monastery',
    optionAVotes: 460,
    optionBVotes: 540
  },
  {
    id: 'travel-10',
    optionA: 'discover a completely unknown ancient temple hidden in the jungle',
    optionB: 'find a secret pristine glacial lake high in the Himalayas',
    optionAVotes: 570,
    optionBVotes: 430
  },

  // --- Culture Continued ---
  {
    id: 'culture-6',
    optionA: 'be able to perfectly play the Madal drum',
    optionB: 'be able to perfectly play the Sarangi',
    optionAVotes: 525,
    optionBVotes: 475
  },
  {
    id: 'culture-7',
    optionA: 'participate in the Gai Jatra parade dressed outrageously',
    optionB: 'participate in throwing colours vigorously during Holi',
    optionAVotes: 410,
    optionBVotes: 590
  },
  {
    id: 'culture-8',
    optionA: 'have a traditional Nepali arranged marriage',
    optionB: 'have a modern Nepali love marriage against family wishes',
    optionAVotes: 630,
    optionBVotes: 370
  },
  {
    id: 'culture-9',
    optionA: 'master the art of Thangka painting',
    optionB: 'master the art of traditional wood carving (Newari style)',
    optionAVotes: 490,
    optionBVotes: 510
  },
   {
    id: 'culture-10',
    optionA: 'live according to all traditional superstitions',
    optionB: 'completely ignore all traditional superstitions',
    optionAVotes: 365,
    optionBVotes: 635
  },

  // --- Daily Life Continued ---
  {
    id: 'daily-6',
    optionA: 'always have perfectly ironed clothes but no electricity to charge your phone',
    optionB: 'always have a fully charged phone but perpetually wrinkled clothes',
    optionAVotes: 440,
    optionBVotes: 560
  },
  {
    id: 'daily-7',
    optionA: 'deal with constant bandhs (strikes) affecting transport',
    optionB: 'deal with constant road construction causing massive detours',
    optionAVotes: 518,
    optionBVotes: 482
  },
  {
    id: 'daily-8',
    optionA: 'have to bargain for the price of everything, everyday (even fixed price shops)',
    optionB: 'never be able to bargain, always paying the first price asked',
    optionAVotes: 750,
    optionBVotes: 250
  },
  {
    id: 'daily-9',
    optionA: 'live next door to relatives who visit unannounced daily',
    optionB: 'live far away from relatives and only see them once a year',
    optionAVotes: 595,
    optionBVotes: 405
  },
  {
    id: 'daily-10',
    optionA: 'face a surprise Nepali language pop quiz every morning',
    optionB: 'face a surprise general knowledge quiz about Nepal every evening',
    optionAVotes: 470,
    optionBVotes: 530
  },

  // --- Nature & Environment ---
  {
    id: 'nature-1',
    optionA: 'be able to communicate with Himalayan birds',
    optionB: 'be able to understand the whispers of the mountain winds',
    optionAVotes: 535,
    optionBVotes: 465
  },
  {
    id: 'nature-2',
    optionA: 'help reforest a barren hillside in Nepal',
    optionB: 'help clean up garbage from a popular trekking trail',
    optionAVotes: 680,
    optionBVotes: 320
  },
  {
    id: 'nature-3',
    optionA: 'witness a rare snowfall in Kathmandu valley',
    optionB: 'experience a perfect, clear view of the Himalayas for a whole week',
    optionAVotes: 310,
    optionBVotes: 690
  },
  {
    id: 'nature-4',
    optionA: 'have the stamina of a Sherpa climbing at high altitude',
    optionB: 'have the knowledge of a local guide about all the flora and fauna',
    optionAVotes: 560,
    optionBVotes: 440
  },
   {
    id: 'nature-5',
    optionA: 'live in a house made entirely of sustainable bamboo',
    optionB: 'live in a traditional mud and stone house',
    optionAVotes: 495,
    optionBVotes: 505
  },

  // --- Tech & Modern Life ---
  {
    id: 'tech-1',
    optionA: 'have super-fast, reliable internet but only usable between 1 AM and 5 AM',
    optionB: 'have slow, unreliable internet available 24/7',
    optionAVotes: 430,
    optionBVotes: 570
  },
  {
    id: 'tech-2',
    optionA: 'only use cash (no digital payments like eSewa/Khalti)',
    optionB: 'only use digital payments (no cash)',
    optionAVotes: 395,
    optionBVotes: 605
  },
  {
    id: 'tech-3',
    optionA: 'rely solely on Tootle/Pathao for all transportation',
    optionB: 'rely solely on public buses/microbuses for all transportation',
    optionAVotes: 580,
    optionBVotes: 420
  },
  {
    id: 'tech-4',
    optionA: 'have your social media feed only show posts from 10 years ago',
    optionB: 'have your social media feed only show posts from politicians',
    optionAVotes: 670,
    optionBVotes: 330
  },
  {
    id: 'tech-5',
    optionA: 'lose your phone charger',
    optionB: 'lose your house keys',
    optionAVotes: 505,
    optionBVotes: 495
  },

  // --- Social & Relationships ---
  {
    id: 'social-1',
    optionA: 'host a huge Dashain feast for 100+ relatives',
    optionB: 'attend 10 different Dashain feasts at relatives\' houses in one day',
    optionAVotes: 455,
    optionBVotes: 545
  },
  {
    id: 'social-2',
    optionA: 'always have to address everyone formally (using tapai/hajur)',
    optionB: 'always have to address everyone informally (using timi/ta)',
    optionAVotes: 625,
    optionBVotes: 375
  },
  {
    id: 'social-3',
    optionA: 'be the main organizer for your local Tole Sudhar Samiti (neighbourhood committee)',
    optionB: 'be the main gossip source for your entire neighbourhood',
    optionAVotes: 550,
    optionBVotes: 450
  },
  {
    id: 'social-4',
    optionA: 'have your parents choose your career path',
    optionB: 'have your parents choose your life partner',
    optionAVotes: 400,
    optionBVotes: 600
  },
  {
    id: 'social-5',
    optionA: 'be stuck in a "chakka jam" (transport strike) with your most annoying relative',
    optionB: 'have a long power cut during a family gathering with all your favourite relatives',
    optionAVotes: 512,
    optionBVotes: 488
  },

  // --- Hypothetical Continued ---
  {
    id: 'hypothetical-6',
    optionA: 'have the power to instantly repair any pothole in Nepal',
    optionB: 'have the power to instantly make any river in Nepal pollution-free',
    optionAVotes: 340,
    optionBVotes: 660
  },
  {
    id: 'hypothetical-7',
    optionA: 'invent a device that translates baby cries into understandable Nepali',
    optionB: 'invent a device that translates animal sounds into understandable Nepali',
    optionAVotes: 478,
    optionBVotes: 522
  },
  {
    id: 'hypothetical-9',
    optionA: 'be able to teleport instantly between Kathmandu and Pokhara',
    optionB: 'be able to fly like a bird over the Annapurnas',
    optionAVotes: 415,
    optionBVotes: 585
  },
   {
    id: 'hypothetical-10',
    optionA: 'bring back one extinct Nepali animal species',
    optionB: 'create one new national park protecting endangered species',
    optionAVotes: 605,
    optionBVotes: 395
  },
  {
    id: 'quirky-new-5',
    optionA: 'Always end up laughing when trying to cry',
    optionB: 'Always start crying when trying to laugh',
    optionAVotes: 0,
    optionBVotes: 0
  },
  {
    id: 'quirky-new-8',
    optionA: 'Always know the movie ending before it happens',
    optionB: 'Always lose the last page while reading a book',
    optionAVotes: 0,
    optionBVotes: 0
  }  
];

/**
 * Gets questions based on the locale
 * @param locale - The current locale (en or np)
 * @returns Array of questions in the appropriate language
 */
export function getQuestionsByLocale(locale: string): WouldYouRatherQuestion[] {
  return locale === 'np' ? nepaliQuestions : englishQuestions;
}

// Nepali translations of the questions (for Nepali language users)
const nepaliQuestions: WouldYouRatherQuestion[] = [
  // Food Category
  {
    id: 'food-1',
    optionA: 'एक वर्षसम्म हरेक दिन मोमो खाने',
    optionB: 'अब कहिल्यै मोमो नखाने',
    optionAVotes: 865,
    optionBVotes: 135
  },
  {
    id: 'food-2',
    optionA: 'जीवनभर नेवारी खाना मात्र खाने',
    optionB: 'जीवनभर थकाली खाना मात्र खाने',
    optionAVotes: 423,
    optionBVotes: 577
  },
  {
    id: 'food-3',
    optionA: 'सधैंका लागि सेल रोटी छोड्ने',
    optionB: 'सधैंका लागि आलु-तामा छोड्ने',
    optionAVotes: 320,
    optionBVotes: 680
  },
  {
    id: 'food-4',
    optionA: 'जीवनभर चिनी नहुने चिया पिउने',
    optionB: 'जीवनभर दूध नहुने चिया पिउने',
    optionAVotes: 289,
    optionBVotes: 711
  },
  {
    id: 'food-5',
    optionA: 'सधैं बफ मोमो मात्र खाने',
    optionB: 'सधैं वेज मोमो मात्र खाने',
    optionAVotes: 521,
    optionBVotes: 479
  },
  {
    id: 'travel-1',
    optionA: 'एभरेस्ट बेस क्याम्प चढ्ने',
    optionB: 'कर्णाली नदीमा पुरै र्‍याफ्टिङ गर्ने',
    optionAVotes: 723,
    optionBVotes: 277
  },
  {
    id: 'travel-2',
    optionA: 'काठमाडौंको ट्राफिकमा ३ घण्टा फस्ने',
    optionB: 'पहाडको मन्दिरमा पुग्न १००० खुड्किला चढ्ने',
    optionAVotes: 245,
    optionBVotes: 755
  },
  {
    id: 'travel-3',
    optionA: 'बिजुली बिना पोखरामा बस्ने',
    optionB: 'इन्टरनेट बिना काठमाडौंमा बस्ने',
    optionAVotes: 657,
    optionBVotes: 343
  },
  {
    id: 'travel-4',
    optionA: 'मनसुनमा अन्नपूर्ण परिक्रमा गर्ने',
    optionB: 'जाडोमा एक महिना डोल्पामा बस्ने',
    optionAVotes: 421,
    optionBVotes: 579
  },
  {
    id: 'travel-5',
    optionA: 'पर्यटकीय मौसममा ठमेलमा स्कुटर चलाउने',
    optionB: 'दशैंमा काठमाडौंदेखि पोखरा भरिएको लोकल बसमा यात्रा गर्ने',
    optionAVotes: 513,
    optionBVotes: 487
  },  
  
  /// Hypothetical Category
{
  id: 'hypothetical-1',
  optionA: 'सबै नेपाली भाषा र भाषाहरू बोल्न सक्ने क्षमता हुने',
  optionB: 'सबै नेपाली परिकार सिद्ध बनाउन सक्ने क्षमता हुने',
  optionAVotes: 497,
  optionBVotes: 503
},
{
  id: 'hypothetical-2',
  optionA: 'नेपाली पात्रोमा एक दिन सार्वजनिक बिदा थप्ने',
  optionB: 'नेपाली पात्रोबाट एक मौजुदा बिदा हटाउने',
  optionAVotes: 887,
  optionBVotes: 113
},
{
  id: 'hypothetical-3',
  optionA: 'अनन्त मोमो आपूर्ति हुने',
  optionB: 'अनन्त दालभात आपूर्ति हुने',
  optionAVotes: 634,
  optionBVotes: 366
},
{
  id: 'hypothetical-4',
  optionA: 'काठमाडौंमा विलासी पेन्टहाउस हुने',
  optionB: 'सुन्दर गाउँमा जमिनसहितको परम्परागत घर हुने',
  optionAVotes: 225,
  optionBVotes: 775
},
{
  id: 'hypothetical-5',
  optionA: 'प्रख्यात नेपाली अभिनेता/अभिनेत्री हुने',
  optionB: 'सम्मानित नेपाली राजनीतिज्ञ बन्ने',
  optionAVotes: 643,
  optionBVotes: 357
},

// Quirky Category
{
  id: 'quirky-2',
  optionA: 'कुनै पनि दालभातको थाल तुरुन्तै भरिने क्षमता हुने',
  optionB: 'जहाँसुकै, जुनसुकै बेला उत्कृष्ट चिया बनाउन सक्ने क्षमता हुने',
  optionAVotes: 480,
  optionBVotes: 520
},
{
  id: 'quirky-3',
  optionA: 'पूरै दिन गल्तीले उल्टो चप्पल लगाएर हिँड्ने',
  optionB: 'एक सम्मानित वृद्धलाई ठूलो स्वरले "तँ" भन्दिने',
  optionAVotes: 710,
  optionBVotes: 290
},
{
  id: 'quirky-4',
  optionA: 'स्कुटरको हर्न सधैं "रेशम फिरिरी" मात्र हुने',
  optionB: 'फोनको रिङ्टोन सधैं ठूलो स्वरको भाले बासे हुने',
  optionAVotes: 420,
  optionBVotes: 580
},
{
  id: 'quirky-5',
  optionA: 'नेपाली उखान टुक्का मात्र प्रयोग गरेर कुरा गर्ने',
  optionB: 'लोक दोहोरी गाएर मात्र कुरा गर्ने',
  optionAVotes: 390,
  optionBVotes: 610
},
{
  id: 'quirky-7',
  optionA: 'रंग परिवर्तन हुने टीका लगाउने',
  optionB: 'गर्मीमा चिसो र जाडोमा न्यानो हुने ढाका टोपी लगाउने',
  optionAVotes: 405,
  optionBVotes: 595
},
{
  id: 'quirky-8',
  optionA: 'विवाहको जन्तीमा नराम्ररी लड्ने',
  optionB: 'सांस्कृतिक नृत्यमा नाच्दै गर्दा तरिका पूरै बिर्सने',
  optionAVotes: 540,
  optionBVotes: 460
},
{
  id: 'quirky-9',
  optionA: 'स्वयम्भूमा चकचके बाँदरले लखेट्ने',
  optionB: 'पशुपतिमा सडकको गाईले पछ्याउने',
  optionAVotes: 690,
  optionBVotes: 310
},
{
  id: 'quirky-10',
  optionA: 'तपाईंको जीवन राजेश हमालले वर्णन गर्ने',
  optionB: 'तपाईंको दिनचर्या हरिवंश आचार्यले टिप्पणी गर्ने',
  optionAVotes: 500,
  optionBVotes: 500
},

// Food Continued
{
  id: 'food-8',
  optionA: 'गोलो र पर्फेक्ट सेल रोटी बनाउन निपुण हुने',
  optionB: '५ प्रकारका अचार बनाउन निपुण हुने',
  optionAVotes: 450,
  optionBVotes: 550
},
{
  id: 'food-9',
  optionA: 'अत्यन्त पिरो अकबरे खुर्सानी खाने चुनौती लिने',
  optionB: 'पूरै प्लेट टिम्मुरको अचार खाने',
  optionAVotes: 380,
  optionBVotes: 620
},
{
  id: 'food-10',
  optionA: 'असीमित वाई वाई चाउचाउ पाउने',
  optionB: 'असीमित सुकुटी पाउने',
  optionAVotes: 530,
  optionBVotes: 470
},

  // --- Travel Continued ---
  {
    id: 'travel-7',
    optionA: 'भक्तपुरका साँघुरा गल्लीहरूमा हराउने',
    optionB: 'झ्याप्प हावा चलेको बेला झोलुङ्गे पुलमा फस्ने',
    optionAVotes: 610,
    optionBVotes: 390
  },
  {
    id: 'travel-8',
    optionA: 'भीडभाडको समयमा रिङ रोडमा साइकल चलाउने',
    optionB: 'कलंकीदेखि रत्नपार्कसम्म खचाखच यात्रु भएको माइक्रोबस चढ्ने',
    optionAVotes: 350,
    optionBVotes: 650
  },
  {
    id: 'travel-9',
    optionA: 'भूत लागेको भनिएको राणा दरबारमा एक रात बिताउने',
    optionB: 'दुर्गम पहाडी गुम्बामा एक्लै एक रात बिताउने',
    optionAVotes: 460,
    optionBVotes: 540
  },
  {
    id: 'travel-10',
    optionA: 'जंगलमा लुकेको पुरानो अज्ञात मन्दिर फेला पार्ने',
    optionB: 'हिमालयको माथिल्लो भागमा लुकेको प्राचीन हिमताल पत्ता लगाउने',
    optionAVotes: 570,
    optionBVotes: 430
  },  

  // --- Culture Continued ---
  {
    id: 'culture-6',
    optionA: 'मादल पूरै बजाउन जान्ने',
    optionB: 'सारंगी पूरै बजाउन जान्ने',
    optionAVotes: 525,
    optionBVotes: 475
  },
  {
    id: 'culture-7',
    optionA: 'गाईजात्रा परेडमा अनौठो भेषमा सहभागी हुने',
    optionB: 'होलीमा धमाधम रंग छ्याप्ने काममा सहभागी हुने',
    optionAVotes: 410,
    optionBVotes: 590
  },
  {
    id: 'culture-9',
    optionA: 'थाङ्का चित्रकलामा निपुण हुने',
    optionB: 'नेवारी शैलीको परम्परागत काष्ठकलामा निपुण हुने',
    optionAVotes: 490,
    optionBVotes: 510
  },
  {
    id: 'culture-10',
    optionA: 'सबै परम्परागत अन्धविश्वास पालना गरेर जीवन बिताउने',
    optionB: 'सबै अन्धविश्वासलाई पूर्ण रूपमा बेवास्ता गर्ने',
    optionAVotes: 365,
    optionBVotes: 635
  },  

  // --- Daily Life Continued ---
{
  id: 'daily-8',
  optionA: 'हरेक दिन, हरेक सामान किन्न मोलतोल गर्नैपर्ने',
  optionB: 'कहिल्यै मोलतोल गर्न नसक्ने, सधैं सोधेको पहिलो मूल्य तिर्नुपर्ने',
  optionAVotes: 750,
  optionBVotes: 250
},
{
  id: 'daily-9',
  optionA: 'हरेक दिन बिना जानकारी आउने आफन्तसँग बस्ने',
  optionB: 'आफन्तबाट टाढा बस्ने र वर्षमा एकचोटि मात्र भेट्ने',
  optionAVotes: 595,
  optionBVotes: 405
},
{
  id: 'daily-10',
  optionA: 'हरेक बिहान अचानक नेपाली भाषाको परीक्षा दिनुपर्ने',
  optionB: 'हरेक साँझ नेपालबारे सामान्य ज्ञानको परीक्षा दिनुपर्ने',
  optionAVotes: 470,
  optionBVotes: 530
},

// --- Nature & Environment ---
{
  id: 'nature-2',
  optionA: 'नेपालका नाङ्गा डाँडामा रुख रोप्न सहयोग गर्ने',
  optionB: 'लोकप्रिय पदमार्गहरू सफा गर्न सहयोग गर्ने',
  optionAVotes: 680,
  optionBVotes: 320
},
{
  id: 'nature-3',
  optionA: 'काठमाडौं उपत्यकामा दुर्लभ हिमपात हेर्ने',
  optionB: 'पूरा हप्ता हिमालयको सफा दृश्य अनुभव गर्ने',
  optionAVotes: 310,
  optionBVotes: 690
},
{
  id: 'nature-4',
  optionA: 'उचाइमा चढ्न शेर्पाझैँ सहनशक्ति हुने',
  optionB: 'सबै वनस्पति र जनावरबारे गाइडझैँ ज्ञान हुने',
  optionAVotes: 560,
  optionBVotes: 440
},
{
  id: 'nature-5',
  optionA: 'पूर्ण रूपमा दिगो बाँसको घरमा बस्ने',
  optionB: 'माटो र ढुङ्गाको परम्परागत घरमा बस्ने',
  optionAVotes: 495,
  optionBVotes: 505
},
  // --- Tech & Modern Life ---
  {
    id: 'tech-1',
    optionA: 'धेरै छिटो र भरपर्दो इन्टरनेट हुने तर बिहान १ देखि ५ बजेसम्म मात्र चल्ने',
    optionB: 'ढिलो र अविश्वसनीय इन्टरनेट हुने तर २४/७ उपलब्ध हुने',
    optionAVotes: 430,
    optionBVotes: 570
  },
  {
    id: 'tech-2',
    optionA: 'सधैं नगद मात्र प्रयोग गर्ने (ईसेवा/खल्ती नचलाउने)',
    optionB: 'सधैं डिजिटल भुक्तानी मात्र प्रयोग गर्ने (नगद नचलाउने)',
    optionAVotes: 395,
    optionBVotes: 605
  },
  {
    id: 'tech-3',
    optionA: 'सबै यातायातका लागि टुटल/पठाओमा मात्र भर पर्ने',
    optionB: 'सबै यातायातका लागि सार्वजनिक बस/माइक्रोबसमा मात्र भर पर्ने',
    optionAVotes: 580,
    optionBVotes: 420
  },
  {
    id: 'tech-4',
    optionA: 'सामाजिक सञ्जालमा १० वर्ष पुराना पोस्टहरू मात्र देखिने',
    optionB: 'सामाजिक सञ्जालमा राजनीतिज्ञहरूका पोस्टहरू मात्र देखिने',
    optionAVotes: 670,
    optionBVotes: 330
  },
  
  // --- Social & Relationships ---
  {
    id: 'social-2',
    optionA: 'सधैं सबैलाई "तपाईं/हजुर" भनेर सम्बोधन गर्नुपर्ने',
    optionB: 'सधैं सबैलाई "तिमी/तँ" भनेर सम्बोधन गर्नुपर्ने',
    optionAVotes: 625,
    optionBVotes: 375
  },
  {
    id: 'social-3',
    optionA: 'आफ्नो टोल सुधार समितिको मुख्य आयोजक हुने',
    optionB: 'छिमेकभरि गफ दिने मुख्य स्रोत बन्ने',
    optionAVotes: 550,
    optionBVotes: 450
  },
  {
    id: 'social-5',
    optionA: 'दिक्क लाग्ने आफन्तसँग "चक्का जाम" मा फस्ने',
    optionB: 'मनपर्ने आफन्तहरूसँग जमघट गर्दा लामो समय बत्ती जाने',
    optionAVotes: 512,
    optionBVotes: 488
  },
  
  // --- Hypothetical Continued ---
  {
    id: 'hypothetical-6',
    optionA: 'नेपालको जुनसुकै खाल्डो तुरुन्तै पुर्ने शक्ति हुने',
    optionB: 'नेपालको जुनसुकै नदी सफा गर्ने शक्ति हुने',
    optionAVotes: 340,
    optionBVotes: 660
  },
  {
    id: 'hypothetical-7',
    optionA: 'बच्चाको रुवाइ नेपाली भाषामा अनुवाद गर्ने यन्त्र बनाउने',
    optionB: 'जनावरको आवाज नेपाली भाषामा अनुवाद गर्ने यन्त्र बनाउने',
    optionAVotes: 478,
    optionBVotes: 522
  },
  {
    id: 'hypothetical-8',
    optionA: 'विश्वमा सफल नेपाली चिया ब्रान्ड स्थापना गर्ने',
    optionB: 'अनलाइनमा सफल नेपाली हस्तकला बजार स्थापना गर्ने',
    optionAVotes: 533,
    optionBVotes: 467
  },
  {
    id: 'hypothetical-9',
    optionA: 'काठमाडौं–पोखरा बीच तुरुन्तै टेलिपोर्ट गर्न सक्ने हुने',
    optionB: 'अन्नपूर्णमाथि चरा झैं उड्न सक्ने हुने',
    optionAVotes: 415,
    optionBVotes: 585
  },
  {
    id: 'hypothetical-10',
    optionA: 'विलुप्त भएको कुनै नेपाली जनावर प्रजाति फर्काउने',
    optionB: 'संकटापन्न प्रजातिहरूको संरक्षण गर्न नयाँ राष्ट्रिय निकुञ्ज बनाउने',
    optionAVotes: 605,
    optionBVotes: 395
  },
  {
    id: 'quirky-new-5',
    optionA: 'सधैं रुन खोज्दा हाँसो निस्कने',
    optionB: 'सधैं हाँस्न खोज्दा रुवाबासी सुरु हुने',
    optionAVotes: 0,
    optionBVotes: 0
  },
  {
    id: 'quirky-new-8',
    optionA: 'हरेक सिनेमा हेर्दा अन्त्य पहिले नै थाहा पाउने',
    optionB: 'हरेक पुस्तक पढ्दा अन्तिम पाना नै हराउने',
    optionAVotes: 0,
    optionBVotes: 0
  },
];  