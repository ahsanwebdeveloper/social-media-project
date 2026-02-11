export async function shareVideo(videoId) {
    try{
        const res = await fetch("/api/share", {
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({videoId})
        });
        const data = await res.json();
        if(!res.ok) throw new Error(data.error || "Failed to share video");
        return data;
    } catch(err){
        console.error("Error sharing video:", err);
        throw err;
    }
}