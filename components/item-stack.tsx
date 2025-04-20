"use client";

import Link from "next/link";
import Image from "next/image";
import { Plus } from "lucide-react";
import { formatTimeAgo, isItemUnused, getLastUsedDate } from "@/lib/utils";
import type { Item } from "@/types";
interface ItemStackProps {
  item: Item;
}

export function ItemStack({ item }: ItemStackProps) {
  // Show item card + all memories as stack
  // Oldest memory at the top (lowest z), newest at the bottom (highest z before item card)
  const memoriesSorted = [...item.memories].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  const stackItems = [
    ...memoriesSorted.map((memory) => ({
      type: "memory" as const,
      image: memory.image,
      alt: memory.description || item.name,
    })),
    { type: "item" as const, image: item.image, alt: item.name },
  ];

  // Format the last update time
  const lastUsedDate = getLastUsedDate(item);
  const lastUpdateTime = lastUsedDate ? formatTimeAgo(lastUsedDate) : "N/A";

  // Check if the item is unused (more than 1 month)
  const unused = isItemUnused(item);

  return (
    <div className="relative">
      {/* Polaroid stack */}
      <Link href={`/item/${item.id}`}>
        <div className="relative" style={{ height: `${175 + (stackItems.length - 1) * 25}px` }}>
          {stackItems.map((stackItem, index) => (
            <div
              key={index}
              className="absolute polaroid shadow-md"
              style={{
                top: `${index * 28}px`,
                zIndex: index + 1, // oldest memory = 1, ..., item card = highest
                transform: `rotate(${index % 2 === 0 ? -1 : 1}deg)`,
              }}
            >
{/* Notification dot on the topmost card */}
                {unused && index === stackItems.length - 1 && (
                  <div className="absolute border border-black -right-1 -top-1 w-5 h-5 bg-red-400 rounded-full z-20"></div>
                )}
              <div className="relative aspect-[3/4] w-full h-[120px] mb-2  ">
              
                <Image
                  src={stackItem.image || "/logo.png"}
                  alt={stackItem.alt}
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
          ))}
        </div>
      </Link>

      {/* Last update indicator */}
      <div className="flex items-center mt-2 text-xs text-gray-500">
        <Link href={`/item/${item.id}/add-memory`} aria-label="Add memory">
          <div className="flex items-center justify-center w-5 h-5 rounded-full border mr-1">
            <Plus className="w-3 h-3" />
          </div>
        </Link>
        <div>
          <p className="text-[10px]">last update</p>

          <p className="ml-1 font-medium">{lastUpdateTime}</p>
        </div>
      </div>
    </div>
  );
}
