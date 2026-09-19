"use server"
import { type LoginType } from "./page"

export async function handleSignin(formData: LoginType): Promise<{success: Boolean, token: string | null}> {
  const payload = JSON.stringify(
    formData, 
    ["email", "password"]
  );
  
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/signin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: payload
  })

  if(res.ok) {
    const token = await res.json()
    return {success: true, token}
  }
  else {
    return {success: false, token: null}
  }
}

export async function handleSignup(formData: LoginType): Promise <{success: Boolean, message: string}>
{
  const payload = JSON.stringify(
    formData, 
    ["email", "password", "firstName", "lastName"],
  );
  
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: payload
  })

  if(res.ok){
    return {success: true, message: "You have signed up successfully"} 
  }
  else{
    return {success: false, message: "Internal server error"} 
  }
}