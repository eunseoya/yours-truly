"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useItems } from "@/hooks/use-items";
import { readFileAsDataURL } from "@/lib/utils";

function AddItemPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addItem } = useItems();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    from: "",
    story: "",
  });

  useEffect(() => {
    const nameFromQuery = searchParams.get("name");
    if (nameFromQuery) {
      setFormData((prev) => ({ ...prev, name: nameFromQuery }));
    }
    // Pre-fill image from localStorage if present
    const localPhoto =
      typeof window !== "undefined"
        ? localStorage.getItem("yours-truly-captured-photo")
        : null;
    if (localPhoto) {
      setImagePreview(localPhoto);
      localStorage.removeItem("yours-truly-captured-photo");
    }
  }, [searchParams]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === "camera-photo" && event.data.photo) {
        setImagePreview(event.data.photo);
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const dataUrl = await readFileAsDataURL(file);
      setImagePreview(dataUrl);
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

    if (formData.name && formData.date) {
      // Pass only the chosen date, provider will merge with current time
      const newItem = {
        id: Date.now().toString(),
        name: formData.name,
        date: formData.date,
        from: formData.from,
        story: formData.story,
        image: imagePreview || "/logo.svg?height=300&width=300",
        memories: [],
      };

      addItem(newItem);
      router.push("/archive");
    }
  };

  return (
    <main className="container max-w-md mx-auto p-4">
      <form onSubmit={handleSubmit} className="space-y-6 p-8">
        <div className="flex justify-center mb-6">
          <div className="polaroid w-64 h-96 pb-2">
            {imagePreview ? (
              <div className="relative w-full h-full">
                <label
                  htmlFor="image-upload"
                  className="block w-full h-full cursor-pointer"
                >
                  <Image
                    src={imagePreview}
                    alt="Item preview"
                    fill
                    className="object-cover w-full h-full"
                  />
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              </div>
            ) : (
              <div className="relative w-full h-full mb-2 bg-gray-100 flex items-center justify-center">
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
          <div className="flex items-center space-x-2 border-b border-gray-700">
            <label className="text-xs text-gray-500">NAME:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="flex-1 p-2 focus:outline-none text-sm italic"
              placeholder="item name"
            />
          </div>

          <div className="flex items-center space-x-2 border-b border-gray-700">
            <label className="text-xs text-gray-500">DATE:</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="flex-1 p-2 focus:outline-none text-sm italic"
            />
          </div>

          <div className="flex items-center space-x-2 border-b border-gray-700">
            <label className="text-xs text-gray-500">FROM:</label>
            <input
              type="text"
              name="from"
              value={formData.from}
              onChange={handleChange}
              className="flex-1 p-2 focus:outline-none text-sm italic"
              placeholder="singapore - ion orchard"
            />
          </div>

          <div className="flex items-start space-x-2 border-b border-gray-700">
            <label className="text-xs text-gray-500 mt-2">STORY:</label>
            <input
              type="text"
              name="story"
              value={formData.story}
              onChange={handleChange}
              className="flex-1 p-2 focus:outline-none text-sm italic"
              placeholder="birthday gift to myself :)"
            />
          </div>

          <div className="relative flex justify-center mt-6">
             <button className="w-12 h-12 rounded-full border border-gray-500 flex items-center justify-center">
                  <Plus className="h-10 w-10 stroke-[0.5]" />
                </button>
          </div>
        </div>
      </form>
    </main>
  );
}

export default function AddItemPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Suspense fallback={<p>Loading...</p>}>
        <AddItemPageContent />
      </Suspense>
    </div>
  );
}
