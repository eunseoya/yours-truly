import { useState, useCallback } from "react";

const useClientProcessingOnly = true;

async function uploadImageToImgBB(file: File) {
  const formData = new FormData();
  formData.append('image', file);
  
  const res = await fetch('/api/imgbb', {
    method: 'POST',
    body: formData,
  });

  const data = await res.json();
  return data.data.url; // URL of the uploaded image
}

export function usePhotoUpload(defaultPhoto: string = "/logo.png") {
  const [photo, setPhoto] = useState<string>(defaultPhoto);
  const [quality, setQuality] = useState<number>(0.95);
  const [isOptimizing, setIsOptimizing] = useState<boolean>(false);

  // Function to handle EXIF orientation
  const fixOrientation = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    orientation: number
  ) => {
    switch (orientation) {
      case 2:
        ctx.transform(-1, 0, 0, 1, width, 0);
        break;
      case 3:
        ctx.transform(-1, 0, 0, -1, width, height);
        break;
      case 4:
        ctx.transform(1, 0, 0, -1, 0, height);
        break;
      case 5:
        ctx.transform(0, 1, 1, 0, 0, 0);
        break;
      case 6:
        ctx.transform(0, 1, -1, 0, height, 0);
        break;
      case 7:
        ctx.transform(0, -1, -1, 0, height, width);
        break;
      case 8:
        ctx.transform(0, -1, 1, 0, 0, width);
        break;
      default:
        break;
    }
  };

  // Function to fetch optimized image using ImgBB and Next.js image optimization
  const fetchOptimizedImage = useCallback(async (file: File, dataUrl: string): Promise<string> => {
    setIsOptimizing(true);
    try {
      // First upload to ImgBB to get a public URL
      const imgbbUrl = await uploadImageToImgBB(file);
      
      // Now use Next.js image optimization with the ImgBB URL
      const width = 240; // Match your target width
      const height = 320; // Match your target height
      const optimizationUrl = `/_next/image?url=${encodeURIComponent(imgbbUrl)}&w=${width}&h=${height}&q=90`;
      
      // Fetch the optimized image from Next.js
      const optimizedResponse = await fetch(optimizationUrl);
      if (!optimizedResponse.ok) {
        throw new Error('Failed to optimize image');
      }

      // Convert the response to a blob and then to a data URL
      const optimizedBlob = await optimizedResponse.blob();
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(optimizedBlob);
      });
    } catch (error) {
      console.error('Error optimizing image:', error);
      return dataUrl; // Return original image on error
    } finally {
      setIsOptimizing(false);
    }
  }, []);

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Initial client-side processing for preview
    const reader = new FileReader();
    reader.onload = async (e) => {
      const initialDataUrl = e.target?.result as string;
      
      // Set a preliminary version of the image for immediate feedback
      setPhoto(initialDataUrl);
      
      // If useClientProcessingOnly is true, only use client-side processing
      if (useClientProcessingOnly) {
        processImageClientSide(initialDataUrl);
      } else {
        // Use ImgBB and Next.js optimization when client-only mode is disabled
        try {
          const optimizedImage = await fetchOptimizedImage(file, initialDataUrl);
          setPhoto(optimizedImage);
        } catch (error) {
          // If server optimization fails, fall back to client-side processing
          console.error('Server optimization failed, falling back to client-side:', error);
          processImageClientSide(initialDataUrl);
        }
      }
    };
    
    reader.readAsDataURL(file);
  };

  // Client-side processing as fallback
  const processImageClientSide = async (dataUrl: string) => {
    const TARGET_SIZE = 500 * 1024; // 500KB
    const orientation = 1; // Default orientation if not using EXIF

    // Check if already under target size
    function dataUrlSize(dataUrl: string) {
      // Remove the data URL prefix and decode base64
      const base64 = dataUrl.split(',')[1];
      return Math.ceil((base64.length * 3) / 4);
    }

    if (dataUrlSize(dataUrl) <= TARGET_SIZE) {
      setPhoto(dataUrl);
      return;
    }

    const img = document.createElement("img");
    img.onload = () => {
      let targetWidth = img.width;
      let targetHeight = img.height;
      let curQuality = quality;

      // Downscale and reduce quality until under target size
      let resultDataUrl = dataUrl;
      let attempts = 0;
      while (attempts < 10) {
        // Reduce dimensions by 10% each attempt if needed
        if (dataUrlSize(resultDataUrl) > TARGET_SIZE && (targetWidth > 32 && targetHeight > 32)) {
          targetWidth = Math.floor(targetWidth * 0.9);
          targetHeight = Math.floor(targetHeight * 0.9);
        }

        const canvas = document.createElement("canvas");
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        fixOrientation(ctx, targetWidth, targetHeight, orientation);

        ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, targetWidth, targetHeight);

        // Try WebP first
        try {
          resultDataUrl = canvas.toDataURL("image/webp", curQuality);
        } catch {
          resultDataUrl = canvas.toDataURL("image/png");
        }

        // If still too large, reduce quality
        if (dataUrlSize(resultDataUrl) > TARGET_SIZE && curQuality > 0.5) {
          curQuality -= 0.1;
        } else {
          // If under target or can't reduce quality further, break
          if (dataUrlSize(resultDataUrl) <= TARGET_SIZE || curQuality <= 0.5) break;
        }
        attempts++;
      }

      setPhoto(resultDataUrl);
    };
    img.src = dataUrl;
  };

  // Allow quality adjustment if needed
  const adjustQuality = (newQuality: number) => {
    setQuality(Math.max(0, Math.min(1, newQuality)));
  };

  return { photo, handlePhotoUpload, adjustQuality, quality, isOptimizing };
}
