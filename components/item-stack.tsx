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
  // Calculate how many polaroids to show in the stack (item + memories)
  const totalPolaroids = item.memories.length + 1;

  // Create an array for rendering the stack
  const stackItems = Array.from({ length: totalPolaroids }, (_, i) => i);

  // Format the last update time
  const lastUsedDate = getLastUsedDate(item);
  const lastUpdateTime = lastUsedDate ? formatTimeAgo(lastUsedDate) : "N/A";

  // Check if the item is unused (more than 1 month)
  const unused = isItemUnused(item);

  // Adjust the height of the stack based on the number of polaroids
  const stackHeight = 175 + (totalPolaroids - 1) * 25; // Base height + 8px per additional polaroid

  return (
    <div className="relative">
      {/* Notification dot */}
      {unused && (
        <div className="absolute border border-black -right-1 -top-1 w-4 h-4 bg-red-500 rounded-full z-10"></div>
      )}

      {/* Polaroid stack */}
      <Link href={`/item/${item.id}`}>
        <div className="relative" style={{ height: `${stackHeight}px` }}>
          {stackItems.map((index) => (
            <div
              key={index}
              className="absolute polaroid shadow-md"
              style={{
                top: `${index * 25}px`,
                zIndex: totalPolaroids - index,
                transform: `rotate(${index % 2 === 0 ? -2 : 2}deg)`,
              }}
            >
              <div className="relative aspect-[3/4] w-full h-[15vh] mb-2  ">
                <Image
                  src={item.image || "/logo.png"}
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
