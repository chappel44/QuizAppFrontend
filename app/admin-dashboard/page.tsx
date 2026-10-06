import { preAuthorize } from "@/lib/auth";
import AdminDashboardLayout from "./AdminDashboardLayout";
import { GetSectionOverview } from "../student-dashboard/actions";
import StudentDashboardLayout from "../student-dashboard/StudentDashboardLayout";

export default async function AdminDashboard(){
  await preAuthorize("ADMIN");
  const res = await GetSectionOverview()

  const renderStudentButtons = async (topicId: string) => {
    'use server'
    return(
      <a
        href={`/admin-dashboard/edit/topic/${topicId}`}
        className="rounded bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 mt-2 cursor-pointer text-center"
      >
        Edit Topic
      </a>
    )
  }

  return (
    <>
      <h1 className="flex w-full justify-center py-20 text-4xl font-bold text-white">
        Admin Dashboard
      </h1>
      <StudentDashboardLayout sections = {res.sections} renderButtons={renderStudentButtons}/>
    </>
  )
}