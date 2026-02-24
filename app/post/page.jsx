"use client";
import React, { useState, useEffect } from "react";
import { Box, Grid, CircularProgress } from "@mui/material";
import PostCard from "@/components/PostCard";
import { useInView } from "react-intersection-observer";

const PostPage = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const { ref, inView } = useInView({ threshold: 0 });

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/posts?page=${page}&limit=5`);
      const data = await res.json();

      if (data.length > 0) {
        setPosts((prev) => [...prev, ...data]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
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
        rowGap: 4,
        py: 2,
        "&::-webkit-scrollbar": { display: "none" },
        msOverflowStyle: "none",
        scrollbarWidth: "none",
      }}
    >
      <Grid container direction="column" alignItems="center" spacing={4}>
        {posts.map((post, index) => {
          const isLast = index === posts.length - 1;

          return (
            <Grid
              item
              key={`${post._id}-${index}`}
              ref={isLast ? ref : null}
              sx={{
                scrollSnapAlign: "center",
                width: "100%",
                height: "100vh",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <PostCard post={post} />
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

export default PostPage;