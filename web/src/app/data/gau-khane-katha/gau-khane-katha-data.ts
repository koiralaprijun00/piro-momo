import { RiddlesData } from './gau-khane-katha-type';
import { englishRiddles } from './gaukhanedata-en';
import { nepaliRiddles } from './gaukhanedata-np';

// Combine both sets of riddles into the RiddlesData structure
export const riddlesData: RiddlesData = {
  en: englishRiddles,
  np: nepaliRiddles
};