"use client";
import React, { useRef, useEffect } from "react";
import { Card, Box, Typography, IconButton } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CommentIcon from "@mui/icons-material/Comment";
import ShareIcon from "@mui/icons-material/Share";
import { useInView } from "react-intersection-observer";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import { useSession } from "next-auth/react";
import Link from "next/link";
import FollowButton from "@/components/follow/FollowButton";
import { useParams } from "next/navigation";
import useLike from "../hooks/useLike";

const VideoCard = ({ videoUrl, thumbnailUrl, title, description,video }) => {
  const { liked, likesCount, handleLike } = useLike(video._id);
  const params = useParams();
    const userId = params.userId;
  const { data: session, status } = useSession();
  const videoRef = useRef(null);
  const { ref, inView } = useInView({ threshold: 0.75 });
  useEffect(() => {
    if (!videoRef.current) return;
    if (inView) videoRef.current.play();
    else videoRef.current.pause();
  }, [inView]);
  console.log(session)
  
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


      <Box
        sx={{
          position: "absolute",
          bottom: 16,
          left: 16,
          color: "white",
          textShadow: "1px 1px 5px rgba(0,0,0,0.7)",
        }}
      >
         <Typography variant="h6" sx={{ color: "white", fontSize: 16 }}>
      <FollowButton profileUserId={video.user._id} />
   <Link href={`/profile/${video.user._id}`} style={{ textDecoration: "none" }}> @{video.user?.username}</Link>
  </Typography>
        <Typography variant="h6" sx={{ fontSize: 18 }}>
          {title}
        </Typography>
        <Typography variant="body2" sx={{ fontSize: 14 }}>
          {description}
        </Typography>
      </Box>

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
        <Link href={`/profile/${video.user._id}`} style={{ textDecoration: "none" }}>
      <Stack direction="row" spacing={1} alignItems="center">
        <Avatar
          alt={video.user?.username || "Unknown"}
          src={video.user?.image || "/default-avatar.png"}
          sx={{ width: 56, height: 56 }}
        />
      </Stack>
    </Link>

        <IconButton sx={{ color: "white", flexDirection:"column" }} onClick={handleLike}>
  {liked ? (
    <FavoriteIcon fontSize="large" color="error" />
  ) : (
    <FavoriteIcon fontSize="large" />
  )}
  <Typography variant="span">{ likesCount}</Typography>
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
