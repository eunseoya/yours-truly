"use client"

import Link from "next/link"
import { Header } from "@/components/header"
import { ItemStack } from "@/components/item-stack"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useItems } from "@/hooks/use-items"
export default function ArchivePage() {
  const { items } = useItems()

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container max-w-md mx-auto px-4 py-6">
        <div
          className="columns-3 gap-4 space-y-4"
        >
          {items.map((item) => (
            <div key={item.id} className="break-inside-avoid mb-4">
              {/* Category label */}
              <div className="mb-2 px-3 py-1 border rounded-full text-xs uppercase tracking-wider inline-block bg-white">
                {item.category}
              </div>

              {/* Item with stacked memories */}
              <ItemStack item={item} />
            </div>
          ))}
        </div>

        <div className="fixed bottom-8 right-8">
          <Link href="/add">
            <Button
              size="icon"
              className="h-14 w-14 rounded-full border-2 border-gray-200 bg-white text-gray-500 hover:bg-gray-50"
            >
              <Plus className="h-6 w-6" />
            </Button>
          </Link>
        </div>
      </main>
    </div>
  )
}

