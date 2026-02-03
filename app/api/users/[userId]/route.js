import User from "@/models/User";
import Video from "@/models/video";
import Like from "@/models/Like"; // ← make sure you import Like model
import { connectToDatabase } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    await connectToDatabase();

    const resolvedParams = await params;
    const userId = resolvedParams.userId;

    
    const user = await User.findById(userId).select("username image");
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    //  Fetch all videos uploaded by this user
    const videos = await Video.find({ user: userId }).select("_id");
    const videoIds = videos.map(v => v._id);

    //  Count likes from Like collection
    let totalLikes = 0;
    if (videoIds.length > 0) {
      totalLikes = await Like.countDocuments({ video: { $in: videoIds } });
    }

    
    return NextResponse.json({
      ...user.toObject(), 
      totalLikes,        
    });

  } catch (err) {
    console.error("Failed to fetch user + total likes:", err);
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
  }
}
