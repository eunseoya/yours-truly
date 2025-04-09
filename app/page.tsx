import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-lightpink">
      <div className="w-full max-w-md flex flex-col items-center justify-center gap-8 p-6">
        <div className="relative w-40 h-40">
          <Image
            src="/logo.svg?height=160&width=160"
            alt="Yours Truly Logo"
            width={160}
            height={160}
            className="opacity-70"
          />
        </div>
        <h1 className="font-serif italic text-3xl text-gray-800 mt-4">Yours Truly</h1>
        <p className="text-center text-gray-600 font-light">Your personal digital archive for cherished items and memories</p>
        <div className="flex flex-col w-full gap-4 mt-8">
          <Link href="/login" className="w-full">
          <Button variant="outline" className="w-full border-gray-300 uppercase text-xs tracking-wider">
              Log In
            </Button>
          </Link>
          <Link href="/signup" className="w-full">
            <Button variant="outline" className="w-full border-gray-300 uppercase text-xs tracking-wider">
              Sign Up
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
