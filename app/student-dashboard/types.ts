import { Question } from "./attempts/[attemptId]/types";

export interface Section {
  id: string;
  name: string;
  description: string;
  topics: Topic[]
}

export type TopicType = "TEST" | "RANDOM_QUESTIONS" | "REVIEW" | "QUIZ"

export interface Topic {
  id: string;
  createdAt: string;
  name: string;
  description: string;
  dueDate: string;
  active: boolean;
  topicType: TopicType;
  questions?: Question[];
  questionPoolSize?: number;
  section: string;
}