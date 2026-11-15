/**
 * Nepal's 7 provinces and the districts in each, with district headquarters.
 * Source: Wikipedia, "List of districts of Nepal" (checked 16 November 2026).
 * District ids match app/data/district-data.ts.
 */

export interface ProvinceInfo {
  id: string;
  en: string;
  np: string;
  /** District id → headquarters (English). */
  districts: Record<string, string>;
}

export const PROVINCES: ProvinceInfo[] = [
  {
    id: 'koshi',
    en: 'Koshi Province',
    np: 'कोशी प्रदेश',
    districts: {
      bhojpur: 'Bhojpur',
      dhankuta: 'Dhankuta',
      illam: 'Ilam',
      jhapa: 'Chandragadhi (Bhadrapur)',
      khotang: 'Diktel',
      morang: 'Biratnagar',
      okhaldhunga: 'Okhaldhunga (Siddhicharan)',
      panchthar: 'Phidim',
      sankhuwasabha: 'Khandbari',
      solukhumbu: 'Salleri (Solududhkunda)',
      sunsari: 'Inaruwa',
      taplejung: 'Phungling',
      terhathum: 'Myanglung',
      udayapur: 'Gaighat (Triyuga)',
    },
  },
  {
    id: 'madhesh',
    en: 'Madhesh Province',
    np: 'मधेश प्रदेश',
    districts: {
      parsa: 'Birgunj',
      bara: 'Kalaiya',
      rautahat: 'Gaur',
      sarlahi: 'Malangwa',
      dhanusha: 'Janakpur',
      siraha: 'Siraha',
      mahottari: 'Jaleshwar',
      saptari: 'Rajbiraj',
    },
  },
  {
    id: 'bagmati',
    en: 'Bagmati Province',
    np: 'बागमती प्रदेश',
    districts: {
      sindhuli: 'Sindhulimadhi (Kamalamai)',
      ramechhap: 'Manthali',
      dolakha: 'Charikot (Bhimeshwar)',
      bhaktapur: 'Bhaktapur',
      dhading: 'Dhading Besi (Nilkantha)',
      kathmandu: 'Kathmandu',
      kavrepalanchok: 'Dhulikhel',
      lalitpur: 'Lalitpur',
      nuwakot: 'Bidur',
      rasuwa: 'Dhunche',
      sindhupalchok: 'Chautara',
      chitwan: 'Bharatpur',
      makwanpur: 'Hetauda',
    },
  },
  {
    id: 'gandaki',
    en: 'Gandaki Province',
    np: 'गण्डकी प्रदेश',
    districts: {
      baglung: 'Baglung',
      gorkha: 'Gorkha',
      kaski: 'Pokhara',
      lamjung: 'Besisahar',
      manang: 'Chame',
      mustang: 'Jomsom',
      myagdi: 'Beni',
      nawalparasi_east: 'Kawasoti',
      parbat: 'Kusma',
      syangja: 'Putalibazar',
      tanahun: 'Damauli (Vyas)',
    },
  },
  {
    id: 'lumbini',
    en: 'Lumbini Province',
    np: 'लुम्बिनी प्रदेश',
    districts: {
      kapilvastu: 'Taulihawa',
      nawalparasi_west: 'Parasi (Ramgram)',
      rupandehi: 'Bhairahawa (Siddharthanagar)',
      arghakhanchi: 'Sandhikharka',
      gulmi: 'Tamghas (Resunga)',
      palpa: 'Tansen',
      dang: 'Ghorahi',
      pyuthan: 'Pyuthan',
      rolpa: 'Liwang (Rolpa)',
      rukum_east: 'Rukumkot',
      banke: 'Nepalganj',
      bardiya: 'Gulariya',
    },
  },
  {
    id: 'karnali',
    en: 'Karnali Province',
    np: 'कर्णाली प्रदेश',
    districts: {
      rukum_west: 'Musikot',
      salyan: 'Salyan (Sharada)',
      dolpa: 'Dunai (Thuli Bheri)',
      humla: 'Simikot',
      jumla: 'Jumla (Chandannath)',
      kalikot: 'Manma (Khandachakra)',
      mugu: 'Gamgadhi (Chhayanath Rara)',
      surkhet: 'Birendranagar',
      dailekh: 'Dailekh (Narayan)',
      jajarkot: 'Jajarkot Khalanga (Bheri)',
    },
  },
  {
    id: 'sudurpashchim',
    en: 'Sudurpashchim Province',
    np: 'सुदूरपश्चिम प्रदेश',
    districts: {
      kailali: 'Dhangadhi',
      achham: 'Mangalsen',
      doti: 'Dipayal Silgadhi',
      bajhang: 'Chainpur (Jayaprithvi)',
      bajura: 'Martadi (Badimalika)',
      kanchanpur: 'Mahendranagar (Bheemdatta)',
      dadeldhura: 'Dadeldhura (Amargadhi)',
      baitadi: 'Baitadi Khalanga (Dasharathchand)',
      darchula: 'Darchula Khalanga (Mahakali)',
    },
  },
];
