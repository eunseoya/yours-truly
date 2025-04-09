"use client"
import Link from "next/link"
import Image from "next/image"
import { Plus } from "lucide-react"
import { useItems } from "@/hooks/use-items"
import { formatTimeAgo } from "@/lib/utils"

interface PolaroidStackProps {
  itemIds: string[]
  categoryName: string
}

export function PolaroidStack({ itemIds, categoryName }: PolaroidStackProps) {
  const { getItem } = useItems()
  const items = itemIds.map((id) => getItem(id)).filter(Boolean)

  if (items.length === 0) return null

  // Get the last updated item in this category
  const lastUpdatedItem = [...items].sort((a, b) => {
    const aDate = new Date(a!.date.split(".").reverse().join("-"))
    const bDate = new Date(b!.date.split(".").reverse().join("-"))
    return bDate.getTime() - aDate.getTime()
  })[0]

  const lastUpdateTime = formatTimeAgo(lastUpdatedItem!.date)

  return (
    <div className="mb-8">
      {/* Category label */}
      <div className="mb-2 px-4 py-1 border rounded-full text-xs uppercase tracking-wider inline-block bg-white">
        {categoryName}
      </div>

      {/* Polaroid stack */}
      <div className="relative">
        {items.map((item, index) => (
          <Link href={`/item/${item!.id}`} key={item!.id}>
            <div
              className={`polaroid mb-2 ${index > 0 ? "ml-4" : ""}`}
              style={{
                marginTop: index > 0 ? `-${100 + index * 20}px` : "0",
                zIndex: items.length - index,
              }}
            >
              <div className="relative aspect-square w-full mb-2">
                <Image
                  src={item!.image || "/placeholder.svg?height=300&width=300"}
                  alt={item!.name}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </Link>
        ))}

        {/* Last update indicator */}
        <div className="flex items-center mt-2 ml-2 text-xs text-gray-500">
          <div className="flex items-center justify-center w-5 h-5 rounded-full border mr-1">
            <Plus className="w-3 h-3" />
          </div>
          <span>last update</span>
          <span className="ml-1 font-medium">{lastUpdateTime}</span>
        </div>
      </div>
    </div>
  )
}
