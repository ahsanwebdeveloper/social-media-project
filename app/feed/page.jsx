"use client";
import React, { useState, useEffect } from "react";
import { Box, Grid, CircularProgress } from "@mui/material";
import { useInView } from "react-intersection-observer";

import VideoCard from "@/components/VideoCard";
import PostCard from "@/components/PostCard";

const FeedPage = () => {
  const [feed, setFeed] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const { ref, inView } = useInView({ threshold: 0 });

  const fetchFeed = async () => {
    setLoading(true);

    try {
      const videoRes = await fetch(`/api/videos?page=${page}&limit=3`);
      const videos = await videoRes.json();

      const postRes = await fetch(`/api/posts?page=${page}&limit=3`);
      const posts = await postRes.json();

      const formattedVideos = videos.map((v) => ({
        ...v,
        type: "video",
      }));

      const formattedPosts = posts.map((p) => ({
        ...p,
        type: "post",
      }));

      const merged = [...formattedVideos, ...formattedPosts]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      if (merged.length > 0) {
        setFeed((prev) => [...prev, ...merged]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, [page]);

  useEffect(() => {
    if (inView && !loading) {
      setPage((prev) => prev + 1);
    }
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
        "&::-webkit-scrollbar": { display: "none" },
        msOverflowStyle: "none",
        scrollbarWidth: "none",
      }}
    >
      <Grid container direction="column" alignItems="center">
        {feed.map((item, index) => {
          const isLast = index === feed.length - 1;

          return (
            <Grid
              item
              key={`${item._id}-${index}`}
              ref={isLast ? ref : null}
              sx={{
                scrollSnapAlign: "center",
                width: "100%",
                height: "100vh",
                display: "flex",
                justifyContent: "center",
              }}
            >
              {item.type === "video" ? (
                <VideoCard video={item} />
              ) : (
                <PostCard post={item} />
              )}
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

export default FeedPage;