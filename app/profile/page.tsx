"use client";

import type React from "react";

import { Header } from "@/components/header";
import { useAuth } from "@/hooks/use-auth";
import { Barcode } from "@/components/barcode";
import Image from "next/image";
import { useItems } from "@/hooks/use-items";
import { Receipt } from "@/components/receipt";
import { usePhotoUpload } from "@/hooks/use-photo-upload";

export default function ProfilePage() {
  const { user } = useAuth();
  const { items } = useItems();
  const barcodeValue = 1234502920120; // Example barcode value
  const { photo: profilePhoto, handlePhotoUpload } =
    usePhotoUpload("/logo.png");

  // Calculate stats
  const totalItems = items.length;
  const totalMemories = items.reduce(
    (sum, item) => sum + item.memories.length,
    0,
  );

  // Find the earliest item date to determine "since" date
  const since =
    items.length > 0
      ? items
          .map((item) => {
            const [day, month, year] = item.date.split(".");
            return new Date(
              `20${year}`,
              Number.parseInt(month) - 1,
              Number.parseInt(day),
            );
          })
          .sort((a, b) => a.getTime() - b.getTime())[0]
      : new Date();

  const sinceFormatted = since
    .toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    })
    .replace(/\//g, ".");

  const receiptDetails = [
    { label: "NAME", value: user?.name || "Guest" },
    { label: "ITEMS LOVED", value: totalItems },
    { label: "ITEMS DONATED", value: totalItems },
    { label: "ITEMS ADOPTED", value: totalItems },
    { label: "MEMORIES", value: totalMemories },
    { label: "SINCE", value: sinceFormatted },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container max-w-md mx-auto p-4">
        <div className="flex flex-col items-center gap-8">
          <div className="bg-white shadow-lg rounded-md text-center">
            <label
              htmlFor="profile-photo-upload"
              className="cursor-pointer block"
            >
              <div className="relative w-32 mx-auto">
                <div style={{ paddingBottom: "133.33%" }} className="relative">
                  <Image
                    src={profilePhoto || "/placeholder.svg"}
                    alt="Profile Photo"
                    fill
                    className="object-cover rounded-sm absolute top-0 left-0"
                  />
                </div>
              </div>
              <input
                id="profile-photo-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoUpload}
              />
            </label>

            {/* RECEIPT */}
            <Receipt
              date={new Date().toLocaleDateString()}
              details={receiptDetails}
              barcodeValue={barcodeValue}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
