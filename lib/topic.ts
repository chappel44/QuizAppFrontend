"use server"

import type { Question } from "@/app/student-dashboard/attempts/[attemptId]/types";
import type { Topic } from "@/app/student-dashboard/types";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export interface Response {success: boolean, data: any}

export async function getTopic(topicId: string): Promise<Response> { 
  const cookieStore = await cookies(); 
  const token = cookieStore.get("token")?.value; 
  if (!token) {
    redirect("/"); 
  }
  const res = await fetch( `${process.env.NEXT_PUBLIC_BACKEND_URL}/authenticated/topics?topicId=${topicId}`, { 
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
  console.log("BODY DATA", body.data)
  return {success: true, data: {topic: body.data}};
}

export async function updateTopic(topic: Topic, questions: Question[]): Promise<Response> { 
  const cookieStore = await cookies(); 
  const token = cookieStore.get("token")?.value; 
  
  if (!token) {
    redirect("/"); 
  }

  const normalizedTopic = {
    ...topic,
    isActive: topic.active,
  };

  //Recently added questions and answers are given a temp id 
  // that must be cleared before sending to the server
  const normalizedQuestions = questions.map((question) => ({
    ...question,
    id: question.id?.startsWith("tempQuestionId-") ? null : question.id,
    isActive: question.active,
    answers: question.answers.map((answer) => (console.log("answers:", answer), {
      ...answer,
      id: answer.id?.startsWith("tempAnswerId-") ? null : answer.id,
      isActive: answer.active,
      isCorrect: answer.correct,
    })),
  }));

  //Create new topic when id not present
  if(topic.id == ""){ 
    const res = await fetch( `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/topics?sectionId=${topic.section}`, { 
      method: 'POST',
      headers: 
        { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({topic: normalizedTopic, questions: normalizedQuestions})
      },
    );

    if (!res.ok) {
      throw new Error("Failed to fetch attempts"); 
    }
    const topicId = await res.text()

    console.log("TOPIC ID", topicId)
    redirect(`/admin-dashboard/topic/${topicId}/edit?created=${true}`)
  }
  //Update topic when id present
  else{
    const res = await fetch( `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/topics?topicId=${topic.id}`, { 
      method: 'PATCH',
      headers: 
        { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({topic: normalizedTopic, questions: normalizedQuestions})
      },
    );

    if (!res.ok) {
      throw new Error("Failed to fetch attempts"); 
    }

    const body = await res.json();

    return {success: true, data: {topic: body.data}};
  }
}