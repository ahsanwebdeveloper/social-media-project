import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

/* =========================
   POST: Upload image/video
========================= */
export async function POST(req) {
  try {
    const { file, type } = await req.json();

    if (!file) {
      return NextResponse.json(
        { success: false, message: "File is required" },
        { status: 400 }
      );
    }

    const uploadResult = await cloudinary.uploader.upload(file, {
      resource_type: type === "video" ? "video" : "image",
      folder: "social-media",
    });

    return NextResponse.json(
      {
        success: true,
        url: uploadResult.secure_url,
        public_id: uploadResult.public_id,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
