import Comment from "@/models/Comment";
import { connectToDatabase } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import Post from "@/models/post";
import Video from "@/models/video";

export async function GET(req) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const videoId = searchParams.get("videoId");
    const postId = searchParams.get("postId");

    if (!videoId && !postId) {
      return NextResponse.json({ error: "videoId or postId required" }, { status: 400 });
    }

    const query = {};
    if (videoId) query.video = videoId;
    if (postId) query.post = postId;

    const comments = await Comment.find(query)
      .populate("user", "username image")
      .sort({ createdAt: -1 });

    return NextResponse.json(comments);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectToDatabase();
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { videoId, postId, content, parentComment } = await req.json();
    if (!content || (!videoId && !postId)) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const commentData = {
      user: session.user.id,
      content,
      parentComment: parentComment || null,
    };
    if (videoId) commentData.video = videoId;
    if (postId) commentData.post = postId;

    const comment = await Comment.create(commentData);

if (videoId) {
  await Video.findByIdAndUpdate(videoId, {
    $inc: { commentsCount: 1 },
  });
}

if (postId) {
  await Post.findByIdAndUpdate(postId, {
    $inc: { commentsCount: 1 },
  });
}

const populatedComment = await comment.populate("user", "username image");

return NextResponse.json(populatedComment, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to add comment" }, { status: 500 });
  }
}