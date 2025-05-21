"use client";

import Link from "next/link";

import { usePathname } from "next/navigation";
import { AlignJustify, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/hooks/use-auth";
import Image from "next/image";

export function Header() {
  const { logout, user } = useAuth();
  const pathname = usePathname();
  const isArchivePage = pathname === "/archive" || pathname === "/negatives";
  return (
    <header className="border-b py-4">
      {/* special case: when on home page, show the user guide button */}
              {/* Floating button to show the user guide */}
            
      {/*  special case: when on archive page, use lg:max-w-none */}
      <div className={`container max-w-md mx-auto px-4 flex items-center justify-between
        ${isArchivePage ? "sm:max-w-none" : ""}`}>
        <Link href="/guide">
          <button className="w-10 h-10 flex border border-gray-700 rounded-full items-center justify-center">
        ?
          </button>
        </Link>

        <Link
          href="/home"
          className="font-serif italic text-xl text-gray-800 translate-x-4"
        >
          <Image src="/title.svg" alt="title" width={100} height={50} />
        </Link>

        <div className="flex items-center gap-2">
          <Sheet>
        <SheetTrigger asChild>
          <button className="w-12 h-12 flex items-center justify-center">
            <AlignJustify className="h-10 w-10 stroke-[0.5]" />
          </button>
        </SheetTrigger>
        <SheetContent className="w-full h-screen p-4">
          <div className="flex flex-col h-full justify-between gap-4 text-4xl italic font-light">
            <div className="flex flex-col items-end mt-4">
          {/* top items */}
          {user && (
            <div className="pb-24 w-full text-right text-xl">
              <p className="text-gray-500">user: {user.email}</p>
            </div>
          )}
          <Link href="/home">Home</Link>
          <Link href="/camera">Camera</Link>
          <Link href="/archive">Archive</Link>
          <Link href="/negatives">Negatives</Link>
          <Link href="/social">Social</Link>
            </div>

            {/* bottom items */}
            <div className="w-full flex flex-col items-end">
          <Link href="/about">About</Link>
          <button onClick={logout} className="italic">
            Log Out
          </button>
            </div>
          </div>
        </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
