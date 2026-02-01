import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";

export async function POST(request) {
  try {
    await connectToDatabase();

    const { email, password, username, userprofile } = await request.json();

    if (!email || !password || !username) {
      return NextResponse.json(
        { error: "Email aur password aur username required hain" },
        { status: 400 }
      );
    }

    const existusername = await User.findOne({ username });
    if (existusername) {
      return NextResponse.json(
        { error: "username already exist karta hai" },
        { status: 409 }
      );
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already exist karta hai" },
        { status: 409 }
      );
    }

    let profileImageUrl = "";
    if (userprofile) {
      
      const result = await cloudinary.uploader.upload(userprofile, {
        resource_type: "image",
        folder: "profile_images",
      });
      profileImageUrl = result.secure_url;
    }

    await User.create({
      email,
      password,
      username,
      userprofile: profileImageUrl,
    });

    return NextResponse.json(
      { message: "User successfully register ho gaya" },
      { status: 201 }
    );
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
