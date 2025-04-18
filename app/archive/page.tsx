"use client";

import Link from "next/link";
import { Header } from "@/components/header";
import { ItemStack } from "@/components/item-stack";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useItems } from "@/hooks/use-items";

export default function ArchivePage() {
  const { items } = useItems();

  return (
    <div className="min-h-screen bg-white lg:h-screen lg:px-6">
      <Header />
      <main className="container sm:max-w-none max-w-md mx-auto px-4 py-6 lg:flex lg:flex-col lg:h-[calc(90vh)] pb-0">
        {/* Vertical columns for mobile/tablet, horizontal scroll for desktop */}
        {/* Mobile/tablet: multi-column masonry */}
        <div
          className="
              columns-3 sm:columns-5 md:columns-6 gap-4 space-y-4
              lg:columns-none lg:flex lg:gap-10 lg:space-y-0
              lg:overflow-x-auto lg:overflow-y-hidden w-full lg:pb-4
              lg:flex-1
            "
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {items.map((item) => (
            // For desktop, each item is in its column. column width stays the same.
            <div
              key={item.id}
              className="
                  break-inside-avoid mb-4
                  lg:mb-0 lg:w-36 lg:h-full
                "
            >
              {/* Item name */}
              <div className="mb-2 px-3 py-1 border rounded-full text-xs uppercase tracking-wider inline-block bg-white">
                {item.name}
              </div>

              {/* Item with stacked memories */}
              <ItemStack item={item} />
            </div>
          ))}
        </div>
        {/* Floating button: adjust for horizontal scroll */}
        <div className="fixed bottom-8 right-8 z-10">
          <Link href="/add">
             <button className="w-12 h-12 rounded-full border border-gray-500 flex items-center justify-center">
                  <Plus className="h-10 w-10 stroke-[0.5]" />
                </button>
          </Link>
        </div>
      </main>
    </div>
  );
}
