import { questionsEn } from "./data-gk.en";
import { questionsNp } from "./data-gk.np";
import { Question } from "./question";

export const getQuestionsByLocale = (locale: string): Question[] => {
  // Get all questions for the locale
  const allQuestions = locale === "np" ? questionsNp : questionsEn;
  
  // Return all questions
  return allQuestions;
};