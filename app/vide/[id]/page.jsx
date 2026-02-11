"use client";

import React from "react";
import { useParams } from "next/navigation";
import VideoCard from "@/components/VideoCard";
import { useState, useEffect } from "react";

export default function SingleVideoPage() {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchVideo = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/videos?videoId=${id}`);
        const data = await res.json();
        setVideo(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchVideo();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!video) return <div>Video not found</div>;

  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: 32 }}>
      <VideoCard video={video} />
    </div>
  );
}
