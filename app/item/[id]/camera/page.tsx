"use client";

import { useState, useRef, useEffect } from "react";
import { Header } from "@/components/header";
import { useRouter, useParams } from "next/navigation";

export default function ItemCameraPage() {
  const router = useRouter();
  const params = useParams();
  const itemId = params.id as string;
  const [scanning, setScanning] = useState(true);
  const [photo, setPhoto] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const startWebcam = async () => {
      if (!videoRef.current) return;
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          setScanning(false);
          return;
        }
        if (
          window.location.protocol !== "https:" &&
          window.location.hostname !== "localhost"
        ) {
          setScanning(false);
          return;
        }
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        const constraints = isMobile
          ? { video: { facingMode: { exact: "environment" } } }
          : { video: true };
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        streamRef.current = stream;
        setScanning(true);
      } catch {
        setScanning(false);
      }
    };

    const stopWebcam = () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };

    startWebcam();
    window.addEventListener("beforeunload", stopWebcam);
    return () => {
      stopWebcam();
      window.removeEventListener("beforeunload", stopWebcam);
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

  // Save photo to localStorage and go to add-memory page for this item
  const handlePolaroidClick = () => {
    if (photo && itemId) {
      localStorage.setItem("yours-truly-captured-photo", photo);
      router.push(`/item/${itemId}/add-memory`);
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
              Take a photo for this item
            </p>
            <p className="text-xs text-gray-500 italic">
              Add a new memory instantly
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
