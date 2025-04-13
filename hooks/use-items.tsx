"use client";

import type React from "react";

import { useState, useEffect, createContext, useContext } from "react";
import type { Item, Memory } from "@/types";

// Sample data with more detailed memories
const initialItems: Item[] = [
  {
    id: "1",
    name: "Lip Gloss",
    date: "01.03.24",
    from: "Paris - Beauty Store",
    story: "My favorite lip gloss that I use every day.",
    image: "/logo.png?height=300&width=300",
    category: "LIP GLOW",
    memories: [
      {
        id: "101",
        date: "05.03.24",
        description:
          "First time using this lip gloss for a special date night.",
        image: "/logo.png?height=300&width=300",
      },
      {
        id: "102",
        date: "10.03.24",
        description: "Used it for a photoshoot.",
        image: "/logo.png?height=300&width=300",
      },
    ],
  },
  {
    id: "2",
    name: "Monchichi Doll",
    date: "06.03.25",
    from: "Tokyo - Gift Shop",
    story: "sat her next to my laptop while I worked",
    image: "/logo.png?height=300&width=300",
    category: "MONCHICHI",
    memories: [
      {
        id: "201",
        date: "14.03.25",
        description: "trip to japan!",
        image: "/logo.png?height=300&width=300",
      },
      {
        id: "202",
        date: "02.03.25",
        description: "went for class, kept her in my bag today",
        image: "/logo.png?height=300&width=300",
      },
      {
        id: "203",
        date: "05.03.25",
        description: "she's a great study buddy",
        image: "/logo.png?height=300&width=300",
      },
      {
        id: "204",
        date: "10.03.25",
        description: "took her to the cafe with me",
        image: "/logo.png?height=300&width=300",
      },
      {
        id: "205",
        date: "15.03.25",
        description: "she's my good luck charm for exams",
        image: "/logo.png?height=300&width=300",
      },
      {
        id: "206",
        date: "20.03.25",
        description: "I think I need to get her a friend",
        image: "/logo.png?height=300&width=300",
      },
      {
        id: "207",
        date: "25.03.25",
        description: "she's been with me through thick and thin",
        image: "/logo.png?height=300&width=300",
      },
      {
        id: "208",
        date: "30.03.25",
        description: "I can't imagine my life without her",
        image: "/logo.png?height=300&width=300",
      },
    ],
  },
  {
    id: "3",
    name: "Vintage Notebook",
    date: "22.03.25",
    from: "London - Antique Store",
    story: "Beautiful vintage notebook with handmade paper.",
    image: "/logo.png?height=300&width=300",
    category: "NOTEBOOK",
    memories: [],
  },
  {
    id: "4",
    name: "Sketchbook",
    date: "10.03.25",
    from: "New York - Art Supply Store",
    story: "My daily sketchbook for drawing ideas.",
    image: "/logo.png?height=300&width=300",
    category: "SKETCHBOOK",
    memories: [
      {
        id: "401",
        date: "12.03.25",
        description: "First sketch in my new book - a cityscape.",
        image: "/logo.png?height=300&width=300",
      },
      {
        id: "402",
        date: "15.03.25",
        description: "Drew a portrait of my friend.",
        image: "/logo.png?height=300&width=300",
      },
      {
        id: "403",
        date: "18.03.25",
        description: "Sketched some flowers in the park.",
        image: "/logo.png?height=300&width=300",
      },
    ],
  },
  {
    id: "5",
    name: "Friendship Bracelet",
    date: "05.03.25",
    from: "Handmade by my best friend",
    story: "A special bracelet made by my best friend.",
    image: "/logo.png?height=300&width=300",
    category: "BRACELET",
    memories: [
      {
        id: "501",
        date: "07.03.25",
        description: "Wore it for the first time to our lunch date.",
        image: "/logo.png?height=300&width=300",
      },
      {
        id: "502",
        date: "10.03.25",
        description: "Got a matching one for my friend's birthday.",
        image: "/logo.png?height=300&width=300",
      },
    ],
  },
];

interface ItemsContextType {
  items: Item[];
  getItem: (id: string) => Item | undefined;
  addItem: (item: Item) => void;
  addMemory: (itemId: string, memory: Memory) => void;
}

const ItemsContext = createContext<ItemsContextType | undefined>(undefined);

export function ItemsProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Item[]>(initialItems);

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
    setItems((prev) => [...prev, item]);
  };

  const addMemory = (itemId: string, memory: Memory) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? {
              ...item,
              memories: [
                ...item.memories,
                { ...memory, image: memory.image || "/placeholder.svg" },
              ],
            }
          : item,
      ),
    );
  };

  return (
    <ItemsContext.Provider value={{ items, getItem, addItem, addMemory }}>
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
