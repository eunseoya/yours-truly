"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"

type User = {
  id: string
  name: string
  email: string
}

type AuthContextType = {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  signup: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
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
    // In a real app, this would be an API call
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Check if user exists in localStorage
      const users = JSON.parse(localStorage.getItem("users") || "[]")
      const foundUser = users.find((u: any) => u.email === email && u.password === password)

      if (foundUser) {
        // Remove password before storing in state
        const { password, ...userWithoutPassword } = foundUser
        setUser(userWithoutPassword)
        localStorage.setItem("user", JSON.stringify(userWithoutPassword))
        return true
      }

      return false
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Check if user already exists
      const users = JSON.parse(localStorage.getItem("users") || "[]")
      const userExists = users.some((u: any) => u.email === email)

      if (userExists) {
        return false
      }

      // Create new user
      const newUser = {
        id: Date.now().toString(),
        name,
        email,
        password,
      }

      // Save to "database"
      users.push(newUser)
      localStorage.setItem("users", JSON.stringify(users))

      // Log user in
      const { password: _, ...userWithoutPassword } = newUser
      setUser(userWithoutPassword)
      localStorage.setItem("user", JSON.stringify(userWithoutPassword))

      return true
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
    router.push("/login")
  }

  return <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
