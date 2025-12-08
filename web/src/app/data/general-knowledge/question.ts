export interface Question {
    id: string; // Unique identifier for the question
    category: string; // Category of the question (e.g., "history", "geography")
    question: string; // The question text
    options: string[]; // Array of answer options
    correctAnswer: string; // The correct answer
  }