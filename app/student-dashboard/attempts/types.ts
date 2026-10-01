import { AttemptQuestion } from "./[attemptId]/types";

export interface Attempt {
  id: string;
  percentage: number;
  pointsEarned: number;
  totalPoints: number;
  isFinalized: boolean;
  attemptQuestions?: AttemptQuestion[] | undefined;
}