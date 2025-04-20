"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useItems } from "@/hooks/use-items";

export default function NegativesDetailPage() {
  const router = useRouter();
  const params = useParams();
  const itemId = params.id as string;
  const { getItem } = useItems();
  const item = getItem(itemId);

  if (!item) {
    return <div>Item not found</div>;
  }

  // Combine the item itself with its memories for display
  const allMemories = [
    {
      id: "item",
      date:
        item.date.split(" ")[0].split(".").slice(0, 2).join(".") +
        "." +
        item.date.split(" ")[0].split(".")[2].slice(-2),
      description: item.story,
      image: item.image,
    },
    ...item.memories.map((memory) => ({
      ...memory,
      date:
        memory.date.split(" ")[0].split(".").slice(0, 2).join(".") +
        "." +
        memory.date.split(" ")[0].split(".")[2].slice(-2),
    })),
  ];

  // Split memories into chunks of 5 for each film strip row
  function chunkMemories(memories: typeof allMemories, size: number) {
    const result = [];
    for (let i = 0; i < memories.length; i += size) {
      result.push(memories.slice(i, i + size));
    }
    return result;
  }
  const memoryRows = chunkMemories(allMemories, 5);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container px-0 py-6 lg:flex lg:flex-col pb-0">
        <div className="flex justify-center mb-6">
          <div className="flex flex-col px-4 py-1 text-xs uppercase tracking-tight text-center bg-white">
            <div className="py-1 mb-4 border rounded-full inline-block">
              {item.name}
            </div>
            <div className="  inline-block">
              {allMemories[0].date} - {allMemories[allMemories.length - 1].date}
            </div>
          </div>
        </div>

        <div className="space-y-8 pb-4">
          {memoryRows.map((row, rowIdx) => (
            <div key={rowIdx} className="space-y-2">
              <div className="flex bg-black cursor-pointer w-full">
                {/* Film strip panels */}
                {Array(5)
                  .fill(0)
                  .map((_, index) => {
                    const memory = row[index];
                    return (
                      <div
                        key={index}
                        className="flex-1 min-w-0 h-20 sm:h-32 md:h-40 border-2 border-black/20 relative bg-black flex flex-col mx-[1px]"
                        style={{ maxWidth: "20%" }}
                      >
                        {/* Film holes - top */}
                        <div className="flex justify-between px-1 pt-1">
                          {Array(8)
                            .fill(0)
                            .map((_, holeIdx) => (
                              <div
                                key={holeIdx}
                                className="w-1.5 h-2 sm:w-2 sm:h-3 md:w-3 md:h-4 rounded-sm bg-white"
                              />
                            ))}
                        </div>
                        {/* Film image */}
                        <div className="flex-1 flex items-center justify-center relative overflow-hidden">
                          {memory ? (
                            <div className="w-full h-full relative overflow-hidden">
                              <Image
                                src={memory.image}
                                alt={memory.description}
                                fill
                                className="object-cover filter sepia"
                              />
                            </div>
                          ) : null}
                        </div>
                        {/* Film holes - bottom */}
                        <div className="flex justify-between px-1 pb-1">
                          {Array(8)
                            .fill(0)
                            .map((_, holeIdx) => (
                              <div
                                key={holeIdx}
                                className="w-1.5 h-2 sm:w-2 sm:h-3 md:w-3 md:h-4 rounded-sm bg-white"
                              />
                            ))}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>

        {/* Floating button to go back to negatives */}
        <div className="absolute top-4 left-4 z-10">
          <Link href="/negatives">
            <button className="w-12 h-12 flex items-center justify-center">
              <ChevronLeft className="h-10 w-10 stroke-[0.5]" />
            </button>
          </Link>
        </div>
      </main>
    </div>
  );
}
