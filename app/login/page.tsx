"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/hooks/use-auth"
import { Loader2 } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const { login, isLoading } = useAuth()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [error, setError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!formData.email || !formData.password) {
      setError("Please fill in all fields")
      return
    }

    const success = await login(formData.email, formData.password)
    if (success) {
      router.push("/home")
    } else {
      setError("Invalid email or password")
    }
  }

  return (
    <div className="min-h-screen bg-lightpink flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="relative w-24 h-24 mb-4">
            <Image
              src="/logo.svg?height=96&width=96"
              alt="Yours Truly Logo"
              width={96}
              height={96}
              className="opacity-70"
            />
          </div>
          <h1 className="font-serif italic text-3xl text-gray-800">Yours Truly</h1>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl uppercase font-light mb-6 text-center">Log In</h2>

          {error && <div className="mb-4 p-2 bg-red-50 text-red-500 rounded text-sm">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-light text-gray-700 mb-1">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-light text-gray-700 mb-1">
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
              />
            </div>

            <Button type="submit" variant="outline" className="w-full uppercase text-xs tracking-wider" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Log In
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <p>
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-primary hover:underline">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
