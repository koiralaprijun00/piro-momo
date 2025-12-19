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
      { id: 'ncell', name: 'Ncell', imagePath: '/yo-chineu/ncell.png', difficulty: 'easy', category: 'telecom', acceptableAnswers: ['Ncell', 'N-Cell'] },
      { id: 'nabil_bank', name: 'Nabil Bank', imagePath: '/yo-chineu/nabil-bank.png', difficulty: 'medium', category: 'banking', acceptableAnswers: ['Nabil Bank', 'Nabil', 'NABIL'] },
      { id: 'buddha_air', name: 'Buddha Air', imagePath: '/yo-chineu/buddha-air.png', difficulty: 'medium', category: 'airline', acceptableAnswers: ['Buddha','Buddha Air', 'Buddha Airlines'] },
      { id: 'tata', name: 'Tata', imagePath: '/yo-chineu/tata.jpg', difficulty: 'easy', category: 'automotive', acceptableAnswers: ['Tata', 'Tata Motors', 'TATA'] },
      { id: 'wai_wai', name: 'Wai Wai', imagePath: '/yo-chineu/wai-wai.png', difficulty: 'easy', category: 'food', acceptableAnswers: ['Wai Wai', 'WaiWai', 'Wai-Wai'] },
      { id: 'cg', name: 'CG', imagePath: '/yo-chineu/cg.png', difficulty: 'medium', category: 'conglomerate', acceptableAnswers: ['CG', 'Chaudhary Group', 'CG Group'] },
      { id: 'dish_home', name: 'Dish Home', imagePath: '/yo-chineu/dish-home.png', difficulty: 'medium', category: 'cable', acceptableAnswers: ['Dish Home', 'DishHome'] },
      { id: 'ntc', name: 'Nepal Telecom', imagePath: '/yo-chineu/ntc.jpg', difficulty: 'easy', category: 'telecom', acceptableAnswers: ['Nepal Telecom', 'NTC', 'Nepal Doorsanchar'] },
      { id: 'himalayan_bank', name: 'Himalayan Bank', imagePath: '/yo-chineu/hbl.png', difficulty: 'medium', category: 'banking', acceptableAnswers: ['Himalayan Bank', 'HBL', 'Himalayan Bank Limited'] },
      { id: 'yeti_airlines', name: 'Yeti Airlines', imagePath: '/yo-chineu/yeti-air.png', difficulty: 'medium', category: 'airline', acceptableAnswers: ['Yeti Airlines', 'Yeti', 'Yeti Air'] },
      { id: 'kumari_bank', name: 'Kumari Bank', imagePath: '/yo-chineu/kumari-bank.png', difficulty: 'hard', category: 'banking', acceptableAnswers: ['Kumari Bank', 'Kumari', 'Kumari Bank Limited'] },
      { id: 'laxmi_bank', name: 'Laxmi Bank', imagePath: '/yo-chineu/laxmi-bank.jpg', difficulty: 'hard', category: 'banking', acceptableAnswers: ['Laxmi Bank', 'Laxmi', 'Lakshmi Bank'] },
      { id: 'nic_asia', name: 'NIC Asia Bank', imagePath: '/yo-chineu/nic-asia.png', difficulty: 'hard', category: 'banking', acceptableAnswers: ['NIC Asia', 'NIC Asia Bank', 'NIC'] },
      { id: 'nepal_investment_bank', name: 'Nepal Investment Bank', imagePath: '/yo-chineu/nimb-bank.png', difficulty: 'hard', category: 'banking', acceptableAnswers: ['Nepal Investment Bank', 'NIBL', 'Nepal Investment', 'Investment Bank'] },
      { id: 'gorkha_brewery', name: 'Gorkha Brewery', imagePath: '/yo-chineu/gorkha-brewery.png', difficulty: 'medium', category: 'beverage', acceptableAnswers: ['Gorkha Brewery', 'Gorkha', 'Gorkha Beer'] },
      { id: 'esewa', name: 'eSewa', imagePath: '/yo-chineu/esewa.jpg', difficulty: 'easy', category: 'fintech', acceptableAnswers: ['eSewa', 'e-Sewa', 'E Sewa'] },
      { id: 'khalti', name: 'Khalti', imagePath: '/yo-chineu/khalti.png', difficulty: 'medium', category: 'fintech', acceptableAnswers: ['Khalti', 'Khalti Digital Wallet'] },
      { id: 'worldlink', name: 'WorldLink', imagePath: '/yo-chineu/worldlink.png', difficulty: 'easy', category: 'internet', acceptableAnswers: ['WorldLink', 'World Link', 'Worldlink Communications'] },
      { id: 'siddhartha_bank', name: 'Siddhartha Bank', imagePath: '/yo-chineu/siddhartha-bank.jpg', difficulty: 'hard', category: 'banking', acceptableAnswers: ['Siddhartha Bank', 'Siddhartha', 'Siddhartha Bank Limited'] },
      { id: 'khukuri_rum', name: 'Khukuri Rum', imagePath: '/yo-chineu/khukuri-rum.png', difficulty: 'medium', category: 'beverage', acceptableAnswers: ['Khukuri Rum', 'Khukuri', 'Khukuri Nepal'] },
      // New Logos
      { id: 'pathao', name: 'Pathao', imagePath: '/yo-chineu/pathao.png', difficulty: 'easy', category: 'ride-sharing', acceptableAnswers: ['Pathao'] },
      { id: 'daraz', name: 'Daraz', imagePath: '/yo-chineu/daraz.png', difficulty: 'easy', category: 'ecommerce', acceptableAnswers: ['Daraz'] },
      { id: 'fonepay', name: 'Fonepay', imagePath: '/yo-chineu/fonepay.png', difficulty: 'easy', category: 'fintech', acceptableAnswers: ['Fonepay', 'Fone-Pay'] },
      { id: 'nepal_airlines', name: 'Nepal Airlines', imagePath: '/yo-chineu/nepal-airlines.png', difficulty: 'medium', category: 'airline', acceptableAnswers: ['Nepal Airlines', 'NAC', 'Nepal Air'] },
      { id: 'global_ime', name: 'Global IME Bank', imagePath: '/yo-chineu/global-ime.png', difficulty: 'medium', category: 'banking', acceptableAnswers: ['Global IME', 'Global IME Bank'] },
      { id: 'goldstar', name: 'Goldstar', imagePath: '/yo-chineu/goldstar.png', difficulty: 'easy', category: 'retail', acceptableAnswers: ['Goldstar', 'Goldstar Shoes'] },
      { id: 'kantipur', name: 'Kantipur', imagePath: '/yo-chineu/kantipur.png', difficulty: 'easy', category: 'media', acceptableAnswers: ['Kantipur', 'KMG', 'Kantipur Media Group'] },
      { id: 'ronb', name: 'RONB', imagePath: '/yo-chineu/ronb.png', difficulty: 'easy', category: 'media', acceptableAnswers: ['RONB', 'Routine of Nepal Banda'] },
      { id: 'ime_pay', name: 'IME Pay', imagePath: '/yo-chineu/ime-pay.png', difficulty: 'easy', category: 'fintech', acceptableAnswers: ['IME Pay', 'IMEPay'] },
      { id: 'foodmandu', name: 'Foodmandu', imagePath: '/yo-chineu/foodmandu.png', difficulty: 'medium', category: 'delivery', acceptableAnswers: ['Foodmandu'] },
      { id: 'hamrobazar', name: 'Hamrobazar', imagePath: '/yo-chineu/hamrobazar.png', difficulty: 'medium', category: 'ecommerce', acceptableAnswers: ['Hamrobazar', 'Hamro Bazar'] },
      { id: 'shivam_cement', name: 'Shivam Cement', imagePath: '/yo-chineu/shivam-cement.png', difficulty: 'medium', category: 'construction', acceptableAnswers: ['Shivam', 'Shivam Cement'] },
      { id: 'tuborg', name: 'Tuborg', imagePath: '/yo-chineu/tuborg.png', difficulty: 'easy', category: 'beverage', acceptableAnswers: ['Tuborg', 'Tuborg Beer'] },
      { id: 'carlsberg', name: 'Carlsberg', imagePath: '/yo-chineu/carlsberg.png', difficulty: 'medium', category: 'beverage', acceptableAnswers: ['Carlsberg'] },
      { id: 'dabur', name: 'Dabur', imagePath: '/yo-chineu/dabur.png', difficulty: 'easy', category: 'fmcg', acceptableAnswers: ['Dabur', 'Dabur Nepal'] },
      { id: 'nepal_life', name: 'Nepal Life', imagePath: '/yo-chineu/nepal-life.png', difficulty: 'medium', category: 'insurance', acceptableAnswers: ['Nepal Life', 'Nepal Life Insurance'] },
      { id: 'everest_bank', name: 'Everest Bank', imagePath: '/yo-chineu/everest-bank.png', difficulty: 'medium', category: 'banking', acceptableAnswers: ['Everest Bank', 'EBL', 'Everest'] },
      { id: 'prabhu_bank', name: 'Prabhu Bank', imagePath: '/yo-chineu/prabhu-bank.png', difficulty: 'medium', category: 'banking', acceptableAnswers: ['Prabhu Bank', 'Prabhu'] },
      { id: 'shree_airlines', name: 'Shree Airlines', imagePath: '/yo-chineu/shree-airlines.png', difficulty: 'medium', category: 'airline', acceptableAnswers: ['Shree Airlines', 'Shree'] },
      { id: 'saurya_airlines', name: 'Saurya Airlines', imagePath: '/yo-chineu/saurya-airlines.png', difficulty: 'hard', category: 'airline', acceptableAnswers: ['Saurya Airlines', 'Saurya'] },
      { id: 'sanima_bank', name: 'Sanima Bank', imagePath: '/yo-chineu/sanima-bank.png', difficulty: 'hard', category: 'banking', acceptableAnswers: ['Sanima Bank', 'Sanima'] },
      { id: 'big_mart', name: 'Big Mart', imagePath: '/yo-chineu/big-mart.png', difficulty: 'easy', category: 'retail', acceptableAnswers: ['Big Mart', 'BigMart'] },
      { id: 'citizen_bank', name: 'Citizens Bank', imagePath: '/yo-chineu/citizen-bank.png', difficulty: 'hard', category: 'banking', acceptableAnswers: ['Citizens Bank', 'Citizens'] },
      { id: 'mega_bank', name: 'Mega Bank', imagePath: '/yo-chineu/mega-bank.png', difficulty: 'medium', category: 'banking', acceptableAnswers: ['Mega Bank', 'Mega'] },
      { id: 'machhapuchhre', name: 'Machhapuchhre Bank', imagePath: '/yo-chineu/machhapuchhre.png', difficulty: 'hard', category: 'banking', acceptableAnswers: ['Machhapuchhre', 'Machhapuchhre Bank', 'MBL'] },
      { id: 'vianet', name: 'Vianet', imagePath: '/yo-chineu/vianet.png', difficulty: 'medium', category: 'internet', acceptableAnswers: ['Vianet'] },
      { id: 'sastodeal', name: 'SastoDeal', imagePath: '/yo-chineu/sastodeal.png', difficulty: 'medium', category: 'ecommerce', acceptableAnswers: ['SastoDeal', 'Sasto Deal'] },
      { id: 'indrive', name: 'InDrive', imagePath: '/yo-chineu/indrive.png', difficulty: 'easy', category: 'ride-sharing', acceptableAnswers: ['InDrive', 'inDrive'] },
      { id: 'hamro_patro', name: 'Hamro Patro', imagePath: '/yo-chineu/hamro-patro.png', difficulty: 'easy', category: 'app', acceptableAnswers: ['Hamro Patro', 'HamroPatro'] },
      { id: 'nepal_bank', name: 'Nepal Bank', imagePath: '/yo-chineu/nepal-bank.png', difficulty: 'hard', category: 'banking', acceptableAnswers: ['Nepal Bank', 'NBL', 'Nepal Bank Limited'] },
      { id: 'adbl', name: 'ADBL', imagePath: '/yo-chineu/adbl.png', difficulty: 'hard', category: 'banking', acceptableAnswers: ['ADBL', 'Agriculture Development Bank'] }
    ],
    np: [
      { id: 'ncell', name: 'एनसेल', imagePath: '/yo-chineu/ncell.png', difficulty: 'easy', category: 'दूरसञ्चार', acceptableAnswers: ['एनसेल', 'Ncell', 'N-Cell'] },
      { id: 'nabil_bank', name: 'नबिल बैंक', imagePath: '/yo-chineu/nabil-bank.png', difficulty: 'medium', category: 'बैंकिङ', acceptableAnswers: ['नबिल बैंक', 'नबिल', 'Nabil Bank', 'NABIL'] },
      { id: 'buddha_air', name: 'बुद्ध एयर', imagePath: '/yo-chineu/buddha-air.png', difficulty: 'medium', category: 'हवाई सेवा', acceptableAnswers: ['बुद्ध एयर', 'Buddha Air', 'बुद्ध एयरलाइन्स'] },
      { id: 'tata', name: 'टाटा', imagePath: '/yo-chineu/tata.jpg', difficulty: 'easy', category: 'सवारी साधन', acceptableAnswers: ['टाटा', 'Tata', 'टाटा मोटर्स', 'TATA'] },
      { id: 'wai_wai', name: 'वाइ वाइ', imagePath: '/yo-chineu/wai-wai.png', difficulty: 'easy', category: 'खाद्य', acceptableAnswers: ['वाइ वाइ', 'Wai Wai', 'वाइवाइ', 'Wai-Wai'] },
      { id: 'cg', name: 'सीजी', imagePath: '/yo-chineu/cg.png', difficulty: 'medium', category: 'समूह', acceptableAnswers: ['सीजी', 'चौधरी समूह', 'CG', 'Chaudhary Group'] },
      { id: 'dish_home', name: 'डिश होम', imagePath: '/yo-chineu/dish-home.png', difficulty: 'medium', category: 'केबल', acceptableAnswers: ['डिश होम', 'Dish Home', 'डिशहोम'] },
      { id: 'ntc', name: 'नेपाल टेलिकम', imagePath: '/yo-chineu/ntc.jpg', difficulty: 'easy', category: 'दूरसञ्चार', acceptableAnswers: ['नेपाल टेलिकम', 'NTC', 'नेपाल दूरसञ्चार'] },
      { id: 'himalayan_bank', name: 'हिमालयन बैंक', imagePath: '/yo-chineu/hbl.png', difficulty: 'medium', category: 'बैंकिङ', acceptableAnswers: ['हिमालयन बैंक', 'HBL', 'हिमालयन बैंक लिमिटेड', 'Himalayan Bank'] },
      { id: 'yeti_airlines', name: 'यति एयरलाइन्स', imagePath: '/yo-chineu/yeti-air.png', difficulty: 'medium', category: 'हवाई सेवा', acceptableAnswers: ['यति एयरलाइन्स', 'Yeti Airlines', 'यति'] },
      { id: 'kumari_bank', name: 'कुमारी बैंक', imagePath: '/yo-chineu/kumari-bank.png', difficulty: 'hard', category: 'बैंकिङ', acceptableAnswers: ['कुमारी बैंक', 'कुमारी', 'Kumari Bank', 'kumari', 'kumari bank', 'कुमारी बैंक लिमिटेड'] },
      { id: 'laxmi_bank', name: 'लक्ष्मी बैंक', imagePath: '/yo-chineu/laxmi-bank.jpg', difficulty: 'hard', category: 'बैंकिङ', acceptableAnswers: ['लक्ष्मी बैंक', 'लक्ष्मी', 'Laxmi Bank'] },
      { id: 'nic_asia', name: 'एनआईसी एशिया बैंक', imagePath: '/yo-chineu/nic-asia.png', difficulty: 'hard', category: 'बैंकिङ', acceptableAnswers: ['एनआईसी एशिया', 'एनआईसी एशिया बैंक', 'NIC Asia', 'NIC'] },
      { id: 'nepal_investment_bank', name: 'नेपाल इन्भेस्टमेन्ट बैंक', imagePath: '/yo-chineu/nimb-bank.png', difficulty: 'hard', category: 'बैंकिङ', acceptableAnswers: ['नेपाल इन्भेस्टमेन्ट बैंक', 'NIBL', 'नेपाल इन्भेस्टमेन्ट', 'Nepal Investment Bank'] },
      { id: 'gorkha_brewery', name: 'गोरखा ब्रुअरी', imagePath: '/yo-chineu/gorkha-brewery.png', difficulty: 'medium', category: 'पेय पदार्थ', acceptableAnswers: ['गोरखा ब्रुअरी', 'गोरखा', 'Gorkha Brewery', 'गोरखा बियर'] },
      { id: 'esewa', name: 'ई-सेवा', imagePath: '/yo-chineu/esewa.jpg', difficulty: 'easy', category: 'फिन्टेक', acceptableAnswers: ['ई-सेवा', 'eSewa', 'ई सेवा', 'e-Sewa'] },
      { id: 'khalti', name: 'खल्ती', imagePath: '/yo-chineu/khalti.png', difficulty: 'medium', category: 'फिन्टेक', acceptableAnswers: ['खल्ती', 'Khalti', 'खल्ती डिजिटल वालेट'] },
      { id: 'worldlink', name: 'वर्ल्डलिङ्क', imagePath: '/yo-chineu/worldlink.png', difficulty: 'easy', category: 'इन्टरनेट', acceptableAnswers: ['वर्ल्डलिङ्क', 'WorldLink', 'वर्ल्ड लिङ्क', 'वर्ल्डलिङ्क कम्युनिकेसन्स'] },
      { id: 'siddhartha_bank', name: 'सिद्धार्थ बैंक', imagePath: '/yo-chineu/siddhartha-bank.jpg', difficulty: 'hard', category: 'बैंकिङ', acceptableAnswers: ['सिद्धार्थ बैंक', 'सिद्धार्थ', 'Siddhartha Bank', 'सिद्धार्थ बैंक लिमिटेड'] },
      { id: 'khukuri_rum', name: 'खुकुरी रम', imagePath: '/yo-chineu/khukuri-rum.png', difficulty: 'medium', category: 'पेय पदार्थ', acceptableAnswers: ['खुकुरी रम', 'खुकुरी', 'Khukuri Rum', 'खुकुरी नेपाल'] },
      // New Logos
      { id: 'pathao', name: 'पठाओ', imagePath: '/yo-chineu/pathao.png', difficulty: 'easy', category: 'सवारी सेवा', acceptableAnswers: ['पठाओ', 'Pathao'] },
      { id: 'daraz', name: 'दराज', imagePath: '/yo-chineu/daraz.png', difficulty: 'easy', category: 'ई-कमर्स', acceptableAnswers: ['दराज', 'Daraz'] },
      { id: 'fonepay', name: 'फोनपे', imagePath: '/yo-chineu/fonepay.png', difficulty: 'easy', category: 'फिन्टेक', acceptableAnswers: ['फोनपे', 'Fonepay'] },
      { id: 'nepal_airlines', name: 'नेपाल एयरलाइन्स', imagePath: '/yo-chineu/nepal-airlines.png', difficulty: 'medium', category: 'हवाई सेवा', acceptableAnswers: ['नेपाल एयरलाइन्स', 'NAC', 'Nepal Airlines'] },
      { id: 'global_ime', name: 'ग्लोबल आइएमई बैंक', imagePath: '/yo-chineu/global-ime.png', difficulty: 'medium', category: 'बैंकिङ', acceptableAnswers: ['ग्लोबल आइएमई', 'Global IME'] },
      { id: 'goldstar', name: 'गोल्डस्टार', imagePath: '/yo-chineu/goldstar.png', difficulty: 'easy', category: 'रिटेल', acceptableAnswers: ['गोल्डस्टार', 'Goldstar'] },
      { id: 'kantipur', name: 'कान्तिपुर', imagePath: '/yo-chineu/kantipur.png', difficulty: 'easy', category: 'मिडिया', acceptableAnswers: ['कान्तिपुर', 'Kantipur'] },
      { id: 'ronb', name: 'आरओएनबी', imagePath: '/yo-chineu/ronb.png', difficulty: 'easy', category: 'मिडिया', acceptableAnswers: ['आरओएनबी', 'RONB', 'रुटिन अफ नेपाल बन्द'] },
      { id: 'ime_pay', name: 'आइएमई पे', imagePath: '/yo-chineu/ime-pay.png', difficulty: 'easy', category: 'फिन्टेक', acceptableAnswers: ['आइएमई पे', 'IME Pay'] },
      { id: 'foodmandu', name: 'फूडमान्डु', imagePath: '/yo-chineu/foodmandu.png', difficulty: 'medium', category: 'डेलिभरी', acceptableAnswers: ['फूडमान्डु', 'Foodmandu'] },
      { id: 'hamrobazar', name: 'हाम्रोबजार', imagePath: '/yo-chineu/hamrobazar.png', difficulty: 'medium', category: 'ई-कमर्स', acceptableAnswers: ['हाम्रोबजार', 'Hamrobazar'] },
      { id: 'shivam_cement', name: 'शिवम् सिमेन्ट', imagePath: '/yo-chineu/shivam-cement.png', difficulty: 'medium', category: 'निर्माण', acceptableAnswers: ['शिवम्', 'Shivam Cement'] },
      { id: 'tuborg', name: 'ट्युबोर्ग', imagePath: '/yo-chineu/tuborg.png', difficulty: 'easy', category: 'पेय पदार्थ', acceptableAnswers: ['ट्युबोर्ग', 'Tuborg'] },
      { id: 'carlsberg', name: 'कार्लसबर्ग', imagePath: '/yo-chineu/carlsberg.png', difficulty: 'medium', category: 'पेय पदार्थ', acceptableAnswers: ['कार्लसबर्ग', 'Carlsberg'] },
      { id: 'dabur', name: 'डाबर', imagePath: '/yo-chineu/dabur.png', difficulty: 'easy', category: 'एफएमसीजी', acceptableAnswers: ['डाबर', 'Dabur'] },
      { id: 'nepal_life', name: 'नेपाल लाइफ', imagePath: '/yo-chineu/nepal-life.png', difficulty: 'medium', category: 'बीमा', acceptableAnswers: ['नेपाल लाइफ', 'Nepal Life'] },
      { id: 'everest_bank', name: 'एभरेष्ट बैंक', imagePath: '/yo-chineu/everest-bank.png', difficulty: 'medium', category: 'बैंकिङ', acceptableAnswers: ['एभरेष्ट बैंक', 'Everest Bank'] },
      { id: 'prabhu_bank', name: 'प्रभु बैंक', imagePath: '/yo-chineu/prabhu-bank.png', difficulty: 'medium', category: 'बैंकिङ', acceptableAnswers: ['प्रभु बैंक', 'Prabhu Bank'] },
      { id: 'shree_airlines', name: 'श्री एयरलाइन्स', imagePath: '/yo-chineu/shree-airlines.png', difficulty: 'medium', category: 'हवाई सेवा', acceptableAnswers: ['श्री एयरलाइन्स', 'Shree Airlines'] },
      { id: 'saurya_airlines', name: 'सौर्य एयरलाइन्स', imagePath: '/yo-chineu/saurya-airlines.png', difficulty: 'hard', category: 'हवाई सेवा', acceptableAnswers: ['सौर्य एयरलाइन्स', 'Saurya Airlines'] },
      { id: 'sanima_bank', name: 'सानिमा बैंक', imagePath: '/yo-chineu/sanima-bank.png', difficulty: 'hard', category: 'बैंकिङ', acceptableAnswers: ['सानिमा बैंक', 'Sanima Bank'] },
      { id: 'big_mart', name: 'बिग मार्ट', imagePath: '/yo-chineu/big-mart.png', difficulty: 'easy', category: 'रिटेल', acceptableAnswers: ['बिग मार्ट', 'Big Mart'] },
      { id: 'citizen_bank', name: 'सिटिजन्स बैंक', imagePath: '/yo-chineu/citizen-bank.png', difficulty: 'hard', category: 'बैंकिङ', acceptableAnswers: ['सिटिजन्स बैंक', 'Citizens Bank'] },
      { id: 'mega_bank', name: 'मेगा बैंक', imagePath: '/yo-chineu/mega-bank.png', difficulty: 'medium', category: 'बैंकिङ', acceptableAnswers: ['मेगा बैंक', 'Mega Bank'] },
      { id: 'machhapuchhre', name: 'माछापुच्छ्रे बैंक', imagePath: '/yo-chineu/machhapuchhre.png', difficulty: 'hard', category: 'बैंकिङ', acceptableAnswers: ['माछापुच्छ्रे', 'Machhapuchhre Bank'] },
      { id: 'vianet', name: 'भियानेट', imagePath: '/yo-chineu/vianet.png', difficulty: 'medium', category: 'इन्टरनेट', acceptableAnswers: ['भियानेट', 'Vianet'] },
      { id: 'sastodeal', name: 'सस्तो डिल', imagePath: '/yo-chineu/sastodeal.png', difficulty: 'medium', category: 'ई-कमर्स', acceptableAnswers: ['सस्तो डिल', 'SastoDeal'] },
      { id: 'indrive', name: 'इनड्राइभ', imagePath: '/yo-chineu/indrive.png', difficulty: 'easy', category: 'सवारी सेवा', acceptableAnswers: ['इनड्राइभ', 'InDrive'] },
      { id: 'hamro_patro', name: 'हाम्रो पात्रो', imagePath: '/yo-chineu/hamro-patro.png', difficulty: 'easy', category: 'एप', acceptableAnswers: ['हाम्रो पात्रो', 'Hamro Patro'] },
      { id: 'nepal_bank', name: 'नेपाल बैंक', imagePath: '/yo-chineu/nepal-bank.png', difficulty: 'hard', category: 'बैंकिङ', acceptableAnswers: ['नेपाल बैंक', 'Nepal Bank'] },
      { id: 'adbl', name: 'एडीबीएल', imagePath: '/yo-chineu/adbl.png', difficulty: 'hard', category: 'बैंकिङ', acceptableAnswers: ['एडीबीएल', 'ADBL', 'कृषि विकास बैंक'] }
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
