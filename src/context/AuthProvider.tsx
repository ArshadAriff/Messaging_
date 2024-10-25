'use client'


//get this from session provider in nextAuth Website ans make some changes
import { SessionProvider } from "next-auth/react"

export default function AuthProvider({
  children,
  
}:{children:React.ReactNode}) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  )
}