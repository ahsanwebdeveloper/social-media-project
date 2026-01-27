import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import connectDB from "@/lib/db";
import Video from "@/models/Video";

export const runtime = "nodejs";

/* =========================
   POST: Upload video
========================= */
export async function POST(req) {
  try {
    await connectDB();

    const formData = await req.formData();

    const file = formData.get("file");
    const title = formData.get("title");
    const description = formData.get("description");

    if (!file || !title || !description) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary (VIDEO)
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: "video",
          folder: "social-media/videos",
        },
        (error, result) => {
          if (error) reject(error);
          resolve(result);
        }
      ).end(buffer);
    });

    // Auto thumbnail from video
    const thumbnailUrl = cloudinary.url(uploadResult.public_id, {
      resource_type: "video",
      format: "jpg",
      transformation: [
        { width: 400, height: 225, crop: "fill" },
        { start_offset: "auto" },
      ],
    });

    // Save in MongoDB
    const newVideo = await Video.create({
      title,
      description,
      videoUrl: uploadResult.secure_url,
      thumbnailUrl,
      controls: true,
    });

    return NextResponse.json(newVideo, { status: 201 });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}
