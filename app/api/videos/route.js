import { connectToDatabase } from "@/lib/db";
import Video from "@/models/video";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    await connectToDatabase();
    const videos = await Video.find({}).sort({ createdAt: -1 }); // newest first
    return new Response(JSON.stringify(videos), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session)
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });

  try {
    await connectToDatabase();

    const { title, description, videoUrl, thumbnailUrl } = await req.json();

    if (!title || !description || !videoUrl || !thumbnailUrl) {
      return new Response(JSON.stringify({ error: "All fields are required" }), { status: 400 });
    }

    const video = await Video.create({
      title,
      description,
      videoUrl,
      thumbnailUrl,
      userId: session.user.id,
    });

    return new Response(JSON.stringify(video), { status: 201 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
