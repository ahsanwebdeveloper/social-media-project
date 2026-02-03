import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { file, type } = await req.json();

    if (!file) {
      return NextResponse.json({ error: "File required" }, { status: 400 });
    }

    const result = await cloudinary.uploader.upload(file, {
      resource_type: type === "video" ? "video" : "image",
      folder: "social-media",
    });

    return NextResponse.json({
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
  
}
