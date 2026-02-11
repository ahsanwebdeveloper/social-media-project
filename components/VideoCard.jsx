"use client";
import React, { useRef, useEffect, useState } from "react";
import {
  Box,
  Card,
  Typography,
  IconButton,
  Stack,
  Avatar,
  Slide,
  Button,
} from "@mui/material";

import FavoriteIcon from "@mui/icons-material/Favorite";
import CommentIcon from "@mui/icons-material/Comment";
import ShareIcon from "@mui/icons-material/Share";
import { useInView } from "react-intersection-observer";
import Link from "next/link";

import FollowButton from "@/components/follow/FollowButton";
import CommentList from "@/components/comments/CommentList";
import useLike from "@/hooks/useLike";
import useShare from "@/hooks/useShare";
import useComments from "@/hooks/useComments";

const VideoCard = ({ video }) => {
  const videoRef = useRef(null);
  const { ref, inView } = useInView({ threshold: 0.75 });

  const { liked, likesCount, handleLike } = useLike(video._id);
  const { sharesCount, handleShare } = useShare(
    video.sharesCount,
    video._id
  );
  const { comments } = useComments(video._id);

  const [openComments, setOpenComments] = useState(false);

  // autoplay / pause
  useEffect(() => {
    if (!videoRef.current) return;
    if (inView) videoRef.current.play();
    else videoRef.current.pause();
  }, [inView]);

  return (
    <Box
      ref={ref}
      sx={{
        width: { xs: "100%", sm: 400 },
        height: { xs: "100vh", sm: 700 },
        position: "relative",
        margin: "auto",
      }}
    >
      <Card
        sx={{
          width: "100%",
          height: "100%",
          borderRadius: { xs: 0, sm: 3 },
          overflow: "hidden",
          backgroundColor: "black",
          position: "relative",
        }}
      >
        {/* VIDEO */}
        <video
          ref={videoRef}
          src={video.videoUrl}
          poster={video.thumbnailUrl}
          loop
          muted
          playsInline
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
          onClick={() => {
            if (videoRef.current.paused) videoRef.current.play();
            else videoRef.current.pause();
          }}
        />

        {/* LEFT INFO */}
        <Box
          sx={{
            position: "absolute",
            bottom: 20,
            left: 16,
            color: "white",
            maxWidth: "70%",
          }}
        >
         <Stack direction="column" spacing={1} alignItems="flex-start">
  <Link
    href={`/profile/${video.user._id} || "#"}`}
    style={{
      color: "white",
      textDecoration: "none",
      fontWeight: 500,
      display: "flex",
      alignItems: "center",
      gap: "8px", 
    }}
  >
    <Avatar
      src={video.user?.image || "/default-avatar.png"}
      sx={{ width: 50, height: 50 }}
    />
    @{video.user?.username}
  </Link>

  <FollowButton profileUserId={video.user._id}  />
</Stack>



          <Typography fontWeight="bold" mt={1}>
            {video.title}
          </Typography>

          <Typography variant="body2">
            {video.description}
          </Typography>
        </Box>

        {/* RIGHT ACTIONS */}
        <Box
          sx={{
            position: "absolute",
            right: 16,
            bottom: 120,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            alignItems: "center",
          }}
        >
          <Link href={`/profile/${video.user._id}`}>
            <Avatar
              src={video.user?.image || "/default-avatar.png"}
              alt={video.user?.username}
              sx={{ width: 56, height: 56 }}
            />
          </Link>
          <IconButton
            sx={{ color: "white", flexDirection: "column" }}
            onClick={handleLike}
          >
            <FavoriteIcon color={liked ? "error" : "inherit"} />
            <Typography variant="caption">
              {likesCount}
            </Typography>
          </IconButton>

          <IconButton
            sx={{ color: "white", flexDirection: "column" }}
            onClick={() => setOpenComments(true)}
          >
            <CommentIcon />
            <Typography variant="caption">
              {comments?.length ?? 0}
            </Typography>
          </IconButton>

          <IconButton
            sx={{ color: "white", flexDirection: "column" }}
            onClick={handleShare}
          >
            <ShareIcon />
            <Typography variant="caption">
              {sharesCount ?? 0}
            </Typography>
          </IconButton>
        </Box>
      </Card>

      {/* COMMENTS PANEL */}
      <Slide direction="up" in={openComments} mountOnEnter unmountOnExit>
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            width: "100%",
            height: "70%",
            bgcolor: "white",
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            zIndex: 10,
            overflowY: "auto",
          }}
        >
          <Button
            onClick={() => setOpenComments(false)}
            sx={{ position: "absolute", right: 8, top: 8 }}
            variant="contained"
            size="small"
          >
            Close
          </Button>

          <Box
            sx={{
              width: 40,
              height: 5,
              background: "#555",
              borderRadius: 3,
              mx: "auto",
              my: 2,
            }}
          />

          <Typography variant="h6" sx={{ textAlign: "center", mb: 2 }}>
            Comments
          </Typography>

          <Box sx={{ px: 2 }}>
            <CommentList videoId={video._id} />
          </Box>
        </Box>
      </Slide>
    </Box>
  );
};

export default VideoCard;
