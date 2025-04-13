"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Plus, Grid, List } from "lucide-react";
import { useItems } from "@/hooks/use-items";
import Link from "next/link";
import { isItemUnused } from "@/lib/utils";

export default function ItemPage() {
  const params = useParams();
  const itemId = params.id as string;
  const { getItem } = useItems();
  const item = getItem(itemId);
  const [viewMode, setViewMode] = useState<"timeline" | "grid">("timeline");

  if (!item) {
    return <div>Item not found</div>;
  }

  // Check if the item is unused (more than 1 month)
  const unused = isItemUnused(item);

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
      <main className="container max-w-md mx-auto p-4">
        {/* Category label with view toggle */}
        <div className="flex justify-center mb-6">
          <div className="px-4 py-1 border rounded-full text-xs uppercase tracking-wider inline-block bg-white">
            {item.category}
          </div>
          <button
            className="ml-2 p-1 border rounded-full"
            onClick={() =>
              setViewMode(viewMode === "timeline" ? "grid" : "timeline")
            }
            aria-label={`Switch to ${viewMode === "timeline" ? "grid" : "timeline"} view`}
          >
            {viewMode === "timeline" ? (
              <Grid className="h-4 w-4" />
            ) : (
              <List className="h-4 w-4" />
            )}
          </button>
        </div>

        {viewMode === "timeline" ? (
          /* Timeline view */
          <div className="space-y-12">
            {allMemories.map((memory, index) => (
              <div key={memory.id} className="relative">
                {/* For even indices (0, 2, 4...), image on left, text on right */}
                {index % 2 === 0 ? (
                  <div className="flex">
                    <div className="w-1/2 pr-2">
                      <div className="polaroid relative">
                        <div className="relative aspect-square w-full mb-2">
                          <Image
                            src={memory.image || "/placeholder.svg"}
                            alt={item.name}
                            fill
                            className={`object-cover ${unused ? "opacity-50" : ""}`}
                          />
                          {unused && (
                            <div className="absolute inset-0 bg-white bg-opacity-50 backdrop-blur-sm flex items-center justify-center">
                              {/* <div className="text-xs text-center text-gray-500 p-2">Unused for over a month</div> */}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="w-1/2 pl-2 flex flex-col justify-start">
                      <p className="text-xs text-gray-500">{memory.date}</p>
                      <p
                        className="text-xs mt-1"
                        style={{ filter: unused ? "blur(5px)" : "none" }}
                      >
                        {memory.description}
                      </p>
                    </div>
                  </div>
                ) : (
                  /* For odd indices (1, 3, 5...), text on left, image on right */
                  <div className="flex">
                    <div className="w-1/2 pr-2 flex flex-col justify-start items-end text-right">
                      <p className="text-xs text-gray-500">{memory.date}</p>
                      <p
                        className="text-xs mt-1"
                        style={{ filter: unused ? "blur(5px)" : "none" }}
                      >
                        {memory.description}
                      </p>
                    </div>
                    <div className="w-1/2 pl-2">
                      <div className="polaroid relative">
                        <div className="relative aspect-square w-full mb-2">
                          <Image
                            src={memory.image || "/placeholder.svg"}
                            alt={item.name}
                            fill
                            className={`object-cover ${unused ? "opacity-50" : ""}`}
                          />
                          {unused && (
                            <div className="absolute inset-0 bg-white bg-opacity-50 backdrop-blur-sm flex items-center justify-center">
                              {/* <div className="text-xs text-center text-gray-500 p-2">Unused for over a month</div> */}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          /* Grid view */
          <div className="grid grid-cols-2 gap-4">
            {allMemories.map((memory) => (
              <div key={memory.id} className="flex flex-col items-center">
                <div className="polaroid w-full relative">
                  <div className="relative aspect-square w-full mb-2">
                    <Image
                      src={memory.image || "/placeholder.svg"}
                      alt={item.name}
                      fill
                      className={`object-cover ${unused ? "opacity-50" : ""}`}
                    />
                    {unused && (
                      <div className="absolute inset-0 bg-white bg-opacity-50 backdrop-blur-sm flex items-center justify-center">
                        {/* <div className="text-xs text-center text-gray-500 p-2">Unused for over a month</div> */}
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 text-center">
                    {memory.date}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Unused item notification */}
        {unused && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t rounded-t-3xl p-4">
            <div className="flex items-start mb-4">
              <div className="relative w-16 h-16 mr-3">
                <Image
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
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
              <Link href={`/item/${itemId}/add-memory`}>
                <button className="w-12 h-12 rounded-full border flex items-center justify-center">
                  <Plus className="h-6 w-6" />
                </button>
              </Link>
            </div>
          </div>
        )}

        {/* Add memory button (only show if not in unused state) */}
        {!unused && (
          <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2">
            <Link href={`/item/${itemId}/add-memory`}>
              <Button
                size="icon"
                className="h-14 w-14 rounded-full border-2 border-gray-200 bg-white text-gray-500 hover:bg-gray-50"
              >
                <Plus className="h-6 w-6" />
              </Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
