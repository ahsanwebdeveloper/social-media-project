import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import { sendVerificationEmail } from "@/lib/email";

export async function POST(request) {
  try {
    await connectToDatabase();

    const { email, password, username, image } = await request.json();

    if (!email || !password || !username) {
      return NextResponse.json(
        { error: "Email, password aur username required hain" },
        { status: 400 }
      );
    }

    // check username
    const existusername = await User.findOne({ username });
    if (existusername) {
      return NextResponse.json(
        { error: "Username already exist karta hai" },
        { status: 409 }
      );
    }

    // check email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already exist karta hai" },
        { status: 409 }
      );
    }

    let profileImageUrl = "";

    // upload image
    if (image) {
      const result = await cloudinary.uploader.upload(image, {
        resource_type: "image",
        folder: "profile_images",
      });

      profileImageUrl = result.secure_url;
    }

    // ⭐ generate 6 digit verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // create user
    const user = await User.create({
      email,
      password,
      username,
      image: profileImageUrl,
      verificationCode: code,
      verificationCodeExpires: Date.now() + 10 * 60 * 1000, // 10 minutes
      isVerified: false,
    });

    // send verification email
    await sendVerificationEmail(user.email, code);

    return NextResponse.json(
      {
        message: "User register ho gaya. Please apni email verify karein.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("REGISTER ERROR:", error);

    return NextResponse.json(
      { error: "Server error. Try again later." },
      { status: 500 }
    );
  }
}