"use client";

import { useState, useRef } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Minus,
  Grid,
  List,
  Users,
  ChevronLeft,
  Camera,
  Images,
} from "lucide-react";
import { useItems } from "@/hooks/use-items";
import Link from "next/link";
import { isItemUnused } from "@/lib/utils";

export default function ItemPage() {
  const params = useParams();
  const itemId = params.id as string;
  const { getItem, updateItem } = useItems(); // Add updateItem function from useItems
  const item = getItem(itemId);
  const [viewMode, setViewMode] = useState<"timeline" | "grid">("timeline");
  const [selectedHighlights, setSelectedHighlights] = useState<string[]>([]);
  const [showGoodbyeModal, setShowGoodbyeModal] = useState(false);
  const [showCaptionModal, setShowCaptionModal] = useState(false);
  const [caption, setCaption] = useState("");
  const [posting, setPosting] = useState(false);
  const captionInputRef = useRef<HTMLInputElement>(null);

  // Function to toggle like status of a memory
  const toggleLike = (memoryId: string) => {
    setSelectedHighlights((prev) =>
      prev.includes(memoryId)
        ? prev.filter((id) => id !== memoryId)
        : [...prev, memoryId],
    );
  };

  const handleSetNegatives = () => {
    if (item) {
      updateItem(item.id, { negatives: true });
    }
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

  // Helper: get selected highlight objects
  const getSelectedHighlightObjects = () => {
    return selectedHighlights
      .map((id) => allMemories.find((m) => m.id === id))
      .filter(Boolean);
  };

  // Post highlights to social feed
  const handlePostHighlights = async () => {
    const highlights = getSelectedHighlightObjects();
    if (!caption || highlights.length === 0) {
      alert("Please enter a caption and select highlights.");
      return;
    }
    setPosting(true);
    await fetch("/api/post-highlights", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ highlights, user: "Me", caption }),
    });
    setPosting(false);
    setShowCaptionModal(false);
    setCaption("");
    setSelectedHighlights([]);
  };

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
                            <div className="absolute inset-0 bg-white bg-opacity-50 backdrop-blur-sm flex items-center justify-center"></div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="w-1/2 pl-2 flex flex-col justify-start">
                      <div className="flex items-center mb-1 mt-6">
                        <div className="w-1/4 h-px bg-black mr-2"></div>
                        <p className="text-xs">{memory.date}</p>
                      </div>
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
                      <div className="flex items-center mb-1 mt-6">
                        <p className="text-xs">{memory.date}</p>
                        <div className="w-12 h-px bg-black ml-2"></div>
                      </div>
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
                            <div className="absolute inset-0 bg-white bg-opacity-50 backdrop-blur-sm flex items-center justify-center"></div>
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
        {/* Unused item notification and Goodbye modal */}
        {unused && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t rounded-t-3xl font-light p-4">
            <div className="flex items-start mb-4">
              <div className="relative h-24 w-20">
                <div className="absolute polaroid-small w-full h-full">
                  <div className="relative aspect-[3/4] w-full h-full">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      fill
                      className="object-cover border"
                    />
                  </div>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 border border-black rounded-full"></div>
              </div>
              <div className="p-2 flex-1">
                <p className="uppercase text-sm mb-2">
                  {showGoodbyeModal
                    ? "Ready to say goodbye?"
                    : "Memories are hidden"}
                </p>
                <p className="uppercase text-sm text-gray-700">
                  {showGoodbyeModal
                    ? "donate or share with friends"
                    : "YOU SEEM TO HAVE FORGOTTEN ME..."}
                </p>
              </div>
            </div>

            {!showGoodbyeModal ? (
              <>
                <div className="flex justify-between text-xs tracking-tight text-gray-500 mb-4">
                  <div className="flex flex-col text-left items-center justify-center">
                    <p>don't want me anymore?</p>
                    <p>find me a new home</p>

                    <button
                      className="w-12 h-12 rounded-full bg-white border border-gray-500 flex mt-3 items-center justify-center"
                      onClick={handleSetNegatives}
                    >
                      <Minus className="h-10 w-10 stroke-[0.5]" />
                    </button>
                  </div>
                  <div className="flex flex-col text-left items-center justify-center">
                    <p>upload a new photo</p>
                    <p>to view me again</p>
                    <Link href={`/item/${itemId}/add-memory`}>
                      <button className="w-12 h-12 rounded-full bg-white border border-gray-500 flex mt-3 items-center justify-center">
                        <Plus className="h-10 w-10 stroke-[0.5]" />
                      </button>
                    </Link>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-between items-center mb-4">
                  <button
                    className="w-12 h-12 rounded-full bg-white border border-gray-500 flex items-center justify-center"
                    onClick={() => setShowGoodbyeModal(false)}
                  >
                    <ChevronLeft className="h-10 w-10 stroke-[0.5]" />
                  </button>
                  <Link
                    href="https://satruck.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src="https://8hxvw8tw.media.zestyio.com/shield-1.svg"
                      alt="Salvation Army"
                      className="h-12 w-12"
                    />
                  </Link>
                  <Link
                    href="https://cloop.sg/donate/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src="https://cloop.sg/wp-content/uploads/2022/09/Cloop-circle-logo-png-favicon-512-x-511-150x150.png"
                      alt="Cloop"
                      className="h-12 w-12"
                    />
                  </Link>
                  <button
                    className="w-12 h-12 rounded-full bg-white border border-gray-500 flex items-center justify-center"
                    onClick={() => {
                      setViewMode("grid");
                      setSelectedHighlights(
                        allMemories.map((memory) => memory.id),
                      );
                    }}
                  >
                    <Users className="h-6 w-6 stroke-[0.5]" />
                  </button>
                </div>
              </>
            )}
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
              <button
                className="w-12 h-12 rounded-full border border-gray-500 flex items-center justify-center"
                onClick={() => {
                  setShowCaptionModal(true);
                  setTimeout(() => captionInputRef.current?.focus(), 100);
                }}
              >
                <Plus className="h-10 w-10 stroke-[0.5]" />
              </button>
            </div>
          </div>
        )}

        {/* Caption Modal */}
        {showCaptionModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 shadow-lg w-80 flex flex-col items-center relative">
              <button
                className="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer"
                onClick={() => setShowCaptionModal(false)}
                disabled={posting}
                aria-label="Close"
              >
                ✕
              </button>
              <input
                ref={captionInputRef}
                className="my-4 px-3 py-2 border rounded w-full text-sm"
                placeholder="write a caption"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                maxLength={120}
                disabled={posting}
              />
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="px-4 py-2 rounded bg-white uppercase text-black border-gray-500"
                  onClick={handlePostHighlights}
                  disabled={posting}
                >
                  {posting ? "Sharing..." : "Share"}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Add memory button (only show if not in unused state) */}
        {viewMode === "timeline" && !unused && (
          <div className="fixed bottom-8 z-10 left-1/2 transform -translate-x-1/2">
            <div className="relative">
              <button
                onClick={(e) => {
                  const buttons =
                    e.currentTarget.parentElement?.querySelectorAll(
                      ".floating-action",
                    );
                  buttons?.forEach((button) => {
                    button.classList.toggle("hidden");
                  });
                }}
                className="w-12 h-12 rounded-full bg-white border border-gray-500 flex items-center justify-center"
              >
                <Plus className="h-10 w-10 stroke-[0.5]" />
              </button>
              <Link
                href={`/item/${itemId}/camera`}
                className="floating-action hidden border border-gray-500 absolute bottom-16 right-0 p-1 rounded-full bg-white flex items-center justify-center"
              >
                <Camera className="h-10 w-10 stroke-[0.5]" />
              </Link>
              <Link
                href={`/item/${itemId}/add-memory`}
                className="floating-action hidden border border-gray-500 absolute bottom-32 right-0 p-1 rounded-full bg-white flex items-center justify-center"
              >
                <Images className="h-10 w-10 stroke-[0.5]" />
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
