import { Temple } from './temple';
import { templesEn, templesNp } from './temples';
 
export const getTemplesByLocale = (locale: string): Temple[] => {
  return locale === 'np' ? templesNp : templesEn;
}; 