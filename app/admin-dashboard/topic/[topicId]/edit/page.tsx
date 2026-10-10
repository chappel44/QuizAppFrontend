import { preAuthorize } from "@/lib/auth";
import { getTopic } from "@/lib/topic";
import { Topic } from "@/app/student-dashboard/types";
import TopicEditor from "../../TopicEditor";

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

  return <TopicEditor topic = {topic} questions = {questions || []}/>
}