import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../lib/db";
import Video from "@models/Video"
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";



export async function GET(){
    try{
        await connectToDatabase()
        const videos = await Video.find({}).sort({createdAt : -1}).lean()
        if(!videos || videos.lenght === 0){
            return NextResponse.json([], {status:200})
        }
        return NextResponse.json(videos)
    } catch(error){
       return NextResponse.json(
            {error :"failed to fatch video"},
            {status : 200}
        )

    }
}
export async function POST(request){
    try{
        const session = await getServerSession(authOptions)
        if(!session){
            return NextResponse.json(
                {error : "Unauthorized"},
                {status:401}
            )
        }
        await connectToDatabase()
       const body = await request.json() 
       if(!body.title || !body.description || !body.videoUrl || !body.thubmnailUrl) {
        return NextResponse.json(
                {error : "Missing requird fields"},
                {status:400}
            );
       }
       const videoData = {
        ...body,
        controls :body.controls ?? true,
        transformation :{
            height :1920,
            width :1080,
            quailty : body.transformation?.quailty ?? 100
        } 
       }
        const newVideo = await Video.create(videoData)
        return NextResponse.json(newVideo)

    } catch(error){
        return NextResponse.json(
            {error:"failed to create a video"},
            {status:200}
        )
    }
}