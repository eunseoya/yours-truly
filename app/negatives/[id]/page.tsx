"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
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
      date: item.date,
      description: item.story,
      image: item.image,
    },
    ...item.memories,
  ];

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
              {item.date} - {item.date}
            </div>
          </div>
        </div>

        <div className="space-y-8 pb-4">
          {allMemories.map((memory) => (
            <div key={memory.id} className="space-y-2">
              <div className="flex overflow-x-hidden space-x-2 bg-black cursor-pointer">
                {/* Film strip panels */}
                {Array(5)
                  .fill(0)
                  .map((_, index) => (
                    <div
                      key={index}
                      className={`flex-shrink-0 w-48 h-40 border-2 border-black/20 relative bg-black flex flex-col`}
                    >
                      {/* Film holes - top */}
                      <div className="flex justify-between py-1">
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
                              src={memory.image}
                              alt={memory.description}
                              fill
                              className="object-cover filter sepia"
                            />
                          </div>
                        ) : null}
                      </div>
                      {/* Film holes - bottom */}
                      <div className="flex justify-between py-1">
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

        {/* Floating button to go back to negatives */}
        <div className="fixed bottom-8 left-8 z-10 lg:hidden">
          <Link href="/negatives">
            <Button
              size="icon"
              className="h-14 w-14 rounded-full border-2 border-white/20 bg-neutral-800 font-light hover:bg-neutral-700"
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
