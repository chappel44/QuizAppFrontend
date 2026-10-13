"use server"

import { SectionFormData } from "@/components/SectionForm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AdminSection } from "@/app/student-dashboard/types";
import { preAuthorize } from "./auth";

export interface SectionResponse {success: boolean, section?: AdminSection | null}

export async function addSection(formData: SectionFormData): Promise<SectionResponse> { 
  await preAuthorize("ADMIN")

  const cookieStore = await cookies(); 
  const token = cookieStore.get("token")?.value;
  
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

export async function updateSection(
  sectionId: string,
  body: SectionFormData
): Promise<SectionResponse> {
  await preAuthorize("ADMIN")

  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value

  if (!token) {
    redirect("/")
  }

  const baseUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/section`
  const url = `${baseUrl}?${new URLSearchParams({ sectionId }).toString()}`

  const response = await fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
    cache: "no-store",
  })

  if (!response.ok) {
    if (response.status === 403) {
      redirect("/")
    }

    const errorText = await response.text().catch(() => "")
    throw new Error(
      `Failed to update section (${response.status}): ${errorText || response.statusText}`
    )
  }

  return ({
    success: true,
  })
}

export async function deleteSection(sectionId: string): Promise<{success: boolean}> {
  await preAuthorize("ADMIN")

  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value

  if (!token) {
    redirect("/")
  }

  const baseUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/section`
  const url = `${baseUrl}?${new URLSearchParams({ sectionId }).toString()}`

  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  })

  if (!response.ok) {
    if (response.status === 403) {
      redirect("/")
    }

    const errorText = await response.text().catch(() => "")
    throw new Error(
      `Failed to delete section (${response.status}): ${errorText || response.statusText}`
    )
  }
  return {success: true}
}