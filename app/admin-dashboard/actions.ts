"use server"

import { SectionFormData } from "@/components/SectionForm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AdminSection, Section } from "../student-dashboard/types";

export interface SectionResponse {success: boolean, section: AdminSection}

export async function addSection(formData: SectionFormData): Promise<SectionResponse> { 
  const cookieStore = await cookies(); 
  const token = cookieStore.get("token")?.value;
  console.log("FORMDATA", formData)
  
  if (!token) {
    redirect("/"); 
  }

  const res = await fetch( `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/section`, { 
    method: "POST",
    headers: { 
      Authorization: `Bearer ${token}`, 
      "Content-Type": "application/json"
    },
    body: JSON.stringify(formData)
    },
  );

  if (!res.ok) {
    throw new Error("Failed to fetch attempts"); 
  }

  const addedSection = await res.json();

  const section = {
    id: addedSection.id,
    name: addedSection.name,
    description: addedSection.description,
    topics: addedSection.topics,
    isActive: addedSection.isActive
  } as AdminSection

  return {success: true, section: section};
}
