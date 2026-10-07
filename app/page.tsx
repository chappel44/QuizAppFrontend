"use client"

import Input from "@/components/Input";
import SectionCard from "@/components/SectionCard";
import { handleSignin, handleSignup } from "@/lib/auth";
import { AtSign, Eye, EyeOff, Lock, LockIcon, LockKeyhole, Mail, Plane, PlaneIcon } from "lucide-react";
import { redirect } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

export interface LoginType {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export default function Home() {
  const [formData, setFormData] = useState<LoginType>({
    email: "",
    password: "",
    firstName: "",
    lastName: ""
  })
  const [loginOpen, setLoginOpen] = useState(true);
  const [showPassword, setShowPassword] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const id = String(e.target.id)
    setFormData(formData => ({...formData, [id]: e.target.value}))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if(loginOpen) {
      const res = await handleSignin(formData)

      if (res.success && res.role) {
        toast.success("Sign in successfully")
        if(res.role == "STUDENT"){
          redirect("/student-dashboard")
        }
        else if(res.role == "ADMIN"){
          redirect("/admin-dashboard")
        }
      }
      else {
        toast.error("Invalid credentials")
      }
    }
    else {
      const res = await handleSignup(formData)

      if (res.success) {
        toast.success("Sign up successfully")
        setLoginOpen(true)
      }
      else {
        toast.error("Error signing up")
      }
    }
  }

  return (
    <div className="w-screen h-screen flex justify-center ">
      <div className="flex flex-col justify-center px-4 w-lg">
        <SectionCard>
          <div className="flex flex-col w-full items-center">
            <PlaneIcon className="w-15 h-15 bg-blue-200 p-1 rounded-full text-blue-400 border border-blue-400 mb-2"/>
            <h1 className="text-black/90 font-semibold text-2xl mb-1">Flight School {loginOpen ? "Login" : "Sign Up"}</h1>
            <p className="flex flex-col text-black/60 mb-2">Sign in to take assessments</p>
          </div>
          <form
            onSubmit={(e) => handleSubmit(e)}
            className="space-y-2 w-full"
          >
            
            <Input handleInputChange={handleInputChange} name="email" value={formData.email} label="Email">
              <AtSign className="text-blue-400" />
            </Input>
            <Input handleInputChange={handleInputChange} name = "password" value={formData.password} label="Password">
              { showPassword ?
                <EyeOff onClick = {() => setShowPassword(false)} className="text-blue-400"/>
                :
                <Eye onClick = {() => setShowPassword(true)} className="text-blue-400"/>
              }
            </Input>
            {
              !loginOpen && (
              <>
                <Input handleInputChange={handleInputChange} name="firstName" value={formData.firstName} label = "First Name">
                  {/* <EyeOff onClick = {() => setShowPassword(false)} className="text-blue-400"/> */}
                </Input>
                <Input handleInputChange={handleInputChange} name="lastName" value={formData.lastName} label="Last Name" />
              </>
              )
            }
            <div className="flex flex-col justify-center mb-4">
              <button 
                type="submit"
                className="bg-blue-500 text-white px-2 py-1 rounded cursor-pointer h-10 hover:bg-blue-600"
              >
                {loginOpen ? "Login" : "Sign Up"}
              </button>
            </div>
            {
            loginOpen ?
            <p className="text-gray-800 flex gap-1 justify-center">
              Dont have an account? 
              <button type = "button" onClick = {() => setLoginOpen(false)} className="text-blue-400 cursor-pointer">
                Sign up here
              </button>
            </p>
            :
              <button type = "button" onClick = {() => setLoginOpen(true)} className="text-blue-400 cursor-pointer flex justify-center w-full">
                Back to sign in
              </button>
            }
          </form>
        </SectionCard>
      </div>
    </div>
  );
}
