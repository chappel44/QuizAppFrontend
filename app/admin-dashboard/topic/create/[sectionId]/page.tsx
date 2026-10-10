import { preAuthorize } from "@/lib/auth";
import TopicEditor from "../../TopicEditor";

export default async function CreateTopicPage({params} : any){
  await preAuthorize("ADMIN")
  const {sectionId} = await params;

  return <TopicEditor sectionId = {sectionId}/>
}