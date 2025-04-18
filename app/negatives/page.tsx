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

  const handleFilmStripClick = (itemId: string) => {
    router.push(`/negatives/${itemId}`);
  };

  return (
    <div className="min-h-scree bg-white">
      <Header />
      <main className="container sm:max-w-none max-w-md mx-auto px-4 py-6 lg:flex lg:flex-col lg:h-[calc(90vh)] pb-0">
        <div className="space-y-8 pb-4">
          {items.map((item) => (
            <div key={item.id} className="space-y-2">
              <div
                className="flex overflow-x-hidden space-x-2 bg-black cursor-pointer"
                onClick={() => handleFilmStripClick(item.id)}
              >
                {/* Item info */}
                <div className="w-32 h-auto uppercase font-light flex flex-col bg-white justify-center overflow-hidden flex-shrink-0">
                  <div className="truncate">{item.name}</div>
                  <div className="mb-2 px-3 py-1 text-xs uppercase tracking-wider whitespace-nowrap mt-2">
                    {item.date}
                  </div>
                </div>

                {/* Film strip panels */}
                {Array(5)
                  .fill(0)
                  .map((_, index) => (
                    <div
                      key={index}
                      className={`flex-shrink-0 w-48 h-40 border-2 border-black/20 relative bg-black flex flex-col`}
                    >
                      {/* Film holes - top */}
                      <div className="flex justify-between px-2 pt-1">
                        {Array(8)
                          .fill(0)
                          .map((_, holeIdx) => (
                            <div
                              key={holeIdx}
                              className="w-3 h-4 rounded-sm bg-white"
                              style={{}}
                            />
                          ))}
                      </div>
                      {/* Film image */}
                      <div className="flex-1 flex items-center justify-center relative overflow-hidden">
                        {index < item.memories.length ? (
                          <div className="w-full h-full relative overflow-hidden">
                            <Image
                              src={item.memories[index].image}
                              alt={item.memories[index].description}
                              fill
                              className="object-cover filter sepia"
                            />
                          </div>
                        ) : null}
                      </div>
                      {/* Film holes - bottom */}
                      <div className="flex justify-between px-2 pb-1">
                        {Array(8)
                          .fill(0)
                          .map((_, holeIdx) => (
                            <div
                              key={holeIdx}
                              className="w-3 h-4 rounded-sm bg-white"
                              style={{}}
                            />
                          ))}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>

        {/* Floating button to go back to Archive */}
        <div className="fixed bottom-8 left-8 z-10 lg:hidden">
          <Link href="/archive">
            <Button
              size="icon"
              className="h-14 w-14 rounded-full border-2 border-white/2 font-light hover:bg-neutral-700"
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
