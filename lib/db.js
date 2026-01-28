import mongoose from 'mongoose'
const MONGODB_URI = process.env.MONGODB_URL
if(!MONGODB_URI){
    throw new Error("please defind mongodb url in env file");
}
let cached = global.mongoose;
if(!cached){
    cached = global.mongoose = {conn:null, promise:null};
}
export async function connectToDatabase(){
 if(cached.conn){
    return cached.conn;
 }
 if(!cached.promise){
    cached.promise = mongoose.connect(MONGODB_URI,{
        bufferCommands:false
    })
 }


 cached.conn = await cached.promise;
 return cached.conn;
}