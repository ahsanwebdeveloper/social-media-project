import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";

export async function GET(request) {
  await connectToDatabase();

  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token) return NextResponse.json({ error: "Token required" }, { status: 400 });

  const user = await User.findOne({
    emailToken: token,
    emailTokenExpires: { $gt: Date.now() }
  });

  if (!user) return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });

  //  mark email as verified
  user.emailVerified = true;
  user.emailToken = undefined;
  user.emailTokenExpires = undefined;
  await user.save();

  //  redirect to login with query param
  return NextResponse.redirect("/login?verified=true");
}