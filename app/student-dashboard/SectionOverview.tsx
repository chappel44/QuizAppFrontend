"use client"

import { AccordionContent, AccordionItem, AccordionTrigger } from "radix-ui/accordion";
import { Section, Topic } from "./types"
import { Accordion } from "radix-ui";
import { ChevronUp, PlusIcon, Trash2 } from "lucide-react";
import { useState } from "react";

import { motion } from "framer-motion"
import SectionCard from "@/components/SectionCard";
import Card from "@/components/Card";
import Input from "@/components/Input";
import { deleteSection, updateSection } from "@/lib/sections";
import { SectionFormData } from "@/components/SectionForm";
import { toast } from "sonner";
import AlertButton from "@/components/AlertButton";
import { section } from "framer-motion/client";

type SectionOverviewProps = {
  initialSections: Section[] | undefined;
  role?: "STUDENT" | "ADMIN"
};

export default function SectionOverview({initialSections, role}: SectionOverviewProps) {
  const [openSections, setOpenSections] = useState<boolean[]>(Array(initialSections?.length).fill(false))
  const [editingSection, setEditingSection] = useState<boolean[]>(Array(initialSections?.length).fill(false))
  initialSections = initialSections && [...initialSections].sort((a, b) => 
    a.name.localeCompare(b.name)
  );
  const [sections, setSections] = useState<Section[]>(initialSections ?? []);
  const [updating, setUpdating] = useState(false)
  const [adding, setAdding] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleOpenSectionChange = (index: number) => {
    setOpenSections((openSections: boolean[]) => {
      const updated = [...openSections]
      updated[index] = !updated[index]
      return updated
    })
  }

  const handleSectionDelete = async (sectionId: string) => {
    try {
      setDeleting(true)
      if(!sectionId){
        setDeleting(false)
        return
      }

      const res = await deleteSection(sectionId)

      if(res.success){
        toast.success("Section deleted")
        setSections((prevSections: Section[]) =>
          prevSections.filter((prevSection: Section) => 
            prevSection.id !== sectionId
          )
        )
      }
      else toast.error("Failed to delete section")      
    }
    catch(err){
      toast.error("Something went wrong") 
    }
    finally{
      setDeleting(false)
    }
  }

  const handleSectionUpdate = async (section: Section, index: number) => {
    const originalSection = initialSections?.find(
      (prevSection) => prevSection.id === section.id
    );

    if (!originalSection) return;

    if (section.name.trim() === "" || section.description.trim() === "") {
      return;
    }

    if (
      originalSection.name === section.name &&
      originalSection.description === section.description &&
      originalSection.active === section.active
    ) {
      toggleEditingSection(index);
      return;
    }

    originalSection.name = section.name
    originalSection.description = section.description
    originalSection.active = section.active

    const sectionData: SectionFormData = {
      name: section.name,
      description: section.description,
      isActive: section.active,
    };

    try {
      setUpdating(true);

      const res = await updateSection(section.id, sectionData);

      if (res.success) {
        toast.success("Section updated");
        toggleEditingSection(index);
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      toast.error("Failed to update section");
    } finally {
      setUpdating(false);
    }
  };

  const toggleEditingSection = (index: number) => {
    setEditingSection(prev => ({
      ...prev,
      [index]: !prev[index],
    }))
  }

  const handleSectionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [attribute, sectionId] = e.target.id.split(" ");
    console.log(attribute)
    console.log(sectionId)
    setSections((prev: any) =>
      prev.map((section: Section) =>
        section.id === sectionId
          ? {
              ...section,
              [attribute]: e.target.value,
            }
          : section
      )
    );
  }

  return (
    <div className="px-4">
      <div className="mx-auto flex w-full max-w-5xl flex-col space-y-4 text-gray-800">
        {sections?.map((section: Section, index: number) => (
          <SectionCard key={section.id}>
            <Accordion.Root
              type = "multiple"
              onValueChange={() => handleOpenSectionChange(index)}
            >
              <Accordion.Item key={section.id} value={section.id}>
                <div className="flex items-start justify-between">
                  <AccordionTrigger className="flex-1">
                    <div className="text-left">
                      <h2 className="text-2xl font-semibold">
                        {section.name}
                      </h2>
                      <p className="mt-1 text-sm text-gray-600">
                        {section.description}
                      </p>
                    </div>
                  </AccordionTrigger>

                  <div className="flex items-center gap-4">
                    { role === "ADMIN" &&
                    <button
                      type="button"
                      onClick={() => {
                        { editingSection[index]
                          ?
                          handleSectionUpdate(sections[index], index)
                          :
                          toggleEditingSection(index)
                        }
                      }}
                      className="ml-3 bg-blue-500 text-white px-2 md:px-4 py-1 md:py-2 rounded whitespace-nowrap"
                    >
                      {editingSection[index] ? updating ? "Updating..." : "Save changes" : "Edit Section"}
                    </button>
                    }
                    { role === "ADMIN" && 
                      <AlertButton
                        name="section"
                        onClick={() => handleSectionDelete(section.id)}
                        theme="destructive"
                        loading = {deleting}
                      />
                    }
                    <ChevronUp className={`transition-transform ${openSections[index] ? "duration-300" : "rotate-180 duration-0"}`} />
                  </div>
                </div>

                {editingSection[index] && (
                  <div className="space-y-3 p-4">
                    <Input
                      label="Name"
                      name={`name ${section.id}`}
                      value={section.name}
                      handleInputChange={handleSectionChange}
                    />

                    <Input
                      label="Description"
                      name={`description ${section.id}`}
                      value={section.description}
                      handleInputChange={handleSectionChange}
                    />
                  </div>
                )}
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
                        className="mb-4 mx-auto flex w-full  max-w-xl cursor-pointer items-center justify-center gap-2 
                        rounded-lg bg-purple-600/70 px-2 md:px-4 py-2.5 font-medium text-white shadow-sm 
                        transition-all duration-200 hover:bg-purple-600 hover:shadow-md active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500 disabled:shadow-none disabled:hover:bg-gray-300 disabled:active:scale-100 disabled:focus:ring-0"

                        href={`/admin-dashboard/topic/create/${section.id}`}
                      >
                        <PlusIcon />
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