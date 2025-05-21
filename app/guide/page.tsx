"use client";
import Image from "next/image";
import { Header } from "@/components/header";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const guideSteps = [
  {
    description: "Upload a photo of something you own—old or new.",
    image: "/guide_1.png",
    imageAlt: "Camera",
  },
  {
    description: "Tell its story. What's its name? Where's it from?",
    image: "/guide_2.png",
    imageAlt: "Memory",
  },
  {
    description: "With each new item, your archive grows into a museum of the things you love most.",
    image: "/guide_3.png",
    imageAlt: "Archive/Envelope",
  },
  {
    description: "See where your things have been and how they've changed.",
    image: "/guide_4.png",
    imageAlt: "Archive",
  },
  {
    description: "If you've forgotten about an item, Yours Truly will help you remember. Upload a new photo to continue making memories.",
    image: "/guide_5.png",
    imageAlt: "Share",
  },
  {
    description: "But if you're ready to move on, let it go with love. Donate it or share it with your friends.",
    image: "/guide_6.png",
    imageAlt: "Explore",
  },
  {
    description: "Select your favorite moments together and share them with friends who might love it next.",
    image: "/guide_7.png",
    imageAlt: "Share",
  },
  {
    description: "Discover what your friends are sharing. and maybe find a new story to add to your own.",
    image: "/guide_8.png",
    imageAlt: "Explore",
  },
  {
    description: "Relive passed-on items in the Negatives page, because memories deserve to be preserved.",
    image: "/guide_9.png",
    imageAlt: "Share",
  },
  {
    description: "If our belongings are shaped by use, then to use them is to care. How will you show your care today?",
    image: "/guide_10.png",
    imageAlt: "Explore",
  },
];

export default function GuidePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container max-w-2xl mx-auto p-4">
        <div className="relative flex flex-col items-center">
          {/* Vertical line */}
          <div
            className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-black"
            style={{ transform: "translateX(-0.5px)" }}
          />

          <div className="flex flex-col gap-12 md:gap-16 w-full z-10">
            {guideSteps.map((step, idx) => (
              <div
                key={idx}
                className={`flex flex-row items-center w-full relative ${
                  idx % 2 === 0 ? "" : "flex-row-reverse"
                }`}
              >
                {/* Text */}
                <div
                  className={`w-2/5 flex ${
                  idx % 2 === 0
                    ? "justify-end pr-1"
                    : "justify-start pl-1"
                  } mb-0`}
                >
                  <div
                  className={`max-w-xs text-xs break-words ${
                    idx % 2 === 0
                    ? "text-right ml-12"
                    : "text-left mr-12"
                  }`}
                  >
                  <p className="text-gray-700">{step.description}</p>
                  </div>
                  {/* Leading line */}
                  <div
                  className={`absolute top-1/2 w-1/12 h-[1px] bg-black ${
                    idx % 2 === 0
                    ? "right-1/2"
                    : "left-1/2"
                  }`}
                  style={{ transform: "translateY(0)" }}
                  />
                </div>
                {/* Image */}
                <div
                  className={`w-3/5 flex ${
                    idx % 2 === 0
                      ? "justify-start pl-1 md:pl-2"
                      : "justify-end pr-1 md:pr-2"
                  }`}
                >
                  <div className="flex justify-center w-full">
                    <Image
                      src={step.image}
                      alt={step.imageAlt}
                      width={70}
                      height={70}
                      className="rounded-md bg-white md:w-[100px] md:h-[100px] w-[70px] h-[70px]"
                      style={{ maxWidth: "100%", height: "auto" }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
