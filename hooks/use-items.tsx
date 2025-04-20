"use client";

import type React from "react";

import { useState, useEffect, createContext, useContext } from "react";
import type { Item, Memory } from "@/types";
import { mergeDateWithCurrentTime } from "@/lib/utils";

// links for reference

// https://i.ibb.co/vCsNYJfh/bag-3.png
// https://i.ibb.co/gFg0gB8W/bag-0.png
// https://i.ibb.co/xt1ZgzWC/bag-1.png
// https://i.ibb.co/mCt33Nkw/bag-2.png
// https://i.ibb.co/20ZnvksH/bag-4.png
// https://i.ibb.co/MyFn8wDk/bag-5.png
// https://i.ibb.co/xS3N0BT1/bag-6.png
// https://i.ibb.co/n8bK6HJh/bag-7.png
// https://i.ibb.co/SD0fHyM4/bag-8.png
// https://i.ibb.co/Xq5sMk9/bag-9.png
// https://i.ibb.co/B5Fp1vcW/bag-10.png
// https://i.ibb.co/kV5sYYf2/bag-11.png
// https://i.ibb.co/9mqkHqsM/bracelet-0.png
// https://i.ibb.co/spDn35xK/bracelet-1.png
// https://i.ibb.co/1fXqZ1XP/bracelet-2.png
// https://i.ibb.co/4gSWdhwW/lip-gloss-0.png
// https://i.ibb.co/QvdGNnyg/monchhichi-0.png
// https://i.ibb.co/5h2vxcgv/monchhichi-1.png
// https://i.ibb.co/PLgVCS7/monchhichi-2.png
// https://i.ibb.co/bgPgRJGs/notebook-0.png
// https://i.ibb.co/vxXR6mxz/notebook-1.png
// https://i.ibb.co/STvtTwQ/notebook-2.png
// https://i.ibb.co/ZRH8gdy6/notebook-3.png
// https://i.ibb.co/prh1dGpG/shirt-0.png
// https://i.ibb.co/vb38qbN/shirt-1.png
// https://i.ibb.co/rKzP83K9/shirt-2.png
// https://i.ibb.co/whP9PQ1h/shoes-0.png
// https://i.ibb.co/S4tbXMZm/shoes-1.png
// https://i.ibb.co/pvfJ9Q5n/shoes-2.png
// https://i.ibb.co/Tx7qsjdC/shoes-3.png
// https://i.ibb.co/qYy4L11H/sketchbook-0.png
// https://i.ibb.co/S7rVJY6F/sketchbook-1.png
// https://i.ibb.co/prxKDQmq/sketchbook-2.png
// https://i.ibb.co/vx2jkLN5/sketchbook-3.png

// Sample data with more detailed memories
const initialItems: Item[] = [
  {
    id: "1",
    name: "Lip Gloss",
    date: "01.04.2025",
    from: "Paris - Beauty Store",
    story: "My favorite lip gloss that I use every day.",
    image: "https://i.ibb.co/4gSWdhwW/lip-gloss-0.png",
    memories: [],
  },
  {
    id: "2",
    name: "Monchhichi",
    date: "06.03.2025",
    from: "Tokyo - Gift Shop",
    story: "sat her next to my laptop while I worked",
    image: "https://i.ibb.co/QvdGNnyg/monchhichi-0.png",
    memories: [
      {
        id: "201",
        date: "14.03.2025",
        description: "trip to japan!",
        image: "https://i.ibb.co/5h2vxcgv/monchhichi-1.png",
      },
      {
        id: "202",
        date: "02.04.2025",
        description: "went for class, kept her in my bag today",
        image: "https://i.ibb.co/PLgVCS7/monchhichi-2.png",
      },
    ],
  },
  {
    id: "3",
    name: "Notebook",
    date: "22.03.2025",
    from: "London - Antique Store",
    story: "Beautiful vintage notebook with handmade paper.",
    image: "https://i.ibb.co/bgPgRJGs/notebook-0.png",
    memories: [
      {
        id: "301",
        date: "25.03.2025",
        description: "First page filled with my thoughts.",
        image: "https://i.ibb.co/vxXR6mxz/notebook-1.png",
      },
      {
        id: "302",
        date: "28.03.2025",
        description: "Doodled some ideas for my next project.",
        image: "https://i.ibb.co/STvtTwQ/notebook-2.png",
      },
      {
        id: "303",
        date: "30.03.2025",
        description: "Filled with sketches and notes.",
        image: "https://i.ibb.co/ZRH8gdy6/notebook-3.png",
      },
    ],
  },
  {
    id: "4",
    name: "Sketchbook",
    date: "10.03.2025",
    from: "New York - Art Supply Store",
    story: "My daily sketchbook for drawing ideas.",
    image: "https://i.ibb.co/qYy4L11H/sketchbook-0.png",
    memories: [
      {
        id: "401",
        date: "12.03.2025",
        description: "First sketch in my new book - a cityscape.",
        image: "https://i.ibb.co/S7rVJY6F/sketchbook-1.png",
      },
      {
        id: "402",
        date: "15.03.2025",
        description: "Drew a portrait of my friend.",
        image: "https://i.ibb.co/prxKDQmq/sketchbook-2.png",
      },
      {
        id: "403",
        date: "18.04.2025",
        description: "Sketched some flowers in the park.",
        image: "https://i.ibb.co/vx2jkLN5/sketchbook-3.png",
      },
    ],
  },
  {
    id: "5",
    name: "Bracelet",
    date: "05.03.2025",
    from: "Handmade by my best friend",
    story: "A special bracelet made by my best friend.",
    image: "https://i.ibb.co/9mqkHqsM/bracelet-0.png",
    memories: [
      {
        id: "501",
        date: "07.03.2025",
        description: "Wore it for the first time to our lunch date.",
        image: "https://i.ibb.co/spDn35xK/bracelet-1.png",
      },
      {
        id: "502",
        date: "10.04.2025",
        description: "Got a matching one for my friend's birthday.",
        image: "https://i.ibb.co/1fXqZ1XP/bracelet-2.png",
      },
    ],
  },
  {
    id: "6",
    name: "Pottery",
    negatives: true,
    date: "05.03.2025",
    from: "Handmade by my best friend",
    story: "A special pottery piece made by my best friend.",
    image: "https://i.ibb.co/gLbvgb4f/pottery-0.png",
    memories: [
      {
        id: "601",
        date: "07.03.2025",
        description: "Wore it for the first time to our lunch date.",
        image: "https://i.ibb.co/3yx4ZMmC/pottery-1.png",
      },
    ],
  },
  {
    id: "7",
    name: "Bag",
    date: "05.03.2025",
    from: "Handmade by my best friend",
    story: "A special bag made by my best friend.",
    image: "https://i.ibb.co/gFg0gB8W/bag-0.png",
    memories: [
      {
        id: "701",
        date: "07.03.2025",
        description: "Wore it for the first time to our lunch date.",
        image: "https://i.ibb.co/xt1ZgzWC/bag-1.png",
      },
      {
        id: "702",
        date: "10.03.2025",
        description: "Got a matching one for my friend's birthday.",
        image: "https://i.ibb.co/mCt33Nkw/bag-2.png",
      },
      {
        id: "703",
        date: "12.03.2025",
        description: "Filled with all my essentials.",
        image: "https://i.ibb.co/20ZnvksH/bag-4.png",
      },
      {
        id: "704",
        date: "15.03.2025",
        description: "Took it on a weekend trip.",
        image: "https://i.ibb.co/MyFn8wDk/bag-5.png",
      },
      {
        id: "705",
        date: "18.03.2025",
        description: "Perfect for my daily commute.",
        image: "https://i.ibb.co/xS3N0BT1/bag-6.png",
      },
      {
        id: "706",
        date: "19.03.2025",
        description: "Got compliments from friends.",
        image: "https://i.ibb.co/n8bK6HJh/bag-7.png",
      },
      {
        id: "707",
        date: "19.03.2025",
        description: "Used it for grocery shopping.",
        image: "https://i.ibb.co/SD0fHyM4/bag-8.png",
      },
      {
        id: "708",
        date: "19.03.2025",
        description: "Great for carrying my laptop.",
        image: "https://i.ibb.co/Xq5sMk9/bag-9.png",
      },
      {
        id: "709",
        date: "19.03.2025",
        description: "Took it to a friend's birthday party.",
        image: "https://i.ibb.co/B5Fp1vcW/bag-10.png",
      },
      {
        id: "710",
        date: "19.03.2025",
        description: "Used it for a day trip to the beach.",
        image: "https://i.ibb.co/kV5sYYf2/bag-11.png",
      },
    ],
  },
  {
    id: "8",
    name: "Shirt",
    date: "05.03.2025",
    from: "Handmade by my best friend",
    story: "A special shirt made by my best friend.",
    image: "https://i.ibb.co/prh1dGpG/shirt-0.png",
    memories: [
      {
        id: "801",
        date: "07.03.2025",
        description: "Wore it for the first time to our lunch date.",
        image: "https://i.ibb.co/vb38qbN/shirt-1.png",
      },
      {
        id: "802",
        date: "10.04.2025",
        description: "Got a matching one for my friend's birthday.",
        image: "https://i.ibb.co/rKzP83K9/shirt-2.png",
      },
    ],
  },
  {
    id: "9",
    name: "Shoes",
    date: "05.03.2025",
    from: "Handmade by my best friend",
    story: "A special shoes made by my best friend.",
    image: "https://i.ibb.co/whP9PQ1h/shoes-0.png",
    memories: [
      {
        id: "901",
        date: "07.03.2025",
        description: "Wore it for the first time to our lunch date.",
        image: "https://i.ibb.co/S4tbXMZm/shoes-1.png",
      },
      {
        id: "902",
        date: "10.03.2025",
        description: "Got a matching one for my friend's birthday.",
        image: "https://i.ibb.co/pvfJ9Q5n/shoes-2.png",
      },
      {
        id: "903",
        date: "12.04.2025",
        description: "Perfect for running errands.",
        image: "https://i.ibb.co/Tx7qsjdC/shoes-3.png",
      },
    ],
  },
];

interface ItemsContextType {
  items: Item[];
  getItem: (id: string) => Item | undefined;
  addItem: (item: Item) => void;
  addMemory: (itemId: string, memory: Memory) => void;
  updateItem: (id: string, updates: Partial<Item>) => void;
}

const ItemsContext = createContext<ItemsContextType | undefined>(undefined);

export function ItemsProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Item[]>(initialItems);
  // localStorage.removeItem("archiveItems");
  // Load items from localStorage on mount
  useEffect(() => {
    const storedItems = localStorage.getItem("archiveItems");
    if (storedItems) {
      setItems(JSON.parse(storedItems));
    }
  }, []);

  // Save items to localStorage when they change
  useEffect(() => {
    localStorage.setItem("archiveItems", JSON.stringify(items));
  }, [items]);

  const getItem = (id: string) => {
    return items.find((item) => item.id === id);
  };

  const addItem = (item: Item) => {
    // Ensure date includes current time
    setItems((prev) => [
      ...prev,
      {
        ...item,
        date: mergeDateWithCurrentTime(item.date),
      },
    ]);
  };

  const addMemory = (itemId: string, memory: Memory) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? {
              ...item,
              memories: [
                ...item.memories,
                {
                  ...memory,
                  date: mergeDateWithCurrentTime(memory.date),
                  image: memory.image || "/placeholder.svg",
                },
              ],
            }
          : item,
      ),
    );
  };

  const updateItem = (id: string, updates: Partial<Item>) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, ...updates } : item,
      ),
    );
  };

  return (
    <ItemsContext.Provider
      value={{ items, getItem, addItem, addMemory, updateItem }}
    >
      {children}
    </ItemsContext.Provider>
  );
}

export function useItems() {
  const context = useContext(ItemsContext);
  if (context === undefined) {
    throw new Error("useItems must be used within an ItemsProvider");
  }
  return context;
}
