import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";

export async function POST(request) {
  try {
    await connectToDatabase();

    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email aur password required hain" },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already exist karta hai" },
        { status: 409 }
      );
    }

    await User.create({ email, password });

    return NextResponse.json(
      { message: "User successfully register ho gaya" },
      { status: 201 }
    );
  } catch (error) {
  console.error("REGISTER ERROR:", error);

  return NextResponse.json(
    { error: error.message },
    { status: 500 }
  );
}

}
