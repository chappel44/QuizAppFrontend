

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Attempt } from "./types";
import { Topic } from "../types";

interface AttemptResult { 
  attempts: Attempt[]; 
  topic: Topic; 
}

export async function getAttempts(topicId: string): Promise<AttemptResult> { 
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