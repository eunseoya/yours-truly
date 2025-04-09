"use client"

import type React from "react"

import { ItemsProvider } from "@/hooks/use-items"
import { AuthProvider } from "@/hooks/use-auth"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ItemsProvider>{children}</ItemsProvider>
    </AuthProvider>
  )
}
