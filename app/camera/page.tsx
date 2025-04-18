"use client";

import { useState, useRef, useEffect } from "react";
import { Header } from "@/components/header";
import { useRouter } from "next/navigation";
import { Scan } from "lucide-react";
export default function CameraPage() {
  const router = useRouter();
  const [scanning, setScanning] = useState(true);
  const [photo, setPhoto] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [itemId, setItemId] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const startWebcam = async () => {
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

        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setScanning(true);
      } catch (error: any) {
        console.error("Failed to start webcam:", error);
        setScanning(false);
      }
    };

    startWebcam();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const takePhoto = () => {
    if (!videoRef.current) return;

    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      setPhoto(canvas.toDataURL("image/png"));
    }
  };

  const handleCameraClick = () => {
    let counter = 3;
    setCountdown(counter);

    const interval = setInterval(() => {
      counter -= 1;
      if (counter === 0) {
        clearInterval(interval);
        setCountdown(null);
        takePhoto();
      } else {
        setCountdown(counter);
      }
    }, 1000);
  };

  const handlePolaroidClick = () => {
    if (photo) {
      // Save photo to localStorage instead of passing as query param
      localStorage.setItem("yours-truly-captured-photo", photo);
      if (itemId) {
        router.push(`/item/${itemId}/add-memory`);
      } else {
        router.push(`/add`);
      }
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <main className="container max-w-md mx-auto p-0">
        <div
          className="relative w-full h-[calc(100vh-200px)] overflow-hidden mb-8"
          onClick={handleCameraClick}
        >
          <video
            ref={videoRef}
            className="w-full h-full object-cover object-center"
            autoPlay
            muted
            playsInline
          />
          {countdown !== null ? (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <p className="text-white text-4xl font-light">{countdown}</p>
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-32 h-32 text-white opacity-75"
                viewBox="0 0 32 32"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
              >
                <path d="M16 13v6"></path>
                <path d="M13 16h6"></path>
              </svg>
            </div>
          )}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-32 h-32 text-white opacity-75"
              viewBox="0 0 32 32"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
            >
              <circle cx="16" cy="16" r="5"></circle>
              <path d="M2 8V2h8"></path>
              <path d="M2 24v6h8"></path>
              <path d="M30 8V2h-8"></path>
              <path d="M30 24v6h-8"></path>
            </svg>
          </div>
        </div>

        {/*  Footer */}
        <div className="mt-auto flex items-center justify-center">
          {/* Polaroid photo capture */}
          <div className="flex-shrink-0">
            <div className="relative w-12 h-16" onClick={handlePolaroidClick}>
              <div className="p-1 pt-2 pb-3 shadow-md absolute overflow-hidden top-0 left-0 z-10 w-full h-full">
                <div className="relative w-full h-full ">
                  {photo ? (
                    <img
                      src={photo}
                      alt="Captured"
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <img
                      src="/placeholder.svg?height=128&width=128"
                      alt="Placeholder"
                      className="object-cover w-full h-full"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="ml-4">
            <p className="text-xs uppercase font-medium">
              Take a photo of your new item
            </p>
            <p className="text-xs text-gray-500 italic">
              Let's not forget this one
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
