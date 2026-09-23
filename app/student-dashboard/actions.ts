"use server"
import { cookies } from 'next/headers';
import { Section, Sections, Topic } from './types';

interface GetSectionOverviewResponse {
  success: Boolean;
  sections: Sections | undefined;
}

export async function GetSectionOverview(): Promise<GetSectionOverviewResponse>{
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if(!token){
    throw new Error("No authentication token");
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/authenticated/section-overview`, {
    headers: {
      Authorization: `Bearer ${token}`
    },
    method: `GET`
  })

  if (!res.ok) {
    console.log("Backend rejected request:");
    return {success: false, sections: undefined};
  }

  const body = await res.json();
  const sections = body.data.map(
    (section: Section) => ({
      id: section.id,
      name: section.name,
      description: section.description,
      topics: section.topics.map((topic: Topic) => ({
        id: topic.id,
        name: topic.name,
        description: topic.description
      }))
    })
  )
  
  return {success: true, sections}
}