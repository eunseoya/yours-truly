import { useState } from "react";

export function usePhotoUpload(defaultPhoto: string = "/logo.png") {
  const [photo, setPhoto] = useState<string>(defaultPhoto);

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (!result) return;

      const img = document.createElement("img");
      img.onload = () => {
        const targetWidth = 240;
        const targetHeight = 320; // 3:4 ratio

        const canvas = document.createElement("canvas");
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const imgAspect = img.width / img.height;
        const targetAspect = targetWidth / targetHeight;

        let sourceX = 0,
          sourceY = 0;
        let sourceWidth = img.width,
          sourceHeight = img.height;

        if (imgAspect > targetAspect) {
          sourceWidth = img.height * targetAspect;
          sourceX = (img.width - sourceWidth) / 2;
        } else {
          sourceHeight = img.width / targetAspect;
          sourceY = (img.height - sourceHeight) / 2;
        }

        ctx.drawImage(img, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, targetWidth, targetHeight);

        setPhoto(canvas.toDataURL("image/jpeg", 0.9));
      };
      img.src = result as string;
    };

    reader.readAsDataURL(file);
  };

  return { photo, handlePhotoUpload };
}
