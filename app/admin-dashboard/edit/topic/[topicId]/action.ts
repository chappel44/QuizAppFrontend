import { cookies } from "next/headers";
import { redirect } from "next/navigation";

interface TopicResults {success: boolean, data: any}

export async function getTopic(topicId: string): Promise<TopicResults> { 
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

  return {success: true, data: {topic: body.data}};
}