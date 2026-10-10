import { preAuthorize } from "@/lib/auth";
import { GetSectionOverview } from "../student-dashboard/actions";
import SectionOverview from "../student-dashboard/SectionOverview";
import { Popover } from "radix-ui";
import SectionForm from "@/components/SectionForm";
import { AdminSection } from "../student-dashboard/types";
export default async function AdminDashboard(){
  await preAuthorize("ADMIN");
  const res = await GetSectionOverview()

  const updateSections = (section: AdminSection) => {
    res.sections = [...res.sections || [], section]
  }

  return (
    <>
      <h1 className="flex w-full justify-center py-20 text-4xl font-bold text-white">
        Admin Dashboard
      </h1>
      <div className="w-full bg-gray-100 mb-4 py-1 px-2 gap-4 mx-auto flex justify-center">
        <Popover.Root>
		      <Popover.Trigger asChild>
            <button 
              type="button"
              className="bg-blue-500 text-white px-2 py-1 rounded cursor-pointer h-10 hover:bg-blue-600"
            >
              Add Section
            </button>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content>
              <SectionForm />
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
      </div>
      <SectionOverview sections = {res.sections} role = "ADMIN"/>
    </>
  )
}