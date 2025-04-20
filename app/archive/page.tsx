"use client";

import Link from "next/link";
import { Header } from "@/components/header";
import { ItemStack } from "@/components/item-stack";
import { Button } from "@/components/ui/button";
import { Plus, Camera, Image } from "lucide-react";
import { useItems } from "@/hooks/use-items";

export default function ArchivePage() {
  const { items } = useItems();

  const filteredItems = items.filter((item) => !item.negatives); // Exclude negatives

  return (
    <div className="min-h-screen bg-white lg:h-screen lg:px-0">
      <Header />
      <main className="container sm:max-w-none max-w-md mx-auto px-4 py-6 lg:px-0 lg:flex lg:h-[calc(90vh)] pb-0">
        {/* Desktop: Full page vertical columns and horizontal scroll */}
        {/* Mobile/tablet: multi-column masonry and vertical scroll */}
        <div
          className="
            columns-3 sm:columns-5 md:columns-6 gap-4 space-y-4
            lg:columns-1 lg:flex lg:space-y-0 lg:gap-10  lg:overflow-y-hidden lg:w-full lg:pb-4 lg:px-10
          "
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {filteredItems.map((item) => (
            // For desktop, each item is in its column. column width stays the same.
            <div
              key={item.id}
              className="break-inside-avoid mb-4 lg:min-w-[8rem]"
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
        {/* Floating button to add new items */}
        <div className="fixed bottom-8 right-8 z-10">
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
              className="w-12 h-12 rounded-full border border-gray-500 flex items-center justify-center"
            >
              <Plus className="h-10 w-10 stroke-[0.5]" />
            </button>
            <button
              onClick={() => {
                window.location.href = "/camera";
              }}
              className="floating-action hidden absolute bottom-20 right-0 w-12 h-12 rounded-full bg-white flex items-center justify-center"
            >
              <Camera className="h-10 w-10 stroke-[0.5]" />
            </button>
            <button
              onClick={() => {
                window.location.href = "/add";
              }}
              className="floating-action hidden absolute bottom-36 right-0 w-12 h-12 rounded-full bg-white flex items-center justify-center"
            >
              <Image className="h-10 w-10 stroke-[0.5]" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
