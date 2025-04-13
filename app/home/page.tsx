"use client";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Barcode } from "@/components/barcode";
import { Receipt } from "@/components/receipt";
import { useAuth } from "@/hooks/use-auth";
import { usePhotoUpload } from "@/hooks/use-photo-upload";

export default function HomePage() {
  const barcodeValue = 1234502920120; // Example barcode value
  // Ensure the barcode value is 12 digits long
  const { user } = useAuth();
  const { photo: profilePhoto, handlePhotoUpload } =
    usePhotoUpload("/logo.png");

  const totalItems = 0;
  const totalMemories = 0;
  const sinceFormatted = "";
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
          <div className="relative w-72 text-center">
            <div className="mb-4 px-2 py-1 border border-black rounded-3xl text-sm uppercase inline-block bg-white">
              PROFILE
            </div>
            <div className="relative">
              <Link href="/profile">
                <Receipt
                  date="04/07/2025"
                  details={receiptDetails}
                  barcodeValue={barcodeValue}
                />
              </Link>
              <label
                htmlFor="profile-photo-upload"
                className="cursor-pointer block"
              >
                <div className="absolute top-[-5px] left-[10px] rotate-12 w-36 h-42  bg-white p-2 pt-2 pb-8 shadow-lg rounded-md text-center transform hover:scale-105 hover:rotate-2 transition duration-300">
                  <Image
                    src={profilePhoto || "/placeholder.svg"}
                    alt="Profile Photo"
                    width={256}
                    height={192}
                    className="w-64 mx-auto rounded-sm"
                  />
                  <input
                    id="profile-photo-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoUpload}
                  />
                </div>
              </label>
            </div>
          </div>

          <div className="w-full flex flex-row justify-center gap-4">
            <div className="relative w-36 h-36 text-center">
              <div className="mb-4 px-2 py-1 border border-black rounded-3xl text-sm uppercase inline-block bg-white">
                Camera
              </div>
              <Link href="/camera" className="w-full">
                <Image
                  src="/camera.svg"
                  alt="Camera"
                  fill
                  className="object-contain"
                />
              </Link>
            </div>
            <div className="relative w-36 h-36 text-center">
              <div className="mb-8 px-2 py-1 border border-black rounded-3xl text-sm uppercase inline-block bg-white">
                Archive
              </div>
              <Link href="/archive" className="w-full">
                <Image
                  src="/envelope.svg"
                  alt="Envelope"
                  fill
                  className="object-contain"
                />
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
