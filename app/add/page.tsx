"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useItems } from "@/hooks/use-items"

export default function AddItemPage() {
  const router = useRouter()
  const { addItem } = useItems()
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    from: "",
    story: "",
  })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.name && formData.date) {
      const newItem = {
        id: Date.now().toString(),
        name: formData.name,
        date: formData.date,
        from: formData.from,
        story: formData.story,
        image: imagePreview || "/logo.svg?height=300&width=300",
        category: "all",
        memories: [],
      }

      addItem(newItem)
      router.push("/archive")
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container max-w-md mx-auto p-4">
        <h1 className="text-lg font-light mb-6">Add New Item</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center mb-6">
            <div className="polaroid w-64">
              {imagePreview ? (
                <div className="relative aspect-square w-full mb-2">
                  <Image src={imagePreview || "/logo.svg"} alt="Item preview" fill className="object-cover" />
                </div>
              ) : (
                <div className="relative aspect-square w-full mb-2 bg-gray-100 flex items-center justify-center">
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <Plus className="h-8 w-8 text-gray-400" />
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </label>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs text-gray-500 block mb-1">NAME:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border-b border-gray-300 focus:outline-none text-sm"
                placeholder="Item name"
              />
            </div>

            <div>
              <label className="text-xs text-gray-500 block mb-1">DATE:</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full p-2 border-b border-gray-300 focus:outline-none text-sm"
              />
            </div>

            <div>
              <label className="text-xs text-gray-500 block mb-1">FROM:</label>
              <input
                type="text"
                name="from"
                value={formData.from}
                onChange={handleChange}
                className="w-full p-2 border-b border-gray-300 focus:outline-none text-sm"
                placeholder="Singapore - Art market"
              />
            </div>

            <div>
              <label className="text-xs text-gray-500 block mb-1">STORY:</label>
              <textarea
                name="story"
                value={formData.story}
                onChange={handleChange}
                className="w-full p-2 border-b border-gray-300 focus:outline-none text-sm min-h-[100px]"
                placeholder="Birthday gift I received :)"
              />
            </div>
          </div>

          <div className="fixed bottom-8 right-8">
          <Button
              size="icon"
              type="submit"
              className="h-14 w-14 rounded-full border-2 border-gray-200 bg-white text-gray-500 hover:bg-gray-50"
            >
              <Plus className="h-8 w-8" />
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}
