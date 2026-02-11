import { NextResponse } from "next/server";
import Video from "@/models/video";
import { connectToDatabase } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req) {
  try {
    await connectToDatabase();

    // Get session
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get videoId from request
    const { videoId } = await req.json();
    if (!videoId) {
      return NextResponse.json({ error: "videoId is required" }, { status: 400 });
    }

    // Increment shares count
    const video = await Video.findByIdAndUpdate(
      videoId,
      { $inc: { sharesCount: 1 } },
      { new: true }
    );

    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, sharesCount: video.sharesCount });
  } catch (err) {
    console.error("Failed to share video:", err);
    return NextResponse.json({ error: "Failed to share video" }, { status: 500 });
  }
}
