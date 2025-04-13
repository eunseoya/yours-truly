"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/header";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import QrScanner from "qr-scanner";

export default function CameraPage() {
  const router = useRouter();
  const [scanning, setScanning] = useState(true);
  const [scannedItem, setScannedItem] = useState<string | null>(null);
  const onScanned = (results) => console.log(results);

  const handleScan = () => {
    // setTimeout(() => {
    //   setScanning(false)
    //   setScannedItem("New Item")
    //   // Navigate to add page after scanning
    //   router.push("/add")
    // }, 3000)
  };

  const videoRef = useRef<HTMLVideoElement>(null);
  const [qrScanner, setQrScanner] = useState<QrScanner | null>(null);
  useEffect(() => {
    const startQrScanner = async () => {
      if (!videoRef.current) return;

      try {
        // Check if the browser supports media devices
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          console.error("Camera API not supported in this browser.");
          setScanning(false);
          return;
        }

        // Ensure HTTPS is being used (required for camera access on Safari)
        if (
          window.location.protocol !== "https:" &&
          window.location.hostname !== "localhost"
        ) {
          console.error("Camera access requires HTTPS.");
          setScanning(false);
          return;
        }

        const hasCamera = await QrScanner.hasCamera();
        if (!hasCamera) {
          console.error("No camera found.");
          setScanning(false);
          return;
        }

        const newScanner = new QrScanner(
          videoRef.current,
          (result) => {
            console.log("Decoded QR code:", result);
            setScanning(false);
            setScannedItem(result.data);
            router.push(`/add?name=${encodeURIComponent(result.data)}`);
          },
          {
            onDecodeError: (error) => {
              console.warn("QR decode error:", error);
            },
            overlay: {
              borderColor: "#6366F1",
              borderWidth: 4,
              borderRadius: 12,
              scanRegionOverlayStyle: {
                backgroundColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        );

        setQrScanner(newScanner);
        await newScanner.start();
        setScanning(true);
        animateScanLine();
      } catch (error: any) {
        console.error("Failed to start QR Scanner:", error);
        setScanning(false);
        // Optionally display an error message to the user
      }
    };

    startQrScanner();

    // Animation logic (moved inside useEffect for clarity)
    const scanLine = document.createElement("div");
    scanLine.className = "absolute left-0 right-0 h-0.5 bg-red-500 z-10";
    scanLine.style.boxShadow = "0 0 10px 2px rgba(255, 0, 0, 0.7)";
    videoRef.current?.parentElement?.appendChild(scanLine);

    let position = 0;
    let direction = 1;
    const animationSpeed = 1.5;

    const animateScanLine = () => {
      if (!scanLine || !scanning) return;

      position += direction * animationSpeed;

      if (position >= 100) direction = -1;
      if (position <= 0) direction = 1;

      scanLine.style.top = `${position}%`;

      requestAnimationFrame(animateScanLine);
    };

    return () => {
      qrScanner?.stop();
      qrScanner?.destroy();
      scanLine.remove(); // Clean up animation element
    };
  }, [router]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <main className="container max-w-md mx-auto p-0">
        <div className="relative w-full h-[calc(100vh-200px)] overflow-hidden mb-8">
          <video
            ref={videoRef}
            className="w-full h-full object-cover object-center"
            autoPlay
            muted
            playsInline
          />
          {scanning && (
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {/* The scanning line is now created and animated within the useEffect */}
            </div>
          )}
        </div>
        <div className="mt-auto text-center">
          <p className="text-xs uppercase font-medium">
            SCAN QR CODE TO UPLOAD NEW ITEM
          </p>
          <p className="text-xs text-gray-500 italic">
            Let&apos;s not forget this one
          </p>
        </div>
      </main>
    </div>
  );
}
