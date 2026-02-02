import Follow from "@/models/Follow";
import { connectToDatabase } from "@/lib/db";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import mongoose from "mongoose";

export async function POST(req) {
  try {
    //  Get logged-in user
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized User" }, { status: 401 });
    }

    const followerId = session.user.id;

    //  Parse request body
    const { targetUserId } = await req.json();

    if (!targetUserId || followerId === targetUserId) {
      return NextResponse.json(
        { error: "Invalid follow request" },
        { status: 400 }
      );
    }

    await connectToDatabase();


    const existingFollow = await Follow.findOne({
      follower: new mongoose.Types.ObjectId(followerId),
      following: new mongoose.Types.ObjectId(targetUserId),
    });

    if (existingFollow) {
      
      await Follow.deleteOne({
        _id: existingFollow._id,
      });
      return NextResponse.json({ message: "Unfollowed successfully", following: false });
    } else {
      
      const follow = await Follow.create({
        follower: new mongoose.Types.ObjectId(followerId),
        following: new mongoose.Types.ObjectId(targetUserId),
      });
      return NextResponse.json({ message: "Followed successfully", following: true });
    }
  } catch (err) {
    console.error("Follow route error:", err);
    return NextResponse.json({ error: "Failed to process follow request" }, { status: 500 });
  }
}


export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const type = searchParams.get("type") || "followers"; 

    if (!userId) {
      return NextResponse.json({ error: "UserId is required" }, { status: 400 });
    }

    await connectToDatabase();

    let data;
    if (type === "followers") {
      data = await Follow.find({ following: userId }).populate("follower", "username image");
    } else {
      data = await Follow.find({ follower: userId }).populate("following", "username image");
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("Follow GET error:", err);
    return NextResponse.json({ error: "Failed to fetch follow data" }, { status: 500 });
  }
}
