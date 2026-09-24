import { preAuthorize } from "@/lib/auth";
import AttemptLayout from "./AttemptLayout";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { Attempt } from "./types";
import { Topic } from "../types";
import { getAttempts } from "./actions";

export default async function Attempts({searchParams}: {searchParams: Promise<{topicId?: string}>}){
  preAuthorize("STUDENT")
  
  const {topicId} = await searchParams;
  if(!topicId?.trim()){
    redirect("/student-dashboard")
  }

  const { attempts, topic } = await getAttempts(topicId);

  return <AttemptLayout attempts={attempts} topic={topic}/>
}