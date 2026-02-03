import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Comment from "@/models/Comment";
import Video from "@/models/video";
export async function POST(req) {
    try{
    const session = await getServerSession(authOptions);
    if(!session?.user?.id){
     return NextResponse.json(
        {error: "please login"},
        {status:401}
     );
    }
     const { videoId } = await req.json();
     if(!videoId){
        return NextResponse.json(
            {error : "video id is requird"},
            {status: 400}
        )
     }

      await connectToDatabase();

    const userId = session.user.id;
     await Comment.create({
          user: userId,
          video: videoId,
        });
    }catch(err){
        console.error("comment POST ERROR:", err);
    return NextResponse.json(
      { error: "comment action failed" },
      { status: 500 }
    );

    }
}

export async function GET(req) {
    try{
     await connectToDatabase();
     const { searchParams } = new URL(req.url);
    const videoId = searchParams.get("videoId");
    const type = searchParams.get("type");
     
     if (!videoId) {
          return NextResponse.json(
            { error: "videoId is required" },
            { status: 400 }
          );
        }
    //comment

    }catch(err){

    }
}