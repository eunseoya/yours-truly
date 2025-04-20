"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
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
          <h2 className="text-xl font-light uppercase text-center text-gray-700 mb-4">
            Page Not Found
          </h2>
          <p className="text-center text-gray-600 font-light mb-6">
            Sorry, the page you are looking for does not exist.
            <br />
            You may have mistyped the address or the page may have moved.
          </p>
          <Link href="/home" className="w-full">
            <Button
              variant="outline"
              className="w-full uppercase text-xs tracking-wider border-gray-300"
            >
              Go Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
