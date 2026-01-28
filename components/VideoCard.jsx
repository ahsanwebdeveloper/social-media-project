"use client";
import React, { useRef, useEffect } from "react";
import { Card, Box, Typography, IconButton } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CommentIcon from "@mui/icons-material/Comment";
import ShareIcon from "@mui/icons-material/Share";
import { useInView } from "react-intersection-observer";

const VideoCard = ({ videoUrl, thumbnailUrl, title, description }) => {
  const videoRef = useRef(null);
  const { ref, inView } = useInView({ threshold: 0.75 });

  // Autoplay/pause
  useEffect(() => {
    if (!videoRef.current) return;
    if (inView) videoRef.current.play();
    else videoRef.current.pause();
  }, [inView]);

  return (
    <Card
      ref={ref}
      sx={{
        width: 320,
        height: 570,
        borderRadius: 3,
        overflow: "hidden",
        position: "relative",
        boxShadow: 3,
        backgroundColor: "black",
      }}
    >
      {/* Video */}
      <video
        ref={videoRef}
        src={videoUrl}
        poster={thumbnailUrl}
        loop
        muted
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
        onClick={() => {
          if (videoRef.current.paused) videoRef.current.play();
          else videoRef.current.pause();
        }}
      />

      {/* Overlay: Title & Description */}
      <Box
        sx={{
          position: "absolute",
          bottom: 16,
          left: 16,
          color: "white",
          textShadow: "1px 1px 5px rgba(0,0,0,0.7)",
        }}
      >
        <Typography variant="h6" sx={{ fontSize: 18 }}>
          {title}
        </Typography>
        <Typography variant="body2" sx={{ fontSize: 14 }}>
          {description}
        </Typography>
      </Box>

      {/* Right side vertical buttons */}
      <Box
        sx={{
          position: "absolute",
          right: 16,
          bottom: 100,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          color: "white",
        }}
      >
        <IconButton sx={{ color: "white" }}>
          <FavoriteIcon fontSize="large" />
        </IconButton>
        <IconButton sx={{ color: "white" }}>
          <CommentIcon fontSize="large" />
        </IconButton>
        <IconButton sx={{ color: "white" }}>
          <ShareIcon fontSize="large" />
        </IconButton>
      </Box>
    </Card>
  );
};

export default VideoCard;
