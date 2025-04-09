"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useItems } from "@/hooks/use-items"

export default function ItemPage() {
  const params = useParams()
  const router = useRouter()
  const itemId = params.id as string
  const { getItem, addMemory } = useItems()
  const item = getItem(itemId)
  // localStorage.removeItem('archiveItems')
  const [showAddMemory, setShowAddMemory] = useState(false)
  const [newMemory, setNewMemory] = useState({
    date: "",
    description: "",
  })

  if (!item) {
    return <div>Item not found</div>
  }

  // Combine item and memories for display
  const allMemories = [
    {
      id: "item",
      date: item.date,
      description: item.story,
      image: item.image,
    },
    ...item.memories.map((memory) => ({
      id: memory.id,
      date: memory.date,
      description: memory.description,
      image: memory.image, 
    })),
  ]

  const handleAddMemory = () => {
    if (newMemory.date && newMemory.description) {
      addMemory(itemId, {
        id: Date.now().toString(),
        date: newMemory.date,
        description: newMemory.description,
        image: newMemory.image || "/placeholder.svg",
      })
      setNewMemory({ date: "", description: "" })
      setShowAddMemory(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container max-w-md mx-auto p-4">
        {/* Category label */}
        <div className="flex justify-center mb-6">
          <div className="px-4 py-1 border rounded-full text-xs uppercase tracking-wider inline-block bg-white">
            {item.category}
          </div>
        </div>

        {/* Memories in alternating layout */}
        <div className="space-y-8">
          {allMemories.map((memory, index) => (
            <div key={memory.id} className="flex items-center">
              {/* Left column - even indexes (0, 2, 4...) */}
              {index % 2 === 0 ? (
                <>
                  <div className="w-1/2 pr-4">
                    <div className="polaroid">
                      <div className="relative aspect-square w-full mb-2">
                        <Image
                          src={memory.image || "/placeholder.svg?height=300&width=300"}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="w-1/2 pl-4">
                    <div className="text-xs text-gray-400 mb-1">{memory.date}</div>
                    <p className="text-xs">{memory.description}</p>
                  </div>
                </>
              ) : (
                /* Right column - odd indexes (1, 3, 5...) */
                <>
                  <div className="w-1/2 pr-4 text-right">
                    <div className="text-xs text-gray-400 mb-1">{memory.date}</div>
                    <p className="text-xs">{memory.description}</p>
                  </div>
                  <div className="w-1/2 pl-4">
                    <div className="polaroid">
                      <div className="relative aspect-square w-full mb-2">
                        <Image
                          src={memory.image || "/placeholder.svg?height=300&width=300"}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        <div className="fixed bottom-8 left-1/2 -translate-x-1/2">
          <Button
            size="icon"
            className="h-14 w-14 rounded-full border-2 border-gray-200 bg-white text-gray-500 hover:bg-gray-50"
            onClick={() => router.push(`/item/${itemId}/add-memory`)}
          >
            <Plus className="h-6 w-6" />
          </Button>
        </div>
      </main>
    </div>
  )
}
