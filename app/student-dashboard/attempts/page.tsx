import { preAuthorize } from "@/lib/auth";
import AttemptsLayout from "./AttemptsLayout";
import { redirect } from "next/navigation";
import { getAttemptHistory } from "./actions";

export default async function Attempts({searchParams}: {searchParams: Promise<{topicId?: string}>}){
  await preAuthorize("STUDENT")
  
  const {topicId} = await searchParams;
  if(!topicId?.trim()){
    redirect("/student-dashboard")
  }

  const { attempts, topic } = await getAttemptHistory(topicId);

  return <AttemptsLayout attempts={attempts} topic={topic}/>
}