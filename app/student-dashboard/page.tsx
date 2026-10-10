import { GetSectionOverview } from "./actions";
import StudentDashboardLayout from "./SectionOverview";
import { preAuthorize } from "@/lib/auth";

export default async function StudentDashboard(){
  await preAuthorize("STUDENT");
  const res = await GetSectionOverview()
  const renderStudentButtons = async (topicId: string) => {
    'use server'
    return(
      <a
        href={`/student-dashboard/attempts?topicId=${topicId}`}
        className="rounded bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 mt-2 cursor-pointer text-center"
      >
        View Attempts
      </a>
    )
  }
  return (
    <>
      <h1 className="flex w-full justify-center py-20 text-4xl font-bold text-white">
        Student Dashboard
      </h1>
      <StudentDashboardLayout sections = {res.sections} role="STUDENT"/>
    </>
  )
}