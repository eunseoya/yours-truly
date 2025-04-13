"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { User, Plus, MessageCircle } from "lucide-react";
import Link from "next/link";

export default function SocialPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"friends" | "me">("friends");

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Custom header with back button */}
      <div className="border-b py-4">
        <div className="container max-w-md mx-auto px-4 flex items-center justify-between">
          <Link href="/home" className="p-1 rounded-full hover:bg-gray-100">
            <User className="h-5 w-5" />
          </Link>
          <Link
            href="/home"
            className="font-serif italic text-xl text-gray-800 translate-x-4"
          >
            <Image src="/title.svg" alt="title" width={100} height={50} />
          </Link>
          <div className="w-5" />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex justify-center my-4">
        <div className="flex border rounded-full overflow-hidden">
          <button
            className={`px-4 py-1 text-xs ${activeTab === "friends" ? "bg-black text-white" : "bg-white text-black"}`}
            onClick={() => setActiveTab("friends")}
          >
            FRIENDS
          </button>
          <button
            className={`px-4 py-1 text-xs ${activeTab === "me" ? "bg-black text-white" : "bg-white text-black"}`}
            onClick={() => setActiveTab("me")}
          >
            ME
          </button>
        </div>
      </div>

      {/* Social feed */}
      <div className="flex-1 container max-w-md mx-auto px-4 py-2">
        {/* First post */}
        <div className="mb-8">
          <div className="text-xs text-gray-500 text-right mb-1">5d ago</div>
          <div className="flex justify-center mb-2">
            <div className="relative">
              {/* Stacked polaroids */}
              <div className="polaroid absolute top-0 left-0 rotate-[-5deg] z-10">
                <div className="relative aspect-square w-32 h-32 mb-2">
                  <Image
                    src="/placeholder.svg?height=128&width=128"
                    alt="Bracelet"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="polaroid absolute top-2 left-8 rotate-[5deg] z-20">
                <div className="relative aspect-square w-32 h-32 mb-2">
                  <Image
                    src="/placeholder.svg?height=128&width=128"
                    alt="Bracelet on wrist"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="polaroid absolute top-4 left-16 rotate-[-2deg] z-30">
                <div className="relative aspect-square w-32 h-32 mb-2">
                  <Image
                    src="/placeholder.svg?height=128&width=128"
                    alt="Bracelet closeup"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              {/* Spacer div to maintain height */}
              <div className="w-64 h-48"></div>
            </div>
          </div>

          {/* User info and comment */}
          <div className="flex items-center mt-8">
            <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
              <Image
                src="/placeholder.svg?height=40&width=40"
                alt="Jessica"
                width={40}
                height={40}
                className="object-cover"
              />
            </div>
            <div className="flex-1">
              <p className="font-medium text-sm">JESSICA</p>
              <p className="text-xs">cute beaded bracelet!</p>
            </div>
            <button className="p-1">
              <MessageCircle className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Second post */}
        <div className="mb-8">
          <div className="text-xs text-gray-500 text-right mb-1">1w ago</div>
          <div className="flex justify-center mb-2">
            <div className="relative">
              {/* Stacked polaroids */}
              <div className="polaroid absolute top-0 left-0 rotate-[-5deg] z-10">
                <div className="relative aspect-square w-32 h-32 mb-2">
                  <Image
                    src="/placeholder.svg?height=128&width=128"
                    alt="Pottery"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="polaroid absolute top-2 left-8 rotate-[5deg] z-20">
                <div className="relative aspect-square w-32 h-32 mb-2">
                  <Image
                    src="/placeholder.svg?height=128&width=128"
                    alt="Pottery closeup"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              {/* Spacer div to maintain height */}
              <div className="w-64 h-48"></div>
            </div>
          </div>

          {/* User info and comment */}
          <div className="flex items-center mt-8">
            <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
              <Image
                src="/placeholder.svg?height=40&width=40"
                alt="Sam"
                width={40}
                height={40}
                className="object-cover"
              />
            </div>
            <div className="flex-1">
              <p className="font-medium text-sm">SAM</p>
              <p className="text-xs">
                pottery made by me :) don't use it much who wants?
              </p>
            </div>
            <button className="p-1">
              <MessageCircle className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Add more posts button */}
        <div className="flex justify-center mt-8">
          <Link href="/social/highlights">
            <button className="w-12 h-12 rounded-full border flex items-center justify-center">
              <Plus className="h-6 w-6" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
