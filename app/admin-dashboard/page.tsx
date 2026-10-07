import { preAuthorize } from "@/lib/auth";
import AdminDashboardLayout from "./AdminDashboardLayout";
import { GetSectionOverview } from "../student-dashboard/actions";
import StudentDashboardLayout from "../student-dashboard/StudentDashboardLayout";

export default async function AdminDashboard(){
  await preAuthorize("ADMIN");
  const res = await GetSectionOverview()

  
  return (
    <>
      <h1 className="flex w-full justify-center py-20 text-4xl font-bold text-white">
        Admin Dashboard
      </h1>
      <StudentDashboardLayout sections = {res.sections} role = "ADMIN"/>
    </>
  )
}