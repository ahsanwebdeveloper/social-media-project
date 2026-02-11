import { connectToDatabase } from "@/lib/db";
import Video from "@/models/video";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET(req) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);

    const videoId = searchParams.get("videoId"); // single video
    const userId = searchParams.get("userId");   // filter by user
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;

    let videos;

    if (videoId) {
      // Single video
      videos = await Video.findById(videoId).populate({
        path: "user",
        select: "username image",
      });
    } else {
      // Multiple videos
      const query = userId
        ? { user: new mongoose.Types.ObjectId(userId) }
        : {};

      videos = await Video.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate({
          path: "user",
          select: "username image",
        });
    }

    return NextResponse.json(videos ?? []);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch videos" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const { title, description, videoUrl, thumbnailUrl } = await req.json();

    if (!title || !description || !videoUrl || !thumbnailUrl) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const video = await Video.create({
      user: session.user.id,
      title,
      description,
      videoUrl,
      thumbnailUrl,
      shareCount: 0,
    });

    return NextResponse.json(video, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Video upload failed" }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    await connectToDatabase();
    const { videoId } = await req.json();

    if (!videoId) return NextResponse.json({ error: "Video ID required" }, { status: 400 });

    const video = await Video.findByIdAndUpdate(
      videoId,
      { $inc: { shareCount: 1 } },
      { new: true }
    ).populate({ path: "user", select: "username image" });

    if (!video) return NextResponse.json({ error: "Video not found" }, { status: 404 });

    return NextResponse.json({ sharesCount: video.shareCount });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to update share count" }, { status: 500 });
  }
}
