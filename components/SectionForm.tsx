"use client"

import React, { useState } from "react";
import Card from "./Card";
import Input from "./Input";
import { addSection } from "@/app/admin-dashboard/actions";
import { toast } from "sonner";
import { AdminSection } from "@/app/student-dashboard/types";

export interface SectionFormData {
  name: string;
  description: string;
}

// interface SectionFormProps {
//   updateSections: (section: AdminSection) => void
// }

export default function SectionForm(){
  const [formData, setFormData] = useState<SectionFormData>({
    name: "",
    description: ""
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const id = String(e.target.id)
    setFormData(formData => ({...formData, [id]: e.target.value}))
  }

  const handleSubmit = async (e: React.ChangeEvent) => {
    e.preventDefault()
    const res = await addSection(formData)
    if(res.success){
      toast.success("Section added")
      window.location.reload()
    }
    else {
      toast.error("Something went wrong")
    }
  }

  return(
      <div className="mt-2">
        <Card>
          <form
            onSubmit={ handleSubmit }
            className="space-y-2"
          >
            <Input name = "name" value={formData.name} label="Name" handleInputChange={handleInputChange}/>
            <Input name = "description" value={formData.description} label="Description" handleInputChange={handleInputChange}/>

            <button 
              type="submit"
              className="bg-blue-500 text-white px-2 py-1 rounded cursor-pointer h-10 hover:bg-blue-600 w-full"
            >
              Submit
            </button>
          </form>
        </Card>
      </div>
  )
}