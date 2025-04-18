"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Plus, Minus, Grid, List, Users, ChevronLeft } from "lucide-react";
import { useItems } from "@/hooks/use-items";
import Link from "next/link";
import { isItemUnused } from "@/lib/utils";

export default function ItemPage() {
  const params = useParams();
  const itemId = params.id as string;
  const { getItem } = useItems();
  const item = getItem(itemId);
  const [viewMode, setViewMode] = useState<"timeline" | "grid">("timeline");
  const [selectedHighlights, setSelectedHighlights] = useState<string[]>([]);
  const [showGoodbyeModal, setShowGoodbyeModal] = useState(false);

  // Function to toggle like status of a memory
  const toggleLike = (memoryId: string) => {
    setSelectedHighlights((prev) =>
      prev.includes(memoryId)
        ? prev.filter((id) => id !== memoryId)
        : [...prev, memoryId],
    );
  };

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

  // Calculate padding needed when popups are visible
  const bottomPadding =
    unused || (viewMode === "grid" && selectedHighlights.length > 0)
      ? "pb-64" // Add significant bottom padding when popups are present
      : "";

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container max-w-md mx-auto p-4">
        {/* Item name with view toggle */}
        <div className="flex justify-center mb-6">
          <div className="px-4 py-1 border rounded-full text-xs uppercase tracking-wider inline-block bg-white">
            {item.name}
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
                      <div className="polaroid relative -rotate-3">
                        {/* Image container */}
                        <div className="relative aspect-[3/4] w-full mb-2">
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
                      <div className="polaroid relative rotate-3">
                        <div className="relative aspect-[3/4] w-full mb-2">
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
          <div className={`grid grid-cols-4 gap-4 ${bottomPadding}`}>
            {allMemories.map((memory) => (
              <div key={memory.id} className="flex flex-col items-center">
                <div
                  className={`polaroid-small w-full relative`}
                  style={{ transform: `rotate(${Math.random() * 10 - 5}deg)` }}
                >
                  <div className="relative aspect-square w-full mb-2">
                    <Image
                      src={memory.image || "/placeholder.svg"}
                      alt={item.name}
                      fill
                      className={`object-cover ${unused ? "opacity-50" : ""}`}
                    />
                    {unused && (
                      <div className="absolute inset-0 bg-white bg-opacity-50 backdrop-blur-sm flex items-center justify-center"></div>
                    )}
                  </div>
                </div>
                {/* heart - now clickable and fills with pink when liked */}
                <div className="mt-2 flex justify-end w-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6 cursor-pointer transition-colors"
                    viewBox="0 0 24 24"
                    fill={
                      selectedHighlights.includes(memory.id)
                        ? "#FFEEF3"
                        : "none"
                    }
                    stroke="currentColor"
                    strokeWidth="0.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    onClick={() => toggleLike(memory.id)}
                  >
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Unused item notification */}
        {unused && !showGoodbyeModal && (
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
                <p>don't want me anymore?</p>
                <p>find me a new home</p>
              </div>
              <div className="text-right">
                <p>upload a new photo</p>
                <p>to view me again</p>
              </div>
            </div>

            <div className="flex justify-between">
              {/* minus */}
              <button
                className="w-12 h-12 rounded-full bg-white border border-gray-500 flex items-center justify-center"
                onClick={() => setShowGoodbyeModal(true)}
              >
                <Minus className="h-10 w-10 stroke-[0.5]" />
              </button>
              {/* plus */}
              <Link href={`/item/${itemId}/add-memory`}>
                <button className="w-12 h-12 rounded-full bg-white border border-gray-500 flex items-center justify-center">
                  <Plus className="h-10 w-10 stroke-[0.5]" />
                </button>
              </Link>
            </div>
          </div>
        )}

        {/* Goodbye modal */}
        {unused && showGoodbyeModal && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t rounded-t-3xl p-4">
            <div className="flex items-start mb-8">
              <div className="relative w-16 h-16 mr-3">
                <Image
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  width={64}
                  height={64}
                  className="object-cover border"
                />
              </div>
              <div className="flex-1">
                <p className="uppercase text-sm font-medium mb-1">
                  Ready to say goodbye?
                </p>
                <p className="text-xs uppercase text-gray-700">
                  donate or share with friends
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center mb-4">
              <button
                className="w-12 h-12 rounded-full bg-white border border-gray-500 flex items-center justify-center"
                onClick={() => setShowGoodbyeModal(false)}
              >
                <ChevronLeft className="h-10 w-10 stroke-[0.5]" />
              </button>

              <button className="w-12 h-12 rounded-full bg-white border border-gray-500 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={0.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                  />
                </svg>
              </button>
              <button className="w-12 h-12 rounded-full bg-white border border-gray-500 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={0.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                  />
                </svg>
              </button>

              <button
                className="w-12 h-12 rounded-full bg-white border border-gray-500 flex items-center justify-center"
                onClick={() => {
                  setViewMode("grid");
                  setSelectedHighlights(allMemories.map((memory) => memory.id));
                }}
              >
                <Users className="h-6 w-6 stroke-[0.5]" />
              </button>
            </div>
          </div>
        )}

        {/* selected highlights bottom popup modal */}
        {viewMode === "grid" && selectedHighlights.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t rounded-t-3xl p-4">
            {/* Display selected memories as a stacked pile */}
            <div className="flex justify-center mb-4">
              <div className="relative h-24 w-20">
                {/* Take the last 3 selected items for display in the stack */}
                {selectedHighlights
                  .slice(-3)
                  .reverse()
                  .map((highlightId, index) => {
                    const memory = allMemories.find(
                      (m) => m.id === highlightId,
                    );
                    if (!memory) return null;

                    // Calculate rotation for each item in stack
                    const rotation = index % 2 === 0 ? 3 : -3;

                    return (
                      <div
                        key={`stack-${memory.id}`}
                        className="absolute polaroid-small"
                        style={{
                          zIndex: index,
                          transform: `rotate(${rotation}deg)`,
                          width: "100%",
                          height: "100%",
                        }}
                      >
                        <div className="relative aspect-[3/4] w-full h-full">
                          <Image
                            src={memory.image || "/placeholder.svg"}
                            alt={item.name}
                            fill
                            className="object-cover border"
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-center">
                <p className="uppercase text-sm font-light">
                  Select highlights to share
                </p>
              </div>
            </div>
            <div className="flex flex-col items-center text-xs tracking-tighter text-gray-500 mb-4">
              <p>i'm ready for a second chance</p>
              <p>(with someone else)</p>
            </div>

            <div className="flex flex-col items-center">
              <Link href={`/social/post-highlights`}>
                <button className="w-12 h-12 rounded-full border border-gray-500 flex items-center justify-center">
                  <Plus className="h-10 w-10 stroke-[0.5]" />
                </button>
              </Link>
            </div>
          </div>
        )}

        {/* Add memory button (only show if not in unused state) */}
        {viewMode === "timeline" && !unused && (
          <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2">
            <Link href={`/item/${itemId}/add-memory`}>
              <button className="w-12 h-12 rounded-full bg-white border border-gray-500 flex items-center justify-center">
                <Plus className="h-10 w-10 stroke-[0.5]" />
              </button>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
