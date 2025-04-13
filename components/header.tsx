"use client";

import Link from "next/link";
import { Menu, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/hooks/use-auth";
import Image from "next/image";

export function Header() {
  const { logout, user } = useAuth();

  return (
    <header className="border-b py-4">
      <div className="container max-w-md mx-auto px-4 flex items-center justify-between">
        <div />
        <Link
          href="/home"
          className="font-serif italic text-xl text-gray-800 translate-x-4"
        >
          <Image src="/title.svg" alt="title" width={100} height={50} />
        </Link>

        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent className="w-screen h-screen p-4">
              <div className="flex flex-col h-full justify-between gap-4 text-4xl italic font-light">
                <div className="flex flex-col items-end mt-4">
                  {/* top items */}
                  {user && (
                    <div className="pb-24 w-full text-right text-xl">
                      <p className="text-gray-500">user: {user.email}</p>
                    </div>
                  )}
                  <Link href="/home">Home</Link>
                  <Link href="/profile">Profile</Link>
                  <Link href="/camera">Camera</Link>
                  <Link href="/archive">Archive</Link>
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
