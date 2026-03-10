import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";

export async function POST(req) {
  try {
    const { email, code } = await req.json();

    if (!email || !code) {
      return new Response(JSON.stringify({ error: "Email and code required" }), { status: 400 });
    }

    await connectToDatabase();

    const user = await User.findOne({ email });

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }

    if (user.isVerified) {
      return new Response(JSON.stringify({ success: true, message: "Already verified" }), { status: 200 });
    }

    if (user.verificationCode !== code || new Date() > user.verificationCodeExpires) {
      return new Response(JSON.stringify({ error: "Invalid or expired code" }), { status: 400 });
    }

    user.isVerified = true;
    user.verificationCode = null;
    user.verificationCodeExpires = null;
    await user.save();

    return new Response(JSON.stringify({ success: true }), { status: 200 });

  } catch (err) {
    console.error("VERIFY EMAIL ERROR:", err);
    return new Response(JSON.stringify({ error: "Verification failed" }), { status: 500 });
  }
}