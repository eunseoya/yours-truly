"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";

export default function MemoriesPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Custom header with back button */}
      <div className="border-b py-4">
        <div className="container max-w-md mx-auto px-4 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <Link
            href="/home"
            className="font-serif italic text-xl text-gray-800 translate-x-4"
          >
            <Image src="/title.svg" alt="title" width={100} height={50} />
          </Link>
          <div className="w-5" />
        </div>
      </div>

      {/* Toggle buttons */}
      <div className="flex justify-center my-4">
        <div className="flex border rounded-full overflow-hidden">
          <button className="px-4 py-1 text-xs bg-black text-white">BAG</button>
          <button className="px-4 py-1 text-xs bg-white text-black">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="1"
                y="1"
                width="6"
                height="6"
                stroke="currentColor"
                strokeWidth="1"
              />
              <rect
                x="9"
                y="1"
                width="6"
                height="6"
                stroke="currentColor"
                strokeWidth="1"
              />
              <rect
                x="1"
                y="9"
                width="6"
                height="6"
                stroke="currentColor"
                strokeWidth="1"
              />
              <rect
                x="9"
                y="9"
                width="6"
                height="6"
                stroke="currentColor"
                strokeWidth="1"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Memories content */}
      <div className="flex-1 container max-w-md mx-auto px-4 py-4 relative">
        {/* First memory */}
        <div className="mb-12">
          <div className="flex justify-end mb-1">
            <div className="text-xs text-gray-500">12.01.25</div>
          </div>
          <div className="flex">
            <div className="polaroid w-40 rotate-[-2deg]">
              <div className="relative aspect-square w-full mb-2">
                <Image
                  src="/placeholder.svg?height=160&width=160"
                  alt="Memory"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div className="flex-1 pl-4 text-xs text-gray-500 italic">
              my essential items recently
            </div>
          </div>
        </div>

        {/* Second memory */}
        <div className="mb-12">
          <div className="flex mb-1">
            <div className="text-xs text-gray-500">30.01.25</div>
          </div>
          <div className="flex flex-row-reverse">
            <div className="polaroid w-40 rotate-[2deg]">
              <div className="relative aspect-square w-full mb-2">
                <Image
                  src="/placeholder.svg?height=160&width=160"
                  alt="Memory"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div className="flex-1 pr-4 text-xs text-gray-500 italic text-right">
              matched my outfit today
            </div>
          </div>
        </div>
      </div>

      {/* Bottom notification */}
      <div className="bg-white border-t rounded-t-3xl p-4">
        <div className="flex items-start mb-4">
          <div className="relative w-16 h-16 mr-3">
            <Image
              src="/placeholder.svg?height=64&width=64"
              alt="Forgotten item"
              width={64}
              height={64}
              className="object-cover border"
            />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full"></div>
          </div>
          <div className="flex-1">
            <p className="uppercase text-sm font-medium mb-1">
              Memories are hidden
            </p>
            <p className="text-xs text-gray-700">
              YOU SEEM TO HAVE FORGOTTEN ME...
            </p>
          </div>
        </div>

        <div className="flex justify-between text-xs text-gray-500 mb-4">
          <div>
            <p>don't want it anymore?</p>
            <p>share with friends</p>
          </div>
          <div className="text-right">
            <p>upload a new photo</p>
            <p>to view again</p>
          </div>
        </div>

        <div className="flex justify-between">
          <button className="w-12 h-12 rounded-full border flex items-center justify-center">
            <div className="w-6 h-0.5 bg-black"></div>
          </button>
          <Link href="/add">
            <button className="w-12 h-12 rounded-full border flex items-center justify-center">
              <Plus className="h-6 w-6" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
