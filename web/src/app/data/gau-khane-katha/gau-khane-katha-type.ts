export interface Riddle {
    id: string;
    question: string;
    answer: string;
    answerNp?: string; 
    answerEn?: string;
  }
  
  export interface RiddlesData {
    en: Riddle[];
    np: Riddle[];
  }