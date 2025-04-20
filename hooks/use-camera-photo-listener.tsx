import { useEffect } from "react";

export function useCameraPhotoListener(
  handlePhotoUpload: (e: any) => void,
  filename: string
) {
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === "camera-photo" && event.data.photo) {
        handlePhotoUpload({
          target: { files: [dataURLtoFile(event.data.photo, filename)] },
        } as any);
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
