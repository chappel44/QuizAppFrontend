import { GetSectionOverview } from "./actions";
import StudentDashboardLayout from "./StudentDashboardLayout";
import { preAuthorize } from "@/lib/auth";

export default async function StudentDashboard(){
  await preAuthorize("STUDENT");
  const res = await GetSectionOverview()
  return <StudentDashboardLayout sections = {res.sections}/>
}