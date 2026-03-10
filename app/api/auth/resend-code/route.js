import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import { sendVerificationEmail } from "@/lib/email";

export async function POST(req) {

  const { email } = await req.json();

  await connectToDatabase();

  const user = await User.findOne({ email });

  if (!user) {
    return Response.json({ error: "User not found" }, { status: 404 });
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString();

  user.verificationCode = code;
  user.verificationCodeExpires = Date.now() + 10 * 60 * 1000;

  await user.save();

  await sendVerificationEmail(email, code);

  return Response.json({ message: "New code sent" });
}