// district-data.js
'use client'

// Import translation data
import enDistricts from '../../../messages/name-district-en.json';
import npDistricts from '../../../messages/name-district-np.json';

// Base district data with SVG paths
const baseDistrictData = [
  { id: 'kathmandu', imagePath: '/districts/Kathmandu.svg' },
  { id: 'lalitpur', imagePath: '/districts/Lalitpur.svg' },
  { id: 'bhaktapur', imagePath: '/districts/Bhaktapur.svg' },
  { id: 'kavrepalanchok', imagePath: '/districts/Kavrepalanchok.svg' },
  { id: 'dhading', imagePath: '/districts/Dhading.svg' },
  { id: 'nuwakot', imagePath: '/districts/Nuwakot.svg' },
  { id: 'sindhupalchok', imagePath: '/districts/Sindhupalchok.svg' },
  { id: 'dolakha', imagePath: '/districts/Dolakha.svg' },
  { id: 'ramechhap', imagePath: '/districts/Ramechhap.svg' },
  { id: 'sindhuli', imagePath: '/districts/Sindhuli.svg' },
  { id: 'okhaldhunga', imagePath: '/districts/okhaldhunga.svg' },
  { id: 'khotang', imagePath: '/districts/khotang.svg' },
  { id: 'bhojpur', imagePath: '/districts/bhojpur.svg' },
  { id: 'dhankuta', imagePath: '/districts/dhankuta.svg' },
  { id: 'terhathum', imagePath: '/districts/Terhathum.svg' },
  { id: 'sankhuwasabha', imagePath: '/districts/Sankhuwasabha.svg' },
  { id: 'solukhumbu', imagePath: '/districts/Solukhumbu.svg' },
  { id: 'udayapur', imagePath: '/districts/Udayapur.svg' },
  { id: 'taplejung', imagePath: '/districts/Taplejung.svg' },
  { id: 'panchthar', imagePath: '/districts/panchthar.svg' },
  { id: 'illam', imagePath: '/districts/Illam.svg' },
  { id: 'jhapa', imagePath: '/districts/jhapa.svg' },
  { id: 'morang', imagePath: '/districts/morang.svg' },
  { id: 'sunsari', imagePath: '/districts/Sunsari.svg' },
  { id: 'saptari', imagePath: '/districts/Saptari.svg' },
  { id: 'siraha', imagePath: '/districts/Siraha.svg' },
  { id: 'dhanusha', imagePath: '/districts/Dhanusha.svg' },
  { id: 'mahottari', imagePath: '/districts/Mahottari.svg' },
  { id: 'sarlahi', imagePath: '/districts/Sarlahi.svg' },
  { id: 'rautahat', imagePath: '/districts/Rautahat.svg' },
  { id: 'bara', imagePath: '/districts/Bara.svg' },
  { id: 'parsa', imagePath: '/districts/Parsa.svg' },
  { id: 'chitwan', imagePath: '/districts/Chitwan.svg' },
  { id: 'makwanpur', imagePath: '/districts/Makwanpur.svg' },
  { id: 'gorkha', imagePath: '/districts/Gorkha.svg' },
  { id: 'lamjung', imagePath: '/districts/Lamjung.svg' },
  { id: 'tanahun', imagePath: '/districts/Tanahun.svg' },
  { id: 'kaski', imagePath: '/districts/Kaski.svg' },
  { id: 'syangja', imagePath: '/districts/Syangja.svg' },
  { id: 'parbat', imagePath: '/districts/Parbat.svg' },
  { id: 'baglung', imagePath: '/districts/Baglung.svg' },
  { id: 'myagdi', imagePath: '/districts/Myagdi.svg' },
  { id: 'mustang', imagePath: '/districts/Mustang.svg' },
  { id: 'manang', imagePath: '/districts/Manang.svg' },
  { id: 'gulmi', imagePath: '/districts/Gulmi.svg' },
  { id: 'arghakhanchi', imagePath: '/districts/Arghakhanchi.svg' },
  { id: 'palpa', imagePath: '/districts/Palpa.svg' },
  { id: 'nawalparasi_east', imagePath: '/districts/East-Nawalparasi.svg' },
  { id: 'rupandehi', imagePath: '/districts/Rupandehi.svg' },
  { id: 'kapilvastu', imagePath: '/districts/Kapilvastu.svg' },
  { id: 'dang', imagePath: '/districts/Dang.svg' },
  { id: 'pyuthan', imagePath: '/districts/Pyuthan.svg' },
  { id: 'rolpa', imagePath: '/districts/Rolpa.svg' },
  { id: 'rukum_east', imagePath: '/districts/East-Rukum.svg' },
  { id: 'rukum_west', imagePath: '/districts/West-Rukum.svg' },
  { id: 'salyan', imagePath: '/districts/Salyan.svg' },
  { id: 'banke', imagePath: '/districts/Banke.svg' },
  { id: 'bardiya', imagePath: '/districts/Bardiya.svg' },
  { id: 'surkhet', imagePath: '/districts/Surkhet.svg' },
  { id: 'dailekh', imagePath: '/districts/Dailekh.svg' },
  { id: 'jajarkot', imagePath: '/districts/Jajarkot.svg' },
  { id: 'dolpa', imagePath: '/districts/Dolpa.svg' },
  { id: 'jumla', imagePath: '/districts/Jumla.svg' },
  { id: 'kalikot', imagePath: '/districts/Kalikot.svg' },
  { id: 'mugu', imagePath: '/districts/Mugu.svg' },
  { id: 'humla', imagePath: '/districts/Humla.svg' },
  { id: 'bajura', imagePath: '/districts/Bajura.svg' },
  { id: 'bajhang', imagePath: '/districts/Bajhang.svg' },
  { id: 'achham', imagePath: '/districts/Achham.svg' },
  { id: 'doti', imagePath: '/districts/Doti.svg' },
  { id: 'kailali', imagePath: '/districts/Kailali.svg' },
  { id: 'kanchanpur', imagePath: '/districts/Kanchanpur.svg' },
  { id: 'dadeldhura', imagePath: '/districts/Dadeldhura.svg' },
  { id: 'baitadi', imagePath: '/districts/Baitadi.svg' },
  { id: 'darchula', imagePath: '/districts/Darchula.svg' },
  { id: 'rasuwa', imagePath: '/districts/Rasuwa.svg' }, // Added
  { id: 'nawalparasi_west', imagePath: '/districts/West-Nawalparasi.svg' }  // Added
];

// Create the enhanced district data with translations
export const districtData = baseDistrictData.map(district => {
  // Create each district with translation properties
  return {
    ...district,
    // Add the name field based on English translation for backward compatibility
    name: enDistricts.districts[district.id],
    // Add the translations object with both language versions
    translations: {
      en: enDistricts.districts[district.id],
      ne: npDistricts.districts[district.id]
    }
  };
});