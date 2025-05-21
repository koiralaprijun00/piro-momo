import { Temple } from './temple';

export const templesEn: Temple[] = [
  {
    id: "pashupatinath",
    name: "Pashupatinath Temple",
    location: "Kathmandu",
    type: "Hindu Temple",
    built: "5th century",
    deity: "Lord Shiva",
    description: "One of the most sacred Hindu temples dedicated to Lord Shiva, located on the banks of the Bagmati River.",
    imagePath: "/images/temples/pashupatinath.jpg",
    alternativeNames: ["Pashupati Temple"],
    acceptableAnswers: ["pashupatinath", "pashupati","pase", "pashupati temple", "pashupatinath temple"]
  },
  {
    id: "swayambhunath",
    name: "Swayambhunath Stupa",
    location: "Kathmandu",
    type: "Buddhist Stupa",
    built: "5th century",
    description: "Also known as the Monkey Temple, this ancient religious complex sits atop a hill in the Kathmandu Valley.",
    imagePath: "/images/temples/swayambhunath.jpg",
    alternativeNames: ["Monkey Temple"],
    acceptableAnswers: ["swayambhunath", "swayambhu", "swayambhu stupa", "swayambhunath stupa", "monkey temple"]
  },
  {
    id: "boudhanath",
    name: "Boudhanath Stupa",
    location: "Kathmandu",
    type: "Buddhist Stupa",
    built: "14th century",
    description: "One of the largest stupas in Nepal and a UNESCO World Heritage Site.",
    imagePath: "/images/temples/boudhanath.jpg",
    acceptableAnswers: ["boudhanath", "boudha", "boudha stupa", "boudhanath stupa"]
  },
  {
    id: "changu-narayan",
    name: "Changu Narayan Temple",
    location: "Bhaktapur",
    type: "Hindu Temple",
    built: "4th century",
    deity: "Lord Vishnu",
    description: "The oldest Hindu temple in the Kathmandu Valley, dedicated to Lord Vishnu.",
    imagePath: "/images/temples/changu-narayan.jpg",
    acceptableAnswers: ["changu narayan", "changu", "changu temple", "changu narayan temple"]
  },
  {
    id: "dakshinkali",
    name: "Dakshinkali Temple",
    location: "Kathmandu",
    type: "Hindu Temple",
    deity: "Goddess Kali",
    description: "A significant temple dedicated to the goddess Kali, known for its animal sacrifices.",
    imagePath: "/images/temples/dakshinkali.jpg",
    acceptableAnswers: ["dakshinkali", "dakshin kali", "dakshin kali temple", "dakshinkali temple"]
  },
  {
    id: "budhanilkantha",
    name: "Budhanilkantha Temple",
    location: "Kathmandu",
    type: "Hindu Temple",
    deity: "Lord Vishnu",
    description: "Famous for its large reclining statue of Lord Vishnu floating in a tank of water.",
    imagePath: "/images/temples/budhanilkantha.jpg",
    acceptableAnswers: ["budhanilkantha", "budha nilkantha", "budha nilkantha temple", "budhanilkantha temple"]
  },
  {
    id: "muktinath",
    name: "Muktinath Temple",
    location: "Mustang",
    type: "Hindu and Buddhist Temple",
    deity: "Lord Vishnu",
    description: "A sacred site for both Hindus and Buddhists, known for its natural gas flames and 108 water spouts.",
    imagePath: "/images/temples/muktinath.jpg",
    alternativeNames: ["Chumig Gyatsa"],
    acceptableAnswers: ["muktinath", "mukti nath", "mukti nath temple", "muktinath temple", "chumig gyatsa"]
  },
  {
    id: "janaki-mandir",
    name: "Janaki Mandir",
    location: "Janakpur",
    type: "Hindu Temple",
    deity: "Goddess Sita",
    built: "1910 AD",
    description: "A beautiful temple dedicated to Goddess Sita, the birthplace of Sita and a significant pilgrimage site.",
    imagePath: "/images/temples/janaki-mandir.jpg",
    alternativeNames: ["Nau Lakha Mandir"],
    acceptableAnswers: ["janaki mandir", "janaki temple", "nau lakha mandir", "nau lakha temple"]
  },
  {
    id: "gorkha-durbar",
    name: "Gorkha Durbar",
    location: "Gorkha",
    type: "Hindu Temple",
    deity: "Goddess Kali and Gorakhnath",
    description: "A historical fort and temple complex with significant religious and historical importance.",
    imagePath: "/images/temples/gorkha-durbar.jpg",
    acceptableAnswers: ["gorkha durbar", "gorkha palace", "gorkha temple"]
  },
  {
    id: "pathivara-devi-temple",
    name: "Pathivara Devi Temple",
    location: "Taplejung",
    type: "Hindu Temple",
    deity: "Goddess Pathivara",
    description: "A highly revered pilgrimage site believed to fulfill the wishes of devotees.",
    imagePath: "/images/temples/pathivara.jpg",
    acceptableAnswers: ["pathivara", "pathibara", "pathivara devi", "pathibara devi", "pathivara temple", "pathibara temple"]
  },
  {
    id: "bindhyabasini-temple",
    name: "Bindhyabasini Temple",
    location: "Pokhara",
    type: "Hindu Temple",
    deity: "Goddess Bindhyabasini",
    description: "A significant Shakti Peetha in Pokhara, dedicated to Goddess Bindhyabasini.",
    imagePath: "/images/temples/bindhyabasini.jpg",
    acceptableAnswers: ["bindhyabasini", "bindhyabasini", "bindhyabasini temple", "bindhya basini", "bindhya basini temple"]
  },
  {
    id: "tal-barahi-temple",
    name: "Tal Barahi Temple",
    location: "Pokhara",
    type: "Hindu Temple",
    deity: "Goddess Varahi",
    description: "A two-storied pagoda temple located on a small island in Phewa Lake.",
    imagePath: "/images/temples/tal-barahi.jpg",
    alternativeNames: ["Lake Temple"],
    acceptableAnswers: ["tal barahi", "tal barahi temple", "lake temple", "phewa lake temple"]
  },
  {
    id: "doleshwor-mahadev-temple",
    name: "Doleshwor Mahadev Temple",
    location: "Bhaktapur",
    type: "Hindu Temple",
    deity: "Lord Shiva",
    description: "Believed by some to be the head part of the Kedarnath Jyotirlinga.",
    imagePath: "/images/temples/doleshwor-mahadev.jpg",
    acceptableAnswers: ["doleshwor mahadev",  "doleshwor", "doleshwor temple", "doleshwor mahadev temple"]
  },
  {
    id: "koteshwor-mahadev-temple",
    name: "Koteshwor Mahadev Temple",
    location: "Kathmandu",
    type: "Hindu Temple",
    deity: "Lord Shiva",
    description: "A popular Shiva temple in the eastern part of Kathmandu.",
    imagePath: "/images/temples/koteshwor-mahadev.jpg",
    acceptableAnswers: ["koteshwor mahadev", "koteshwor", "koteshwor temple", "koteshwor mahadev temple", "koteshwor mahadev temple"]
  },
  {
    id: "uma-maheshwor-temple",
    name: "Uma Maheshwor Temple (Kirtipur)",
    location: "Kirtipur",
    type: "Hindu Temple",
    deity: "Lord Shiva and Goddess Parvati",
    description: "A beautiful Newari-style temple offering panoramic views of the Kathmandu Valley.",
    imagePath: "/images/temples/uma-maheshwor-kirtipur.jpg",
    acceptableAnswers: ["uma maheshwor", "uma", "uma maheshwor temple", "kirtipur uma maheshwor", "kirtipur temple"]
  },
  {
    id: "bajrayogini-temple",
    name: "Bajrayogini Temple",
    location: "Sankhu",
    type: "Hindu Temple",
    deity: "Goddess Bajrayogini",
    description: "A significant tantric temple dedicated to the fierce goddess Bajrayogini.",
    imagePath: "/images/temples/bajrayogini.jpg",
    acceptableAnswers: ["bajrayogini", "bajra yogini", "bajrayogini temple", "bajra yogini temple"]
  },
  {
    id: "hiranya-varna-mahavihar",
    name: "Hiranya Varna Mahavihar",
    location: "Patan",
    type: "Buddhist Monastery",
    built: "12th century",
    description: "Also known as the Golden Temple, renowned for its exquisite golden pagoda.",
    imagePath: "/images/temples/hiranya-varna-mahavihar.jpg",
    alternativeNames: ["Golden Temple"],
    acceptableAnswers: ["hiranya varna mahavihar", "hiranya", "hiranya varna", "golden temple", "hiranya varna temple"]
  },
  {
    id: "guhyeshwari",
    name: "Guhyeshwari Temple",
    location: "Kathmandu",
    type: "Hindu Temple",
    deity: "Goddess Guhyeshwari",
    description: "A sacred temple dedicated to Goddess Guhyeshwari, closely associated with Pashupatinath and important in tantric worship.",
    imagePath: "/images/temples/guhyeshwari.jpg",
    acceptableAnswers: ["guhyeshwari", "guhyeshwari temple"]
  },
  {
    id: "manakamana",
    name: "Manakamana Temple",
    location: "Gorkha",
    type: "Hindu Temple",
    deity: "Goddess Manakamana",
    description: "A famous temple dedicated to Goddess Manakamana, believed to grant wishes to devotees. Accessible by cable car.",
    imagePath: "/images/temples/manakamana.jpg",
    acceptableAnswers: ["manakamana", "manakamana temple"]
  },
  {
    id: "kalinchowk-bhagwati",
    name: "Kalinchowk Bhagwati Temple",
    location: "Dolakha",
    type: "Hindu Temple",
    deity: "Goddess Bhagwati",
    description: "A popular hilltop temple dedicated to Goddess Bhagwati, visited especially during winter pilgrimage.",
    imagePath: "/images/temples/kalinchowk-bhagwati.jpg",
    acceptableAnswers: ["kalinchowk", "kalinchowk temple", "kalinchowk bhagwati"]
  },
  {
    id: "namo-buddha",
    name: "Namo Buddha Monastery",
    location: "Kavrepalanchok",
    type: "Buddhist Monastery",
    description: "A major Buddhist pilgrimage site featuring a large stupa and serene surroundings.",
    imagePath: "/images/temples/namo-buddha.jpg",
    acceptableAnswers: ["namo buddha", "namo buddha monastery"]
  },
  {
    id: "krishna-mandir-patan",
    name: "Krishna Mandir",
    location: "Patan",
    type: "Hindu Temple",
    deity: "Lord Krishna",
    description: "A historic temple located in Patan Durbar Square, dedicated to Lord Krishna with exquisite stone carvings.",
    imagePath: "/images/temples/krishna-mandir-patan.jpg",
    acceptableAnswers: ["krishna mandir", "krishna mandir patan", "patan krishna temple"]
  },
  {
    id: "bageshwori",
    name: "Bageshwori Temple",
    location: "Nepalgunj",
    type: "Hindu Temple",
    deity: "Goddess Bageshwori",
    description: "An important temple in western Nepal dedicated to Goddess Bageshwori, drawing many devotees especially during festivals.",
    imagePath: "/images/temples/bageshwori.jpg",
    acceptableAnswers: ["bageshwori", "bageshwori temple"]
  },
  {
    id: "barahachhetra",
    name: "Barahachhetra Temple",
    location: "Koshi Tappu",
    type: "Hindu Temple",
    deity: "Lord Vishnu as Baraha",
    description: "An ancient temple and pilgrimage site dedicated to Lord Vishnu in his boar incarnation, located near the Koshi river.",
    imagePath: "/images/temples/barahachhetra.jpg",
    acceptableAnswers: ["barahachhetra", "baraha temple", "barahachhetra temple"]
  }
];

export const templesNp: Temple[] = [
  {
    id: "pashupatinath",
    name: "पशुपतिनाथ मन्दिर",
    location: "काठमाडौं",
    type: "हिन्दू मन्दिर",
    built: "५औं शताब्दी",
    deity: "भगवान शिव",
    description: "बागमती नदीको किनारमा अवस्थित भगवान शिवको समर्पित सबैभन्दा पवित्र हिन्दू मन्दिरहरू मध्ये एक।",
    imagePath: "/images/temples/pashupatinath.jpg",
    alternativeNames: ["पशुपति मन्दिर"],
    acceptableAnswers: ["पशुपतिनाथ", "पशुपति", "पशुपति मन्दिर", "पशुपतिनाथ मन्दिर"]
  },
  {
    id: "swayambhunath",
    name: "स्वयम्भूनाथ स्तुप",
    location: "काठमाडौं",
    type: "बौद्ध स्तुप",
    built: "५औं शताब्दी",
    description: "बाँदर मन्दिरको रूपमा पनि चिनिने यो प्राचीन धार्मिक परिसर काठमाडौं उपत्यकाको पहाडीमा अवस्थित छ।",
    imagePath: "/images/temples/swayambhunath.jpg",
    alternativeNames: ["बाँदर मन्दिर"],
    acceptableAnswers: ["स्वयम्भूनाथ", "स्वयम्भू", "स्वयम्भू स्तुप", "स्वयम्भूनाथ स्तुप", "बाँदर मन्दिर"]
  },
  {
    id: "boudhanath",
    name: "बौद्धनाथ स्तुप",
    location: "काठमाडौं",
    type: "बौद्ध स्तुप",
    built: "१४औं शताब्दी",
    description: "नेपालको सबैभन्दा ठूलो स्तुपहरू मध्ये एक र युनेस्को विश्व सम्पदा स्थल।",
    imagePath: "/images/temples/boudhanath.jpg",
    acceptableAnswers: ["बौद्धनाथ", "बौद्धा", "बौद्धा स्तुप", "बौद्धनाथ स्तुप"]
  },
  {
    id: "changu-narayan",
    name: "चाँगुनारायण मन्दिर",
    location: "भक्तपुर",
    type: "हिन्दू मन्दिर",
    built: "४औं शताब्दी",
    deity: "भगवान विष्णु",
    description: "काठमाडौं उपत्यकाको सबैभन्दा पुरानो हिन्दू मन्दिर, भगवान विष्णुलाई समर्पित।",
    imagePath: "/images/temples/changu-narayan.jpg",
    acceptableAnswers: ["चाँगुनारायण", "चाँगु", "चाँगु मन्दिर", "चाँगुनारायण मन्दिर"]
  },
  {
    id: "dakshinkali",
    name: "दक्षिणकाली मन्दिर",
    location: "काठमाडौं",
    type: "हिन्दू मन्दिर",
    deity: "देवी काली",
    description: "देवी कालीलाई समर्पित एक महत्त्वपूर्ण मन्दिर, जुन यसको पशुबलिको लागि परिचित छ।",
    imagePath: "/images/temples/dakshinkali.jpg",
    acceptableAnswers: ["दक्षिणकाली", "दक्षिण काली", "दक्षिण काली मन्दिर", "दक्षिणकाली मन्दिर"]
  },
  {
    id: "budhanilkantha",
    name: "बुढानीलकण्ठ मन्दिर",
    location: "काठमाडौं",
    type: "हिन्दू मन्दिर",
    deity: "भगवान विष्णु",
    description: "पानीको ट्याङ्कीमा तैरिरहेको भगवान विष्णुको ठूलो मूर्ति लागि प्रसिद्ध।",
    imagePath: "/images/temples/budhanilkantha.jpg",
    acceptableAnswers: ["बुढानीलकण्ठ", "बुढा नीलकण्ठ", "बुढा नीलकण्ठ मन्दिर", "बुढानीलकण्ठ मन्दिर"]
  },
  {
    id: "muktinath",
    name: "मुक्तिनाथ मन्दिर",
    location: "मुस्ताङ",
    type: "हिन्दू र बौद्ध मन्दिर",
    deity: "भगवान विष्णु",
    description: "हिन्दू र बौद्ध दुवैका लागि पवित्र स्थल, यसको प्राकृतिक ग्यासको ज्वाला र १०८ पानीको धाराहरूको लागि परिचित।",
    imagePath: "/images/temples/muktinath.jpg",
    alternativeNames: ["छुमिग ग्यात्सा"],
    acceptableAnswers: ["मुक्तिनाथ", "मुक्ति नाथ", "मुक्ति नाथ मन्दिर", "मुक्तिनाथ मन्दिर", "छुमिग ग्यात्सा"]
  },
  {
    id: "janaki-mandir",
    name: "जानकी मन्दिर",
    location: "जनकपुर",
    type: "हिन्दू मन्दिर",
    deity: "देवी सीता",
    built: "सन् १९१०",
    description: "देवी सीतालाई समर्पित सुन्दर मन्दिर, सीताको जन्मस्थान र एक महत्त्वपूर्ण तीर्थस्थल।",
    imagePath: "/images/temples/janaki-mandir.jpg",
    alternativeNames: ["नौ लाख मन्दिर"],
    acceptableAnswers: ["जानकी मन्दिर", "जानकी", "नौ लाख मन्दिर", "नौ लाख"]
  },
  {
    id: "gorkha-durbar",
    name: "गोरखा दरबार",
    location: "गोरखा",
    type: "हिन्दू मन्दिर",
    deity: "देवी काली र गोरखनाथ",
    description: "महत्वपूर्ण धार्मिक र ऐतिहासिक महत्त्व भएको ऐतिहासिक किल्ला र मन्दिर परिसर।",
    imagePath: "/images/temples/gorkha-durbar.jpg",
    acceptableAnswers: ["गोरखा दरबार", "गोरखा दरबार मन्दिर", "गोरखा मन्दिर"]
  },
  {
    id: "pathivara-devi-temple",
    name: "पाथीभरा देवी मन्दिर",
    location: "ताप्लेजुङ",
    type: "हिन्दू मन्दिर",
    deity: "देवी पाथीभरा",
    description: "भक्तहरूको मनोकामना पूरा गर्ने विश्वास गरिएको एक उच्च सम्मानित तीर्थस्थल।",
    imagePath: "/images/temples/pathivara.jpg",
    acceptableAnswers: ["पाथीभरा", "पाथिबारा", "पाथीभरा देवी", "पाथिबारा देवी", "पाथीभरा मन्दिर", "पाथिबारा मन्दिर"]
  },
  {
    id: "bindhyabasini-temple",
    name: "विन्ध्यवासिनी मन्दिर",
    location: "पोखरा",
    type: "हिन्दू मन्दिर",
    deity: "देवी विन्ध्यवासिनी",
    description: "पोखराको एक महत्त्वपूर्ण शक्तिपीठ, देवी विन्ध्यवासिनीलाई समर्पित।",
    imagePath: "/images/temples/bindhyabasini.jpg",
    acceptableAnswers: ["विन्ध्यवासिनी", "विन्ध्यवासिनी मन्दिर", "विन्ध्या वासिनी", "विन्ध्या वासिनी मन्दिर"]
  },
  {
    id: "tal-barahi-temple",
    name: "ताल बाराही मन्दिर",
    location: "पोखरा",
    type: "हिन्दू मन्दिर",
    deity: "देवी वाराही",
    description: "फेवा तालको एउटा सानो टापुमा अवस्थित दुई तले प्यागोडा शैलीको मन्दिर।",
    imagePath: "/images/temples/tal-barahi.jpg",
    alternativeNames: ["ताल मन्दिर"],
    acceptableAnswers: ["ताल बाराही", "ताल बाराही मन्दिर", "ताल मन्दिर", "फेवा ताल मन्दिर"]
  },
  {
    id: "doleshwor-mahadev-temple",
    name: "डोलेश्वर महादेव मन्दिर",
    location: "भक्तपुर",
    type: "हिन्दू मन्दिर",
    deity: "भगवान शिव",
    description: "कसै-कसैले यसलाई केदारनाथ ज्योतिर्लिंगको टाउको भाग मानेका छन्।",
    imagePath: "/images/temples/doleshwor-mahadev.jpg",
    acceptableAnswers: ["डोलेश्वर महादेव", "डोलेश्वर", "डोलेश्वर मन्दिर", "डोलेश्वर महादेव मन्दिर"]
  },
  {
    id: "koteshwor-mahadev-temple",
    name: "कोटेश्वर महादेव मन्दिर",
    location: "काठमाडौं",
    type: "हिन्दू मन्दिर",
    deity: "भगवान शिव",
    description: "काठमाडौंको पूर्वी भागमा अवस्थित एक लोकप्रिय शिव मन्दिर।",
    imagePath: "/images/temples/koteshwor-mahadev.jpg",
    acceptableAnswers: ["कोटेश्वर महादेव", "कोटेश्वर", "कोटेश्वर मन्दिर", "कोटेश्वर महादेव मन्दिर"]
  },
  {
    id: "uma-maheshwor-temple",
    name: "उमा महेश्वर मन्दिर (कीर्तिपुर)",
    location: "कीर्तिपुर",
    type: "हिन्दू मन्दिर",
    deity: "भगवान शिव र देवी पार्वती",
    description: "काठमाडौं उपत्यकाको मनोरम दृश्य प्रदान गर्ने एक सुन्दर नेवारी शैलीको मन्दिर।",
    imagePath: "/images/temples/uma-maheshwor-kirtipur.jpg",
    acceptableAnswers: ["उमा महेश्वर", "उमा महेश्वर मन्दिर", "कीर्तिपुर उमा महेश्वर", "कीर्तिपुर मन्दिर"]
  },
  {
    id: "bajrayogini-temple",
    name: "बज्रयोगिनी मन्दिर",
    location: "शंखु",
    type: "हिन्दू मन्दिर",
    deity: "देवी बज्रयोगिनी",
    description: "उग्र देवी बज्रयोगिनीलाई समर्पित एक महत्त्वपूर्ण तान्त्रिक मन्दिर।",
    imagePath: "/images/temples/bajrayogini.jpg",
    acceptableAnswers: ["बज्रयोगिनी", "बज्र योगिनी", "बज्रयोगिनी मन्दिर", "बज्र योगिनी मन्दिर"]
  },
  {
    id: "hiranya-varna-mahavihar",
    name: "हिरण्यवर्ण महाविहार",
    location: "पतथ",
    type: "बौद्ध मन्दिर",
    built: "१२उं शताब्दी",
    deity: "अवालोकितेश्वर",
    description: "एक अद्वितीय प्यागोडा शैलीको ठूलो स्तुप, जुन गोलडा भएको छ।",
    imagePath: "/images/temples/hiranya-varna-mahavihar.jpg",
    acceptableAnswers: ["हिरण्यवर्ण महाविहार", "हिरण्यवर्ण", "सुनको मन्दिर", "हिरण्यवर्ण मन्दिर"]
  },
  {
    id: "guhyeshwari",
    name: "गुह्येश्वरी मन्दिर",
    location: "काठमाडौं",
    type: "हिन्दू मन्दिर",
    deity: "देवी गुह्येश्वरी",
    description: "देवी गुह्येश्वरीलाई समर्पित एक पवित्र मन्दिर, पशुपतिनाथसँग नजिकै सम्बन्धित र तान्त्रिक पूजाको लागि महत्त्वपूर्ण।",
    imagePath: "/images/temples/guhyeshwari.jpg",
    acceptableAnswers: ["गुह्येश्वरी", "गुह्येश्वरी मन्दिर"]
  },
  {
    id: "manakamana",
    name: "मनकामना मन्दिर",
    location: "गोरखा",
    type: "हिन्दू मन्दिर",
    deity: "देवी मनकामना",
    description: "देवी मनकामनालाई समर्पित एक प्रसिद्ध मन्दिर, जसले भक्तहरूको मनोकामना पूरा गर्ने विश्वास गरिन्छ। केबलकारबाट पहुँच योग्य।",
    imagePath: "/images/temples/manakamana.jpg",
    acceptableAnswers: ["मनकामना", "मनकामना मन्दिर"]
  },
  {
    id: "kalinchowk-bhagwati",
    name: "कालिन्चोक भगवती मन्दिर",
    location: "दोलखा",
    type: "हिन्दू मन्दिर",
    deity: "देवी भगवती",
    description: "देवी भगवतीलाई समर्पित एक लोकप्रिय पहाडी मन्दिर, विशेष गरी जाडो यात्राको समयमा भ्रमण गरिने।",
    imagePath: "/images/temples/kalinchowk-bhagwati.jpg",
    acceptableAnswers: ["कालिन्चोक", "कालिन्चोक मन्दिर", "कालिन्चोक भगवती"]
  },
  {
    id: "namo-buddha",
    name: "नमो बुद्ध मठ",
    location: "काभ्रेपलाञ्चोक",
    type: "बौद्ध मठ",
    description: "एक ठूलो स्तुप र शान्त वातावरण भएको एक प्रमुख बौद्ध तीर्थस्थल।",
    imagePath: "/images/temples/namo-buddha.jpg",
    acceptableAnswers: ["नमो बुद्ध", "नमो बुद्ध मठ"]
  },
  {
    id: "krishna-mandir-patan",
    name: "कृष्ण मन्दिर",
    location: "पाटन",
    type: "हिन्दू मन्दिर",
    deity: "भगवान कृष्ण",
    description: "पाटन दरबार क्षेत्रमा अवस्थित एक ऐतिहासिक मन्दिर, भगवान कृष्णलाई समर्पित र उत्कृष्ट पत्थरको नक्कासी भएको।",
    imagePath: "/images/temples/krishna-mandir-patan.jpg",
    acceptableAnswers: ["कृष्ण मन्दिर", "कृष्ण मन्दिर पाटन", "पाटन कृष्ण मन्दिर"]
  },
  {
    id: "bageshwori",
    name: "बागेश्वरी मन्दिर",
    location: "नेपालगन्ज",
    type: "हिन्दू मन्दिर",
    deity: "देवी बागेश्वरी",
    description: "पश्चिम नेपालको एक महत्त्वपूर्ण मन्दिर, देवी बागेश्वरीलाई समर्पित, विशेष गरी उत्सवहरूको समयमा धेरै भक्तहरू आकर्षित गर्ने।",
    imagePath: "/images/temples/bageshwori.jpg",
    acceptableAnswers: ["बागेश्वरी", "बागेश्वरी मन्दिर"]
  },
  {
    id: "barahachhetra",
    name: "बराहक्षेत्र मन्दिर",
    location: "कोशी टप्पु",
    type: "हिन्दू मन्दिर",
    deity: "भगवान विष्णु (बराह अवतार)",
    description: "कोशी नदीको नजिकै अवस्थित भगवान विष्णुको बराह अवतारलाई समर्पित एक प्राचीन मन्दिर र तीर्थस्थल।",
    imagePath: "/images/temples/barahachhetra.jpg",
    acceptableAnswers: ["बराहक्षेत्र", "बराह मन्दिर", "बराहक्षेत्र मन्दिर"]
  }
];