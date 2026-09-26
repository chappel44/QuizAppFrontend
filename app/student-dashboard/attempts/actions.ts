"use server"

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Attempt } from "./types";
import { Topic } from "../types";
import { Answer, AttemptQuestion } from "./[attemptId]/types";

interface AttemptResult { 
  attempts: Attempt[]; 
  topic: Topic; 
}

export async function getAttemptHistory(topicId: string): Promise<AttemptResult> { 
  const cookieStore = await cookies(); 
  const token = cookieStore.get("token")?.value; 
  if (!token) {
     redirect("/"); 
  } 
  const res = await fetch( `${process.env.NEXT_PUBLIC_BACKEND_URL}/student/attempts?topicId=${topicId}`, { 
    headers: 
      { 
        Authorization: `Bearer ${token}` 
      }, 
    }
  );

  if (!res.ok) { 
    throw new Error("Failed to fetch attempts"); 
  }

  const body = await res.json(); 

  return { attempts: body.data.attempts, topic: body.data.topic }; 
}

export async function getAttempt(attemptId: string) {
  const cookieStore = await cookies(); 
  const token = cookieStore.get("token")?.value; 
  if (!token) {
     redirect("/"); 
  } 
  const res = await fetch( `${process.env.NEXT_PUBLIC_BACKEND_URL}/student/attempt?attemptId=${attemptId}`, { 
    headers: 
      { 
        Authorization: `Bearer ${token}` 
      },
    }
  );

  if (!res.ok) { 
    throw new Error("Failed to fetch attempts"); 
  }

  const body = await res.json();
  const data = body.data;

  const attempt = {
    id: data.attempt.id,
    percentage: data.attempt.percentage,
    totalPoints: data.attempt.totalPoints,
    pointsEarned: data.attempt.pointsEarned,
  } as Attempt

  const attemptQuestions = data.attempt.attemptQuestions.map((attemptQuestion: AttemptQuestion) => ({
    id: attemptQuestion.id,
    isCorrect: attemptQuestion.isCorrect,
    submittedAnswerId: attemptQuestion.submittedAnswerId,
    question: {
      id: attemptQuestion.question.id,
      question: attemptQuestion.question.question,
      imageUrl: attemptQuestion.question.imageUrl,
      points: attemptQuestion.question.points,
      answers: attemptQuestion.question.answers.map((answer: Answer) => ({
        id: answer.id,
        createdAt: answer.createdAt,
        answer: answer.answer
      }))
    }
  }))

  return {attempt, attemptQuestions, topicId: data.topic.id};
}

export async function submitAnswer(answerId: string, attemptQuestionId: string) {
  const cookieStore = await cookies(); 
  const token = cookieStore.get("token")?.value; 
  if (!token) {
     redirect("/"); 
  }
  const res = await fetch( `${process.env.NEXT_PUBLIC_BACKEND_URL}/student/attempt/record/question?answerId=${answerId}&attemptQuestionId=${attemptQuestionId}`, { 
    headers: 
      { 
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      method: "PATCH",
    },
  );
  const body = await res.json()
  return body
}

export async function createAttempt(topicId: string) {
  const cookieStore = await cookies(); 
  const token = cookieStore.get("token")?.value; 
  if (!token) {
     redirect("/"); 
  }
  const res = await fetch( `${process.env.NEXT_PUBLIC_BACKEND_URL}/student/attempt?topicId=${topicId}`, { 
    headers: 
      { 
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      method: "POST",
    },
  );

  const resJson = await res.json();

  return resJson.data
}