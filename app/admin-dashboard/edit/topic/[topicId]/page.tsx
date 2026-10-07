import { preAuthorize } from "@/lib/auth";
import { getTopic } from "./action";
import EditTopic from "./EditTopic";
import { Topic } from "@/app/student-dashboard/types";

interface EditTopicPageProps {
  params: Promise<{ topicId: string }>;
}

export default async function EditTopicPage({params}: EditTopicPageProps){
  await preAuthorize("ADMIN")
  const {topicId} = await params;
  const res = await getTopic(topicId);
  const topic = res.data.topic as Topic
  const questions = topic.questions;
  topic.questions = undefined

  return <EditTopic topic = {topic} questions = {questions || []}/>
}