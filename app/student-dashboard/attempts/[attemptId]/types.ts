export interface AttemptQuestion {
  id: string;
  isCorrect: Boolean;
  submittedAnswerId: string;
  question: Question
}

export interface Question {
  id: string;
  question: string;
  points: number;
  imageUrl: string;
  answers: Answer[];
}

export interface Answer {
  id: string;
  answer: string;
  createdAt: string;
}