import { preAuthorize } from "@/lib/auth";
import { GetSectionOverview } from "../student-dashboard/actions";
import SectionOverview from "../student-dashboard/SectionOverview";
import { Popover } from "radix-ui";
import SectionForm from "@/components/SectionForm";
import { AdminSection } from "../student-dashboard/types";
import { PlusIcon } from "lucide-react";
export default async function AdminDashboard(){
  await preAuthorize("ADMIN");
  const res = await GetSectionOverview()

  const updateSections = (section: AdminSection) => {
    res.sections = [...res.sections || [], section]
  }

  return (
    <div className="py-4 md:py-8 lg:py-12">
      <div className="w-full bg-gray-100 mb-4 py-1 px-2 gap-4 mx-auto flex justify-center">
        <Popover.Root>
		      <Popover.Trigger asChild>
            <button 
              type="button"
              className="mx-auto flex w-full  max-w-xl cursor-pointer items-center justify-center gap-2 
              rounded-lg bg-green-600/70 px-2 md:px-4 py-2.5 font-medium text-white shadow-sm 
              transition-all duration-200 hover:bg-green-600 hover:shadow-md active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500 disabled:shadow-none disabled:hover:bg-gray-300 disabled:active:scale-100 disabled:focus:ring-0"
            >
              <PlusIcon />
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
      <SectionOverview initialSections = {res.sections} role = "ADMIN"/>
    </div>
  )
}