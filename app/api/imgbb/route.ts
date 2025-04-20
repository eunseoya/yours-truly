import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.IMGBB_API_KEY;

    // Parse the multipart form data
    const formData = await req.formData();
    const imageFile = formData.get("image");

    // Validate that the input is a file
    if (!(imageFile instanceof File)) {
      return NextResponse.json(
        { error: "Invalid input: A file is required" },
        { status: 400 },
      );
    }

    // Create form data for ImgBB API
    const imgbbFormData = new FormData();
    imgbbFormData.append("key", apiKey || "");
    imgbbFormData.append("image", imageFile);

    // Send to ImgBB
    const response = await fetch(
      "https://api.imgbb.com/1/upload?expiration=600",
      {
        method: "POST",
        body: imgbbFormData,
      },
    );

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("ImgBB upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 },
    );
  }
}
