import { NextResponse } from "next/server";
import Video from "@/models/video";
import Post from "@/models/post";
import { connectToDatabase } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req) {
  try {
    await connectToDatabase();

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { videoId, postId } = await req.json();
    if (!videoId && !postId) {
      return NextResponse.json(
        { error: "videoId or postId is required" },
        { status: 400 }
      );
    }

    let updatedItem;

    if (videoId) {
      updatedItem = await Video.findByIdAndUpdate(
        videoId,
        { $inc: { sharesCount: 1 } },
        { new: true }
      );
    } else if (postId) {
      updatedItem = await Post.findByIdAndUpdate(
        postId,
        { $inc: { sharesCount: 1 } },
        { new: true }
      );
    }

    if (!updatedItem) {
      return NextResponse.json(
        { error: "Item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      sharesCount: updatedItem.sharesCount,
    });

  } catch (err) {
    console.error("SHARE ERROR:", err);
    return NextResponse.json(
      { error: "Failed to share" },
      { status: 500 }
    );
  }
}