"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Heart, Plus } from "lucide-react";
import Link from "next/link";

// Mock data for the grid of images
const gridImages = Array.from({ length: 10 }, (_, i) => ({
  id: `img-${i + 1}`,
  src: "/placeholder.svg?height=120&width=120",
  alt: `Item ${i + 1}`,
  liked: false,
}));

export default function HighlightsPage() {
  const router = useRouter();
  const [images, setImages] = useState(gridImages);

  const toggleLike = (id: string) => {
    setImages(
      images.map((img) =>
        img.id === id ? { ...img, liked: !img.liked } : img,
      ),
    );
  };

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

      {/* Grid of images */}
      <div className="flex-1 container max-w-md mx-auto px-4 py-4">
        <div className="grid grid-cols-4 gap-2">
          {images.map((img) => (
            <div key={img.id} className="flex flex-col items-center">
              <div className="polaroid w-full mb-1">
                <div className="relative aspect-square w-full mb-1">
                  <Image
                    src={img.src || "/placeholder.svg"}
                    alt={img.alt}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <button
                className="p-1"
                onClick={() => toggleLike(img.id)}
                aria-label={img.liked ? "Unlike" : "Like"}
              >
                <Heart className={`h-4 w-4 ${img.liked ? "fill-black" : ""}`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom section */}
      <div className="bg-white border-t rounded-t-3xl p-4">
        <div className="flex justify-center mb-2">
          <div className="relative w-16 h-16">
            <div className="absolute top-0 left-0 polaroid w-12 h-12 rotate-[-5deg] z-10">
              <Image
                src="/placeholder.svg?height=48&width=48"
                alt="Highlight"
                fill
                className="object-cover"
              />
            </div>
            <div className="absolute top-1 left-1 polaroid w-12 h-12 rotate-[2deg] z-20">
              <Image
                src="/placeholder.svg?height=48&width=48"
                alt="Highlight"
                fill
                className="object-cover"
              />
            </div>
            <div className="absolute top-2 left-2 polaroid w-12 h-12 rotate-[-2deg] z-30">
              <Image
                src="/placeholder.svg?height=48&width=48"
                alt="Highlight"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>

        <div className="text-center mb-4">
          <p className="uppercase text-xs font-medium mb-1">
            Select highlights to share
          </p>
          <p className="text-xs text-gray-500">
            I'm ready for a second chance
            <br />
            (with someone else)
          </p>
        </div>

        <div className="flex justify-center">
          <button className="w-12 h-12 rounded-full border flex items-center justify-center">
            <Plus className="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
