import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Like from "@/models/Like";
import Video from "@/models/video";
import mongoose from "mongoose";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Please login" },
        { status: 401 }
      );
    }

    const { videoId } = await req.json();
    if (!videoId) {
      return NextResponse.json(
        { error: "videoId is required" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const userId = session.user.id;

    // check existing like
    const existingLike = await Like.findOne({
      user: userId,
      video: videoId,
    });

    // UNLIKE
    if (existingLike) {
      await Like.deleteOne({ _id: existingLike._id });

      await Video.findByIdAndUpdate(videoId, {
        $inc: { likesCount: -1 },
      });

      return NextResponse.json({ liked: false });
    }

    // LIKE
    await Like.create({
      user: userId,
      video: videoId,
    });

    await Video.findByIdAndUpdate(videoId, {
      $inc: { likesCount: 1 },
    });

    return NextResponse.json({ liked: true });

  } catch (err) {
    console.error("LIKE POST ERROR:", err);
    return NextResponse.json(
      { error: "Like action failed" },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const videoId = searchParams.get("videoId");
    const type = searchParams.get("type");

    if (!videoId) {
      return NextResponse.json(
        { error: "videoId is required" },
        { status: 400 }
      );
    }

    // LIKE COUNT
    if (type === "count") {
      const count = await Like.countDocuments({
        video: new mongoose.Types.ObjectId(videoId),
      });
      return NextResponse.json({ count });
    }

    // CHECK IF CURRENT USER LIKED
    if (type === "me") {
      const session = await getServerSession(authOptions);
      if (!session?.user?.id) {
        return NextResponse.json({ liked: false });
      }

      const liked = await Like.exists({
        user: session.user.id,
        video: videoId,
      });

      return NextResponse.json({ liked: Boolean(liked) });
    }

    return NextResponse.json(
      { error: "Invalid type" },
      { status: 400 }
    );

  } catch (err) {
    console.error("LIKE GET ERROR:", err);
    return NextResponse.json(
      { error: "Failed to fetch likes" },
      { status: 500 }
    );
  }
}
