"use client"

import { AccordionContent, AccordionItem, AccordionTrigger } from "radix-ui/accordion";
import { Section, Topic } from "./types"
import { Accordion } from "radix-ui";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

import { motion } from "framer-motion"

type StudentDashboardLayoutProps = {
  sections: Section[] | undefined;
};

export default function StudentDashboardLayout({sections}: StudentDashboardLayoutProps) {
  const [openSections, setOpenSections] = useState<boolean[]>(Array(sections?.length).fill(false))

  console.log("OPEN SECTIONS", openSections)

  const handleOpenSectionChange = (index: number) => {
    setOpenSections((openSections: boolean[]) => {
      const updated = [...openSections]
      updated[index] = !updated[index]
      return updated
    })
  }

  return (
    <div className="px-4">
      <h1 className="flex w-full justify-center py-20 text-4xl font-bold text-white">
        Student Dashboard
      </h1>

      <div className="mx-auto flex w-full max-w-5xl flex-col space-y-4 text-gray-800">
        {sections?.map((section: Section, index: number) => (
          <div 
            className="w-full rounded-lg bg-blue-50 px-8 py-5 shadow-xl border-blue-800"
          >
            <Accordion.Root
              type = "multiple"
              onValueChange={() => handleOpenSectionChange(index)}
            >
              <Accordion.Item key = {section.id} value={section.id}>
                <AccordionTrigger
                  className="w-full cursor-pointer"
                >
                  <div className="flex justify-between">
                    <div className="flex flex-col">
                      <h2 className="text-2xl font-semibold">{section.name}</h2>
                      <p className="mt-1 text-sm text-gray-600">
                        {section.description}
                      </p>
                    </div>
                    <ChevronUp className={` transition-all duration-200 ${openSections[index] ? "rotate-180" : "rotate-0"}`} />
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: .3, ease: "easeIn"}}
                    className="overflow-hidden"
                  >
                    <h3 className="mt-5 mb-2 text-sm font-semibold uppercase tracking-wide text-gray-700">
                      Topics
                    </h3>

                    <div className="space-y-8 border-l-2 border-blue-300 pl-4">
                      {section.topics.map((topic: Topic, index: number) => (
                        <div className="flex flex-col border border-blue-300 bg-white rounded-lg shadow p-4 hover:scale-101 transition-all duration-300 hover:bg-blue-50">
                          <div>
                            <p>Topic #{index + 1}</p>
                            <h4 className="text-lg font-medium">{topic.name}</h4>
                            <p className="text-sm text-gray-600">{topic.description}</p>
                          </div>
                          <a
                            href={`/student-dashboard/attempts?topicId=${topic.id}`}
                            className="rounded bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 mt-2 cursor-pointer text-center"
                          >
                            View Attempts
                          </a>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </AccordionContent>
              </Accordion.Item>
            </Accordion.Root>
          </div>
        ))}
      </div>
    </div>
  )
}