import { preAuthorize } from "@/lib/auth";
import { getAttempt } from "../actions"
import AttemptLayout from "./AttemptLayout";

interface AttemptPageProps {
  params: Promise<{ attemptId: string }>;
}

export default async function AttemptPage({params}: AttemptPageProps){
  preAuthorize("STUDENT")

  const {attemptId} = await params;

  const data = await getAttempt(attemptId)

  return <AttemptLayout attemptTemp = {data.attempt} attemptQuestionsTemp={data.attemptQuestions} topicId={data.topicId}/>
}