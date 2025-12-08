// src/app/data/logo-quiz/getLogos.ts

export interface Logo {
  id: string;
  name: string;
  imagePath: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  acceptableAnswers: string[];
}

// Sample logo database
const logoData: Record<string, Logo[]> = {
    en: [
      {
        id: 'ncell',
        name: 'Ncell',
        imagePath: '/yo-chineu/ncell.png',
        difficulty: 'easy',
        category: 'telecom',
        acceptableAnswers: ['Ncell', 'N-Cell']
      },
      {
        id: 'nabil_bank',
        name: 'Nabil Bank',
        imagePath: '/yo-chineu/nabil-bank.png',
        difficulty: 'medium',
        category: 'banking',
        acceptableAnswers: ['Nabil Bank', 'Nabil', 'NABIL']
      },
      {
        id: 'buddha_air',
        name: 'Buddha Air',
        imagePath: '/yo-chineu/buddha-air.png',
        difficulty: 'medium',
        category: 'airline',
        acceptableAnswers: ['Buddha','Buddha Air', 'Buddha Airlines']
      },
      {
        id: 'tata',
        name: 'Tata',
        imagePath: '/yo-chineu/tata.jpg',
        difficulty: 'easy',
        category: 'automotive',
        acceptableAnswers: ['Tata', 'Tata Motors', 'TATA']
      },
      {
        id: 'wai_wai',
        name: 'Wai Wai',
        imagePath: '/yo-chineu/wai-wai.png',
        difficulty: 'easy',
        category: 'food',
        acceptableAnswers: ['Wai Wai', 'WaiWai', 'Wai-Wai']
      },
      {
        id: 'cg',
        name: 'CG',
        imagePath: '/yo-chineu/cg.png',
        difficulty: 'medium',
        category: 'conglomerate',
        acceptableAnswers: ['CG', 'Chaudhary Group', 'CG Group']
      },
      {
        id: 'dish_home',
        name: 'Dish Home',
        imagePath: '/yo-chineu/dish-home.png',
        difficulty: 'medium',
        category: 'cable',
        acceptableAnswers: ['Dish Home', 'DishHome']
      },
      {
        id: 'ntc',
        name: 'Nepal Telecom',
        imagePath: '/yo-chineu/ntc.jpg',
        difficulty: 'easy',
        category: 'telecom',
        acceptableAnswers: ['Nepal Telecom', 'NTC', 'Nepal Doorsanchar']
      },
      {
        id: 'himalayan_bank',
        name: 'Himalayan Bank',
        imagePath: '/yo-chineu/hbl.png',
        difficulty: 'medium',
        category: 'banking',
        acceptableAnswers: ['Himalayan Bank', 'HBL', 'Himalayan Bank Limited']
      },
      {
        id: 'yeti_airlines',
        name: 'Yeti Airlines',
        imagePath: '/yo-chineu/yeti-air.png',
        difficulty: 'medium',
        category: 'airline',
        acceptableAnswers: ['Yeti Airlines', 'Yeti', 'Yeti Air']
      },
      {
        id: 'kumari_bank',
        name: 'Kumari Bank',
        imagePath: '/yo-chineu/kumari-bank.png',
        difficulty: 'hard',
        category: 'banking',
        acceptableAnswers: ['Kumari Bank', 'Kumari', 'Kumari Bank Limited']
      },
      {
        id: 'laxmi_bank',
        name: 'Laxmi Bank',
        imagePath: '/yo-chineu/laxmi-bank.jpg',
        difficulty: 'hard',
        category: 'banking',
        acceptableAnswers: ['Laxmi Bank', 'Laxmi', 'Lakshmi Bank']
      },
      {
        id: 'nic_asia',
        name: 'NIC Asia Bank',
        imagePath: '/yo-chineu/nic-asia.png',
        difficulty: 'hard',
        category: 'banking',
        acceptableAnswers: ['NIC Asia', 'NIC Asia Bank', 'NIC']
      },
      {
        id: 'nepal_investment_bank',
        name: 'Nepal Investment Bank',
        imagePath: '/yo-chineu/nimb-bank.png',
        difficulty: 'hard',
        category: 'banking',
        acceptableAnswers: ['Nepal Investment Bank', 'NIBL', 'Nepal Investment', 'Investment Bank']
      },
      {
        id: 'gorkha_brewery',
        name: 'Gorkha Brewery',
        imagePath: '/yo-chineu/gorkha-brewery.png',
        difficulty: 'medium',
        category: 'beverage',
        acceptableAnswers: ['Gorkha Brewery', 'Gorkha', 'Gorkha Beer']
      },
      {
        id: 'esewa',
        name: 'eSewa',
        imagePath: '/yo-chineu/esewa.jpg',
        difficulty: 'easy',
        category: 'fintech',
        acceptableAnswers: ['eSewa', 'e-Sewa', 'E Sewa']
      },
      {
        id: 'khalti',
        name: 'Khalti',
        imagePath: '/yo-chineu/khalti.png',
        difficulty: 'medium',
        category: 'fintech',
        acceptableAnswers: ['Khalti', 'Khalti Digital Wallet']
      },
      {
        id: 'worldlink',
        name: 'WorldLink',
        imagePath: '/yo-chineu/worldlink.png',
        difficulty: 'easy',
        category: 'internet',
        acceptableAnswers: ['WorldLink', 'World Link', 'Worldlink Communications']
      },
      {
        id: 'siddhartha_bank',
        name: 'Siddhartha Bank',
        imagePath: '/yo-chineu/siddhartha-bank.jpg',
        difficulty: 'hard',
        category: 'banking',
        acceptableAnswers: ['Siddhartha Bank', 'Siddhartha', 'Siddhartha Bank Limited']
      },
      {
        id: 'khukuri_rum',
        name: 'Khukuri Rum',
        imagePath: '/yo-chineu/khukuri-rum.png',
        difficulty: 'medium',
        category: 'beverage',
        acceptableAnswers: ['Khukuri Rum', 'Khukuri', 'Khukuri Nepal']
      }
    ],
    np: [
      {
        id: 'ncell',
        name: 'एनसेल',
        imagePath: '/yo-chineu/ncell.png',
        difficulty: 'easy',
        category: 'दूरसञ्चार',
        acceptableAnswers: ['एनसेल', 'Ncell', 'N-Cell']
      },
      {
        id: 'nabil_bank',
        name: 'नबिल बैंक',
        imagePath: '/yo-chineu/nabil-bank.png',
        difficulty: 'medium',
        category: 'बैंकिङ',
        acceptableAnswers: ['नबिल बैंक', 'नबिल', 'Nabil Bank', 'NABIL']
      },
      {
        id: 'buddha_air',
        name: 'बुद्ध एयर',
        imagePath: '/yo-chineu/buddha-air.png',
        difficulty: 'medium',
        category: 'हवाई सेवा',
        acceptableAnswers: ['बुद्ध एयर', 'Buddha Air', 'बुद्ध एयरलाइन्स']
      },
      {
        id: 'tata',
        name: 'टाटा',
        imagePath: '/yo-chineu/tata.jpg',
        difficulty: 'easy',
        category: 'सवारी साधन',
        acceptableAnswers: ['टाटा', 'Tata', 'टाटा मोटर्स', 'TATA']
      },
      {
        id: 'wai_wai',
        name: 'वाइ वाइ',
        imagePath: '/yo-chineu/wai-wai.png',
        difficulty: 'easy',
        category: 'खाद्य',
        acceptableAnswers: ['वाइ वाइ', 'Wai Wai', 'वाइवाइ', 'Wai-Wai']
      },
      {
        id: 'cg',
        name: 'सीजी',
        imagePath: '/yo-chineu/cg.png',
        difficulty: 'medium',
        category: 'समूह',
        acceptableAnswers: ['सीजी', 'चौधरी समूह', 'CG', 'Chaudhary Group']
      },
      {
        id: 'dish_home',
        name: 'डिश होम',
        imagePath: '/yo-chineu/dish-home.png',
        difficulty: 'medium',
        category: 'केबल',
        acceptableAnswers: ['डिश होम', 'Dish Home', 'डिशहोम']
      },
      {
        id: 'ntc',
        name: 'नेपाल टेलिकम',
        imagePath: '/yo-chineu/ntc.jpg',
        difficulty: 'easy',
        category: 'दूरसञ्चार',
        acceptableAnswers: ['नेपाल टेलिकम', 'NTC', 'नेपाल दूरसञ्चार']
      },
      {
        id: 'himalayan_bank',
        name: 'हिमालयन बैंक',
        imagePath: '/yo-chineu/hbl.png',
        difficulty: 'medium',
        category: 'बैंकिङ',
        acceptableAnswers: ['हिमालयन बैंक', 'HBL', 'हिमालयन बैंक लिमिटेड', 'Himalayan Bank']
      },
      {
        id: 'yeti_airlines',
        name: 'यति एयरलाइन्स',
        imagePath: '/yo-chineu/yeti-air.png',
        difficulty: 'medium',
        category: 'हवाई सेवा',
        acceptableAnswers: ['यति एयरलाइन्स', 'Yeti Airlines', 'यति']
      },
      {
        id: 'kumari_bank',
        name: 'कुमारी बैंक',
        imagePath: '/yo-chineu/kumari-bank.png',
        difficulty: 'hard',
        category: 'बैंकिङ',
        acceptableAnswers: ['कुमारी बैंक', 'कुमारी', 'Kumari Bank', 'kumari', 'kumari bank', 'कुमारी बैंक लिमिटेड']
      },
      {
        id: 'laxmi_bank',
        name: 'लक्ष्मी बैंक',
        imagePath: '/yo-chineu/laxmi-bank.jpg',
        difficulty: 'hard',
        category: 'बैंकिङ',
        acceptableAnswers: ['लक्ष्मी बैंक', 'लक्ष्मी', 'Laxmi Bank']
      },
      {
        id: 'nic_asia',
        name: 'एनआईसी एशिया बैंक',
        imagePath: '/yo-chineu/nic-asia.png',
        difficulty: 'hard',
        category: 'बैंकिङ',
        acceptableAnswers: ['एनआईसी एशिया', 'एनआईसी एशिया बैंक', 'NIC Asia', 'NIC']
      },
      {
        id: 'nepal_investment_bank',
        name: 'नेपाल इन्भेस्टमेन्ट बैंक',
        imagePath: '/yo-chineu/nimb-bank.png',
        difficulty: 'hard',
        category: 'बैंकिङ',
        acceptableAnswers: ['नेपाल इन्भेस्टमेन्ट बैंक', 'NIBL', 'नेपाल इन्भेस्टमेन्ट', 'Nepal Investment Bank']
      },
      {
        id: 'gorkha_brewery',
        name: 'गोरखा ब्रुअरी',
        imagePath: '/yo-chineu/gorkha-brewery.png',
        difficulty: 'medium',
        category: 'पेय पदार्थ',
        acceptableAnswers: ['गोरखा ब्रुअरी', 'गोरखा', 'Gorkha Brewery', 'गोरखा बियर']
      },
      {
        id: 'esewa',
        name: 'ई-सेवा',
        imagePath: '/yo-chineu/esewa.jpg',
        difficulty: 'easy',
        category: 'फिन्टेक',
        acceptableAnswers: ['ई-सेवा', 'eSewa', 'ई सेवा', 'e-Sewa']
      },
      {
        id: 'khalti',
        name: 'खल्ती',
        imagePath: '/yo-chineu/khalti.png',
        difficulty: 'medium',
        category: 'फिन्टेक',
        acceptableAnswers: ['खल्ती', 'Khalti', 'खल्ती डिजिटल वालेट']
      },
      {
        id: 'worldlink',
        name: 'वर्ल्डलिङ्क',
        imagePath: '/yo-chineu/worldlink.png',
        difficulty: 'easy',
        category: 'इन्टरनेट',
        acceptableAnswers: ['वर्ल्डलिङ्क', 'WorldLink', 'वर्ल्ड लिङ्क', 'वर्ल्डलिङ्क कम्युनिकेसन्स']
      },
      {
        id: 'siddhartha_bank',
        name: 'सिद्धार्थ बैंक',
        imagePath: '/yo-chineu/siddhartha-bank.jpg',
        difficulty: 'hard',
        category: 'बैंकिङ',
        acceptableAnswers: ['सिद्धार्थ बैंक', 'सिद्धार्थ', 'Siddhartha Bank', 'सिद्धार्थ बैंक लिमिटेड']
      },
      {
        id: 'khukuri_rum',
        name: 'खुकुरी रम',
        imagePath: '/yo-chineu/khukuri-rum.png',
        difficulty: 'medium',
        category: 'पेय पदार्थ',
        acceptableAnswers: ['खुकुरी रम', 'खुकुरी', 'Khukuri Rum', 'खुकुरी नेपाल']
      }
    ]
  };
  
  // Get logos based on locale
  export function getLogosByLocale(locale: string = 'en'): Logo[] {
    return logoData[locale] || logoData.en;
  }
  
  // Get logo by ID and locale
  export function getLogoById(id: string, locale: string = 'en'): Logo | null {
    const logos = getLogosByLocale(locale);
    return logos.find(logo => logo.id === id) || null;
  }
  
  // Export a specific difficulty level
  export function getLogosByDifficulty(difficulty: string, locale: string = 'en'): Logo[] {
    const logos = getLogosByLocale(locale);
    return logos.filter(logo => logo.difficulty === difficulty);
  }
  
  // Export logos by category
  export function getLogosByCategory(category: string, locale: string = 'en'): Logo[] {
    const logos = getLogosByLocale(locale);
    return logos.filter(logo => logo.category === category);
  }
