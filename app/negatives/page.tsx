"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useItems } from "@/hooks/use-items";

export default function NegativesPage() {
  const { items } = useItems();
  const router = useRouter();

  const negativesItems = items.filter((item) => item.negatives);

  const handleFilmStripClick = (itemId: string) => {
    router.push(`/negatives/${itemId}`);
  };

  return (
    <div className="min-h-scree bg-white">
      <Header />
      <main className="container sm:max-w-none mx-auto pr-0 pl-2 py-6 lg:flex lg:flex-col lg:h-[calc(90vh)] pb-0">
        <div className="space-y-8 pb-4">
          {negativesItems.map((item) => (
            <div key={item.id} className="space-y-2">
              <div
                className="flex bg-black cursor-pointer"
                onClick={() => handleFilmStripClick(item.id)}
              >
                {/* Item info */}
                <div className="w-24 sm:w-32 h-auto uppercase text-xs sm:text-sm font-light flex flex-col bg-white justify-center overflow-hidden flex-shrink-0">
                  <div className="truncate">{item.name}</div>
                  <div className="mb-2 py-1 text-xs uppercase tracking-wider whitespace-nowrap mt-2">
                    {item.date}
                  </div>
                </div>

                {/* Film strip panels - cut off at right edge, no scroll */}
                <div className="flex-1 overflow-hidden">
                  <div className="flex flex-nowrap w-full">
                    {(() => {
                      // Compose array: [item.image, ...item.memories[].image]
                      const images = [
                        { src: item.image, alt: item.name },
                        ...item.memories.map((m) => ({
                          src: m.image,
                          alt: m.description,
                        })),
                      ];
                      const panels =
                        images.length <= 5 ? images : images.slice(0, 5);
                      return panels.map((img, index) => (
                        <div
                          key={index}
                          className="flex-1 min-w-0 h-20 sm:h-32 md:h-40 border-2 border-black/20 relative bg-black flex flex-col mx-[1px]"
                          style={{ maxWidth: "20%" }}
                        >
                          {/* Film holes - top */}
                          <div className="flex justify-between px-1 pt-1">
                            {Array(7)
                              .fill(0)
                              .map((_, holeIdx) => (
                                <div
                                  key={holeIdx}
                                  className="w-1 h-1.5 sm:w-2 sm:h-3 md:w-3 md:h-4 rounded-sm bg-white"
                                />
                              ))}
                          </div>
                          {/* Film image */}
                          <div className="flex-1 flex items-center justify-center relative overflow-hidden">
                            <div className="w-full h-full relative overflow-hidden">
                              <Image
                                src={img.src}
                                alt={img.alt}
                                fill
                                className="object-cover filter sepia"
                              />
                            </div>
                          </div>
                          {/* Film holes - bottom */}
                          <div className="flex justify-between px-1 pb-1">
                            {Array(7)
                              .fill(0)
                              .map((_, holeIdx) => (
                                <div
                                  key={holeIdx}
                                  className="w-1 h-1.5 sm:w-2 sm:h-3 md:w-3 md:h-4 rounded-sm bg-white"
                                />
                              ))}
                          </div>
                        </div>
                      ));
                    })()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
