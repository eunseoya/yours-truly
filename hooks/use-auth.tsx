"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

type User = {
  id: string
  email: string
}

type AuthContextType = {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  signup: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()

  // Load user from Supabase on mount and listen for auth state changes
  useEffect(() => {
    const getUser = async () => {
      setIsLoading(true)
      const { data, error } = await supabase.auth.getUser()
      if (data?.user) {
        setUser({
          id: data.user.id,
          email: data.user.email ?? "",
        })
      } else {
        setUser(null)
      }
      setIsLoading(false)
    }
    getUser()

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email ?? "",
        })
      } else {
        setUser(null)
      }
    })
    return () => {
      listener?.subscription.unsubscribe()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Check if user is authenticated and redirect if needed
  useEffect(() => {
    if (!isLoading) {
      const publicPaths = ["/", "/login", "/signup"]
      const isPublicPath = publicPaths.includes(pathname)
      if (!user && !isPublicPath) {
        router.push("/login")
      }
    }
  }, [user, isLoading, pathname, router])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error || !data.user) {
        return false
      }
      setUser({
        id: data.user.id,
        email: data.user.email ?? "",
      })
      return true
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        data: {
          name,
        },
      })
      if (error || !data.user) {
        return false
      }
      setUser({
        id: data.user.id,
        email: data.user.email ?? "",
        name: data.user.name ?? "",
      })
      return true
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    setIsLoading(true)
    await supabase.auth.signOut()
    setUser(null)
    setIsLoading(false)
    router.push("/login")
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
