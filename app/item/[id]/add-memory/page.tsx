"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { useItems } from "@/hooks/use-items";
import { Plus } from "lucide-react";

export default function AddMemoryPage() {
  const router = useRouter();
  const { addMemory } = useItems();
  const params = useParams();
  const itemId = params.id as string;

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    date: "",
    description: "",
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.date && formData.description) {
      addMemory(itemId, {
        id: Date.now().toString(),
        date: formData.date,
        description: formData.description,
        image: imagePreview || "/placeholder.svg",
      });
      router.push(`/item/${itemId}`);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container max-w-md mx-auto p-4">
        <h1 className="text-lg font-light mb-6">Add New Memory</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center mb-6">
            <div className="polaroid w-64">
              {imagePreview ? (
                <div className="relative aspect-square w-full mb-2">
                  <Image
                    src={imagePreview}
                    alt="Memory preview"
                    fill
                    className="object-cover"
                  />
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
              <label className="text-xs text-gray-500 block mb-1">
                DESCRIPTION:
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full p-2 border-b border-gray-300 focus:outline-none text-sm min-h-[100px]"
                placeholder="Write your memory here..."
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
  );
}
