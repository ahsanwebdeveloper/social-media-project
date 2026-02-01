"use client";
import React, { useState, useEffect } from "react";
import { Box, Grid, CircularProgress } from "@mui/material";
import VideoCard from "@/components/VideoCard";
import { useInView } from "react-intersection-observer";

const VideoPage = () => {
  const [videos, setVideos] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const { ref, inView } = useInView({ threshold: 0 });

  const fetchVideos = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/videos?page=${page}&limit=5`);
      const data = await res.json();
      if (data.length > 0) setVideos((prev) => [...prev, ...data]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, [page]);

  useEffect(() => {
    if (inView && !loading) setPage((prev) => prev + 1);
  }, [inView, loading]);

  return (
    <Box
  sx={{
    height: "100vh",
    overflowY: "scroll",
    scrollSnapType: "y mandatory",
    scrollBehavior: "smooth",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    rowGap: 4,
    py: 2,
    "&::-webkit-scrollbar": {
      display: "none",
    },
    msOverflowStyle: "none", 
    scrollbarWidth: "none",  
  }}
>

      <Grid
        container
        direction="column"
        alignItems="center"
        spacing={4} 
      >
        {videos.map((video, index) => {
          const isLast = index === videos.length - 1;
          return (
            <Grid
              item
              key={`${video._id}-${index}`}
              ref={isLast ? ref : null}
              sx={{
                scrollSnapAlign: "center",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: "100vh", 
              }}
            >
              <VideoCard
                key={video.id}
                videoUrl={video.videoUrl}
                thumbnailUrl={video.thumbnailUrl}
                title={video.title}
                description={video.description}
                video={video}
              />
            </Grid>
          );
        })}
      </Grid>

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
          <CircularProgress color="inherit" />
        </Box>
      )}
    </Box>
  );
};

export default VideoPage;
