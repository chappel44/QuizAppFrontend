"use server"

import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { type LoginType } from '@/app/page';

interface JwtPayload {
  email: string;
  userId: string;
  role: 'ADMIN' | 'STUDENT' | undefined;
}

async function verifyToken(token: string): Promise<JwtPayload | null> {
  try {
    const secret = Buffer.from(process.env.JWT_SECRET!, "base64");
    const { payload } = await jwtVerify(token, secret, {
      algorithms: ["HS256"],
    });
    return payload as unknown as JwtPayload;
  } catch(error) {
    console.error("JWT verification failed", error)
    return null; // invalid signature, expired, malformed, etc.
  }
}

export async function preAuthorize(role: "STUDENT" | "ADMIN") {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  if (!token) {
    console.error("NO TOKEN")
    redirect('/');
  }

  const claims = await verifyToken(token);
  if (!claims) {
    console.error("NO CLAIMS")
    redirect('/');
  }

  if (claims.role !== role) {
    console.error("INVALID ROLE")
    redirect('/');
  }
}

export async function handleSignin(formData: LoginType): Promise<{success: Boolean, role: "ADMIN" | "STUDENT" | undefined}> {
  try{
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
      const data = await res.json()
      const cookieStore = await cookies();

      cookieStore.set('token', data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      const claims = await verifyToken(data.token)
      if(!claims){
        return {success: false, role: undefined} 
      }

      return {success: true, role: claims?.role}
    }
    else {
      return {success: false, role: undefined}
    }
  }
  catch(error){
    return {success: false, role: undefined}
  }
}

export async function handleSignup(formData: LoginType): Promise <{success: Boolean, message: string}>
{
  const payload = JSON.stringify(
    formData, 
    ["email", "password", "firstName", "lastName"],
  );

  if(!formData.firstName.trim() || !formData.lastName.trim()){
    return {success: false, message: "Internal server error"}
  }

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