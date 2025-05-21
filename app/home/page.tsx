"use client";
import Image from "next/image";
import { Header } from "@/components/header";
import { Barcode } from "@/components/barcode";
import { useAuth } from "@/hooks/use-auth";
import { useItems } from "@/hooks/use-items";
import { getLastMemoryDateForAllItems } from "@/lib/utils";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function HomePage() {
  const { items } = useItems();
  const { user } = useAuth();

  const lastMemoryDate = getLastMemoryDateForAllItems(items);
  const barcodeValue = 1234502920120; // Example barcode value

  const totalItems = 0.0;
  const totalMemories = 0.0;
  const sinceFormatted = "";
  const receiptDetails = [
    { label: "NAME", value: user?.name || "Guest" },
    { label: "ITEMS LOVED", value: totalItems || "0.00" },
    { label: "ITEMS DONATED", value: totalItems || "0.00" },
    { label: "ITEMS ADOPTED", value: totalItems || "0.00" },
    { label: "MEMORIES", value: totalMemories || "0.00" },
    { label: "SINCE", value: sinceFormatted },
  ];

  const [showReceiptFront, setShowReceiptFront] = useState(true);

  // Persist profile photo in localStorage
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);

  // Unique key for each user (fallback to 'guest')
  const photoStorageKey = `profile-photo-${user?.id || "guest"}`;

  useEffect(() => {
    // Load photo from localStorage on mount or when user changes
    const storedPhoto = localStorage.getItem(photoStorageKey);
    if (storedPhoto) {
      setProfilePhoto(storedPhoto);
    }
  }, [photoStorageKey]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setProfilePhoto(result);
      localStorage.setItem(photoStorageKey, result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container max-w-md mx-auto p-4">

        <div className="flex flex-col items-center gap-12">
          <div className="relative w-72 text-center flex justify-center items-center mb-16">
            <div>
              <div className="mb-4 px-2 py-1 border border-black rounded-3xl text-sm uppercase inline-block bg-white">
                PROFILE
              </div>

              <div
                className="relative w-64 h-[340px]"
                style={{ perspective: "1000px" }}
              >
                <div
                  className={`absolute w-56 border p-6 flex flex-col items-center font-mono text-sm drop-shadow-lg bg-white transition-all duration-500 cursor-pointer`}
                  style={{
                    zIndex: showReceiptFront ? 10 : 20,
                    left: "50%",
                    transform: "translateX(-50%)",
                  }}
                  onClick={() => setShowReceiptFront((v) => !v)}
                >
                  <h2 className="uppercase text-xs tracking-wider text-gray-500 mb-4">
                    Profile
                  </h2>
                  <div className="w-full max-w-xs mb-6">
                    <div className="w-full mb-2 border-b border-gray-300 pb-2">
                      <div className="text-center">
                        <p className="text-gray-800">{sinceFormatted}</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-[0.5rem] text-gray-600 w-full max-w-xs">
                    {receiptDetails.map((detail, index) => (
                      <div key={index} className="flex justify-between mb-1">
                        <p>{detail.label}:</p>
                        <p>{detail.value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="justify-between mt-2">
                    <div className="mb-2 text-[0.5rem]/3 text-gray-600 uppercase text-center tracking-tighter">
                      <p>cash amount: $0.00</p>
                      <p>store:4367 {lastMemoryDate}</p>
                      <p className="text-xs">
                        # of items purchased: {totalItems || "0"}
                      </p>
                      <p>To be loved is to be changed</p>
                    </div>
                    <Barcode value={barcodeValue} />
                    <div className="mt-2 text-[0.5rem]/3 text-gray-600 uppercase text-center tracking-tighter">
                      <p>How have you changed your things,</p>
                      <p>and how have your things changed you?</p>
                    </div>
                  </div>
                </div>
                <label
                  htmlFor="profile-photo-upload"
                  className="cursor-pointer block"
                  style={{
                    zIndex: showReceiptFront ? 20 : 10,
                    position: "absolute",
                    top: "-10px",
                    left: "0",
                    transition: "all 0.5s",
                  }}
                  onClick={() => setShowReceiptFront((v) => !v)}
                >
                  <div className="w-36 h-42 bg-white p-2 pt-2 pb-8 shadow-lg rounded-md text-center rotate-12 hover:scale-105 hover:rotate-2 transition duration-300">
                    <Image
                      src={profilePhoto || "/logo.png"}
                      alt="Profile Photo"
                      width={256}
                      height={192}
                      className="mx-auto rounded-sm"
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
          </div>

          <div className="w-full flex flex-row justify-center gap-4">
            {[
              {
                label: "Camera",
                href: "/camera",
                src: "/camera.svg",
                alt: "Camera",
              },
              {
                label: "Archive",
                href: "/archive",
                src: "/envelope.svg",
                alt: "Envelope",
              },
            ].map((item, index) => (
              <div key={index} className="relative w-36 h-36 text-center">
                <div className="px-2 py-1 border border-black rounded-3xl text-sm uppercase inline-block bg-white">
                  {item.label}
                </div>
                <Link href={item.href}>
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    className="mt-4 object-contain"
                  />
                </Link>
              </div>
            ))}
          </div>
          
        </div>
      </main>
    </div>
  );
}
