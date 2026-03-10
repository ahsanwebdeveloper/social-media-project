import User from "@/models/User";
import Video from "@/models/video";
import Like from "@/models/Like"; 
import { connectToDatabase } from "@/lib/db";
import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

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

export async function PATCH(request) {
  try {
    await connectToDatabase();

    const { userId, username, email, password, image } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: "userId required" }, { status: 400 });
    }

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if username/email is changing and if it already exists
    if (username && username !== user.username) {
      const existUsername = await User.findOne({ username });
      if (existUsername) {
        return NextResponse.json({ error: "Username already exists" }, { status: 409 });
      }
      user.username = username;
    }

    if (email && email !== user.email) {
      const existEmail = await User.findOne({ email });
      if (existEmail) {
        return NextResponse.json({ error: "Email already exists" }, { status: 409 });
      }
      user.email = email;
    }

    // Update password if provided
    if (password) {
      user.password = password; // ideally hash before saving
    }

    // Update profile image if provided
    if (image) {
      const result = await cloudinary.uploader.upload(image, {
        resource_type: "image",
        folder: "profile_images",
      });
      user.image = result.secure_url;
    }
    if (loggedInUserId !== userId) {
  return NextResponse.json(
    { error: "You are not allowed to update this profile" },
    { status: 403 }
  );
}

    await user.save();

    return NextResponse.json(
      { message: "Profile successfully updated", user },
      { status: 200 }
    );
  } catch (error) {
    console.error("UPDATE PROFILE ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
