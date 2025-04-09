"use client"

import Link from "next/link"
import { Menu, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useAuth } from "@/hooks/use-auth"

export function Header() {
  const { logout, user } = useAuth()

  return (
    <header className="border-b py-4">
      <div className="container max-w-md mx-auto px-4 flex items-center justify-between">
      <div />
      <Link href="/home" className="font-serif italic text-xl text-gray-800 translate-x-4">
        Yours Truly
      </Link>

      <div className="flex items-center gap-2">
        <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
          <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent>
          <div className="flex flex-col gap-4 mt-8">
          {user && (
            <div className="pb-4 mb-4 border-b">
            <p className="font-light">{user.name}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          )}
          <Link href="/home" className="text-lg">
            Home
          </Link>
          <Link href="/archive" className="text-lg">
            Archive
          </Link>
          <button onClick={logout} className="text-lg text-left text-red-500 mt-4">
            Log Out
          </button>
          </div>
        </SheetContent>
        </Sheet>
      </div>
      </div>
    </header>
  )
}
