import { preAuthorize } from "@/lib/auth";
import AdminDashboardLayout from "./AdminDashboardLayout";
export default async function AdminDashboard(){
  await preAuthorize("ADMIN");

  return <AdminDashboardLayout/>
}