import { preAuthorize } from "@/lib/auth";
import { getTopic } from "./action";
import EditTopic from "./EditTopic";

interface EditTopicPageProps {
  params: Promise<{ topicId: string }>;
}

export default async function EditTopicPage({params}: EditTopicPageProps){
  await preAuthorize("ADMIN")
  const {topicId} = await params;
  const res = await getTopic(topicId);
  const body = res.data
  console.log("BODY", body)
  return <EditTopic />
}