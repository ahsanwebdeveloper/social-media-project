import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  try {
    // parse FormData from request
    const formData = await req.formData();
    const file = formData.get("file");
    const title = formData.get("title");
    const description = formData.get("description");

    if (!file || !title || !description) {
      return NextResponse.json(
        { error: "File, title, and description are required" },
        { status: 400 }
      );
    }

    // Convert file to buffer for Cloudinary
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload_stream(
      { resource_type: "video", folder: "videos" },
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          return NextResponse.json(
            { error: "Cloudinary upload failed" },
            { status: 500 }
          );
        }
        return result;
      }
    );

    // Use a Promise wrapper because upload_stream uses callbacks
    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { resource_type: "video", folder: "videos" },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      stream.end(buffer);
    });

    // Return JSON response
    return NextResponse.json({ success: true, data: uploadResult });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
