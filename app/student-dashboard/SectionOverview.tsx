"use client"

import { AccordionContent, AccordionItem, AccordionTrigger } from "radix-ui/accordion";
import { Section, Topic } from "./types"
import { Accordion } from "radix-ui";
import { ChevronDown, ChevronUp } from "lucide-react";
import { ReactNode, useState } from "react";

import { motion } from "framer-motion"
import SectionCard from "@/components/SectionCard";
import Card from "@/components/Card";

type SectionOverviewProps = {
  sections: Section[] | undefined;
  role?: "STUDENT" | "ADMIN"
};

export default function SectionOverview({sections, role}: SectionOverviewProps) {
  const [openSections, setOpenSections] = useState<boolean[]>(Array(sections?.length).fill(false))
  
  const sortedSections = sections && [...sections].sort((a, b) => 
    a.name.localeCompare(b.name)
  );

  const handleOpenSectionChange = (index: number) => {
    setOpenSections((openSections: boolean[]) => {
      const updated = [...openSections]
      updated[index] = !updated[index]
      return updated
    })
  }

  return (
    <div className="px-4">
      <div className="mx-auto flex w-full max-w-5xl flex-col space-y-4 text-gray-800">
        {sortedSections?.map((section: Section, index: number) => (
          <SectionCard key={section.id}>
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

                    {role === "ADMIN" && 
                      <a
                        className="bg-blue-500 text-white px-2 py-1 rounded cursor-pointer h-10 hover:bg-blue-600 w-full max-w-xs mx-auto flex justify-center items-center m-4"
                        href={`/admin-dashboard/topic/create/${section.id}`}
                      >
                        Add Topic
                      </a>
                    }

                    <div className="space-y-8 border-l-2 border-blue-300 pl-4">
                      {section.topics?.map((topic: Topic, index: number) => (
                        <Card key = {topic.id} hoverable = {true}>
                          <div>
                            <p>Topic #{index + 1}</p>
                            <h4 className="text-lg font-medium">{topic.name}</h4>
                            <p className="text-sm text-gray-600">{topic.description}</p>
                          </div>
                          {role === "STUDENT" ? 
                            (
                              <a
                                href={`/student-dashboard/attempts?topicId=${topic.id}`}
                                className="rounded bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 mt-2 cursor-pointer text-center"
                              >
                                View Attempts
                              </a>
                            ) : (
                              <a
                                href={`/admin-dashboard/topic/${topic.id}/edit`}
                                className="rounded bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 mt-2 cursor-pointer text-center"
                              >
                                Edit Topic
                              </a>
                            )
                          }
                        </Card>
                      ))}
                    </div>
                  </motion.div>
                </AccordionContent>
              </Accordion.Item>
            </Accordion.Root>
          </SectionCard>
        ))}
      </div>
    </div>
  )
}