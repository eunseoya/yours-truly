"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { UserPlus, Plus, MessageCircle, Trash2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
const mockPosts = [
  {
    id: "1",
    user: "Jessica",
    profileImage: "/logo.svg",
    caption: "cute beaded bracelet!",
    highlights: [
      {
        image: "https://i.ibb.co/vvxB2Q41/beaded-0.png",
        description: "Bracelet",
      },
      {
        image: "https://i.ibb.co/272LgW3G/beaded-1.png",
        description: "Bracelet on wrist",
      },
      {
        image: "https://i.ibb.co/PLYHHt7/beaded-2.png",
        description: "Bracelet closeup",
      },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    user: "Sam",
    profileImage: "/logo.svg",
    caption: "pottery made by me :) don't use it much who wants?",
    highlights: [
      {
        image: "https://i.ibb.co/gLbvgb4f/pottery-0.png",
        description: "Pottery",
      },
      {
        image: "https://i.ibb.co/3yx4ZMmC/pottery-1.png",
        description: "Pottery closeup",
      },
    ],
    createdAt: new Date().toISOString(),
  },
];

export default function SocialPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"friends" | "me">("friends");
  const [myPosts, setMyPosts] = useState<any[]>([]);
  const [unstackedPostId, setUnstackedPostId] = useState<string | null>(null);

  const handleDeletePost = async (id: string) => {
    if (!confirm("Delete this post?")) return;
    await fetch(`/api/post-highlights/${id}`, { method: "DELETE" });
    setMyPosts((prev) => prev.filter((p) => p.id !== id));
  };

  useEffect(() => {
    if (activeTab === "me") {
      fetch("/api/post-highlights")
        .then((res) => res.json())
        .then((data) => setMyPosts(data.reverse())); // newest first
    }
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Custom header with back button */}
      <div className="border-b py-4">
        <div className="container max-w-md mx-auto px-4 flex items-center justify-between">
          <Link
            href="/social/add-friends"
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <UserPlus className="h-5 w-5" />
          </Link>
          <Link
            href="/home"
            className="font-serif italic text-xl text-gray-800 translate-x-4"
          >
            <Image src="/title.svg" alt="title" width={100} height={50} />
          </Link>
          <div className="w-5" />
        </div>
      </div>

      {/* Tabs */}
      {/* Item name with view toggle */}
      <div className="flex justify-center my-4 ">
        <Button
          className={`px-4 border rounded-full text-xs
          uppercase tracking-wider inline-block
          ${activeTab === "friends" ? "bg-black text-white" : "bg-white text-black"}`}
          onClick={() => setActiveTab("friends")}
        >
          FRIENDS
        </Button>
        <Button
          className={`px-4 py-1 ml-1 border text-black rounded-full text-xs
            uppercase tracking-wider inline-block
            ${activeTab === "me" ? "bg-black text-white" : "bg-white text-black"}`}
          onClick={() => setActiveTab("me")}
        >
          ME
        </Button>
      </div>

      {/* Social feed */}
      <div className="flex-1 container max-w-md mx-auto px-4 py-2">
        {activeTab === "friends" ? (
          <>
            {mockPosts.map((post) => {
              const isOpen = unstackedPostId === post.id;
              const highlights = post.highlights.slice(0, 5); // or more

              return (
                <div key={post.id} className="mb-8">
                  <div className="text-xs text-gray-500 text-right mb-1">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex justify-center mb-2 ">
                    <div
                      className={` ${
                        isOpen
                          ? "flex justify-center gap-x-4 relative h-48"
                          : "relative h-48 w-40"
                      } cursor-pointer`}
                      onClick={() =>
                        setUnstackedPostId(isOpen ? null : post.id)
                      }
                    >
                      {highlights.map((h, idx) => {
                        const center = (highlights.length - 1) / 2;
                        const rotate = (idx - center) * 5; // -10deg, -5deg, 0deg, 5deg, 10deg...
                        const offset = (idx - center) * 10; // -20px, -10px, 0px, 10px...
                        const z = 10 + idx;

                        const stackedStyle = `absolute left-[${offset}px] rotate-[${rotate}deg] z-[${z}]`;

                        return (
                          <div
                            key={idx}
                            className={`polaroid transition-all duration-500 ease-in-out ${
                              isOpen ? "" : stackedStyle
                            }`}
                          >
                            <div className="relative w-36 aspect-square mb-2">
                              <Image
                                src={h.image || "/placeholder.svg"}
                                alt={h.description || "highlight"}
                                fill
                                className="object-cover"
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="flex items-center mt-8">
                    <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                      <Image
                        src={
                          post.profileImage ||
                          "/placeholder.svg?height=40&width=40"
                        }
                        alt={post.user}
                        width={40}
                        height={40}
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">
                        {post.user.toUpperCase()}
                      </p>
                      <p className="text-xs">{post.caption}</p>
                    </div>
                    <button className="p-1">
                      <MessageCircle className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </>
        ) : (
          // "Me" tab: show posted highlights
          <div>
            {myPosts.length === 0 && (
              <div className="text-center uppercase font-light text-gray-400 mt-8">
                No highlights posted yet
              </div>
            )}
            {myPosts.map((post) => (
              <div key={post.id} className="mb-8">
                <div className="text-xs text-gray-500 text-right mb-1">
                  {new Date(post.createdAt).toLocaleDateString()}
                  <button
                    className=" text-red-500 ml-1"
                    onClick={() => handleDeletePost(post.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex justify-center mb-2">
                  <div className="relative w-36 h-48">
                    {/* Stacked polaroids for highlights */}
                    {post.highlights.slice(0, 3).map((h: any, idx: number) => {
                      // Tailwind-based offset and rotation
                      const positions = [
                        "top-0 left-0 z-10 -rotate-6",
                        "top-2 left-8 z-20 rotate-6",
                        "top-4 left-16 z-30 -rotate-2",
                      ];
                      return (
                        <div
                          key={idx}
                          className={`polaroid absolute ${positions[idx] || ""}`}
                        >
                          <div className="relative aspect-[3/4] h-full mb-2">
                            <Image
                              src={h.image || "/placeholder.svg"}
                              alt={h.description || "highlight"}
                              fill
                              className="object-cover"
                            />
                          </div>
                        </div>
                      );
                    })}
                    {/* Spacer div to maintain height */}
                    <div className="w-64 h-48"></div>
                  </div>
                </div>
                <div className="flex items-center mt-8">
                  <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                    <Image
                      src="/placeholder.svg?height=40&width=40"
                      alt={post.user}
                      width={40}
                      height={40}
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{post.user}</p>
                    <p className="text-xs">{post.caption}</p>
                  </div>
                  <button className="p-1">
                    <MessageCircle className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
