"use client"
import { ImageKitProvider } from "@imagekit/next";
import {SessionProvider} from "next-auth/react";
const urlEndpoint = process.env.NEXT_PUBLIC_URL_ENDPOINT;
const publickey = process.env.NEXT_PUBLIC_PUBLIC_KEY;


export default function Providers({children}){
    const authenticator = async ()=>{
    try{
        const response = await fetch("/api/imagekit-auth");
        if(!response.ok){
            const errortext = await response.text();
            throw new Error(
                `Request failed with status ${response.status}: ${errortext}`
            );
            
        }
        const data = await response.json();
        const {signature, expire, token} = data;
        return {signature, expire, token};
    }catch(error){
        console.log(error)
       throw new Error (`Authentication request failed: ${error.message}`);
    };
    
};
    return(
        <SessionProvider>
        <ImageKitProvider
        urlEndpoint={urlEndpoint}
            publickey ={publickey}
            authenticator = {authenticator}>
           {children} 
        </ImageKitProvider>
        </SessionProvider>
    )
}
