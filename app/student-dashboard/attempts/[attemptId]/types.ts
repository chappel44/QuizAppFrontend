export interface Topic {
  id: string;
  createdAt: string;
  dueDate: string;
  name: string;
  desciption: string;
  active: boolean;
  questions: Question[];
}

export interface AttemptQuestion {
  id: string;
  isCorrect: boolean | null;
  submittedAnswerId: string;
  question: Question
}

export interface Question {
  id: string;
  question: string;
  points: number;
  imageUrl: string;
  active: boolean;
  answers: Answer[];
}

export interface Answer {
  id: string;
  answer: string;
  createdAt: string;
  //Fields below only come during fetch to the topic
  active?: boolean | null; 
  correct?: boolean | null
}