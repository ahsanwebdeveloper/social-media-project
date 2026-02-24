import { connectToDatabase } from "@/lib/db";
import Post from "@/models/post";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

// GET POSTS
export async function GET(req) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);

    const postId = searchParams.get("postId");
    const userId = searchParams.get("userId");
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;

    let posts;

    if (postId) {
      posts = await Post.findById(postId).populate({
        path: "user",
        select: "username image",
      });

      if (!posts) return NextResponse.json({ message: "Post not found" }, { status: 404 });
      return NextResponse.json(posts);
    }

    const query = userId ? { user: new mongoose.Types.ObjectId(userId) } : {};
    posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate({ path: "user", select: "username image" });

    return NextResponse.json(posts);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}

// CREATE POST
export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized user" }, { status: 401 });
    }

    await connectToDatabase();

    const contentType = req.headers.get("content-type") || "";
    let title, description, postUrl = "", images = [];

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      title = formData.get("title");
      description = formData.get("description");
      postUrl = formData.get("postUrl") || "";
      const files = formData.getAll("images");
      const captions = formData.getAll("captions[]") || [];

      if (!title || !description)
        return NextResponse.json({ message: "Title and description are required" }, { status: 400 });
      if (!postUrl && files.length === 0)
        return NextResponse.json({ message: "Either postUrl or at least one image is required" }, { status: 400 });

      // Map uploaded images (replace with real storage logic)
      images = files.map((file, i) => ({
        url: `/uploads/${file.name}`,
        caption: captions[i] || "",
      }));
    } else {
      const body = await req.json();
      title = body.title;
      description = body.description;
      postUrl = body.postUrl || "";
      images = body.images || [];

      if (!title || !description)
        return NextResponse.json({ message: "Title and description are required" }, { status: 400 });
      if (!postUrl && images.length === 0)
        return NextResponse.json({ message: "Either postUrl or at least one image is required" }, { status: 400 });
    }

    const post = await Post.create({
      user: session.user.id,
      title,
      description,
      postUrl,
      images,
      sharesCount: 0,
    });

    return NextResponse.json({ message: "Post uploaded successfully", post }, { status: 201 });
  } catch (err) {
    console.error("POST /api/posts error:", err);
    return NextResponse.json({ message: "Post upload failed", error: err.message }, { status: 500 });
  }
}

// UPDATE SHARE COUNT
export async function PATCH(req) {
  try {
    await connectToDatabase();
    const { postId } = await req.json();
    if (!postId) return NextResponse.json({ message: "Post ID is required" }, { status: 400 });

    const post = await Post.findByIdAndUpdate(
      postId,
      { $inc: { sharesCount: 1 } },
      { new: true }
    ).populate({ path: "user", select: "username image" });

    if (!post) return NextResponse.json({ message: "Post not found" }, { status: 404 });
    return NextResponse.json({ sharesCount: post.sharesCount });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Failed to update share count" }, { status: 500 });
  }
}