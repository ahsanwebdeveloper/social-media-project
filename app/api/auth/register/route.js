import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    await connectToDatabase();

    const body = await request.json();

    const email = body.email?.toLowerCase().trim();
    const password = body.password?.trim();
    const username = body.username?.trim();
    const image = body.image;

    if (!email || !password || !username) {
      return NextResponse.json(
        { error: "Email, password aur username required hain" },
        { status: 400 }
      );
    }

    const existusername = await User.findOne({ username });
    if (existusername) {
      return NextResponse.json(
        { error: "Username already exist karta hai" },
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
    if (image) {
      const result = await cloudinary.uploader.upload(image, {
        resource_type: "image",
        folder: "profile_images",
      });
      profileImageUrl = result.secure_url;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await User.create({
      email,
      password: hashedPassword,
      username,
      image: profileImageUrl,
      emailVerified: new Date(),
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