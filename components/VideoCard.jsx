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
import { useSession } from "next-auth/react";
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
  const [openComments, setOpenComments] = useState(false);
  const { data: session } = useSession();
const { sharesCount, handleShare } = useShare(video.sharesCount, video._id);
const {
    comments,
  } = useComments(video._id);


  // autoplay / pause logic
  useEffect(() => {
    if (!videoRef.current) return;
    if (inView) videoRef.current.play();
    else videoRef.current.pause();
  }, [inView]);

  return (
    <Box
      ref={ref}
      sx={{
        width: 320,
        height: 570,
        position: "relative",
        margin: "auto",
      }}
    >
      <Card
        sx={{
          width: "100%",
          height: "100%",
          borderRadius: 3,
          overflow: "hidden",
          boxShadow: 3,
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
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          onClick={() => {
            if (videoRef.current.paused) videoRef.current.play();
            else videoRef.current.pause();
          }}
        />

        {/* INFO BOX */}
        <Box
          sx={{
            position: "absolute",
            bottom: 16,
            left: 16,
            color: "white",
            textShadow: "1px 1px 5px rgba(0,0,0,0.7)",
          }}
        >
          <Box sx={{ mb: 2, px: 1 }}>
            <Stack direction="column" spacing={1} alignItems="center">
              <FollowButton profileUserId={video.user._id} />
            </Stack>

            <Link
              href={`/profile/${video.user._id}`}
              style={{
                color: "#ffffff",
                textDecoration: "none",
                fontWeight: 500,
                fontSize: 14,
              }}
            >
              @{video.user?.username}
            </Link>

            {/* Video Title */}
            <Typography
              variant="h6"
              sx={{
                fontSize: { xs: 14, sm: 16 },
                mt: 1,
                fontWeight: "bold",
                color: "#ffffff",
                textAlign: { xs: "center", sm: "left" },
              }}
            >
              {video.title}
            </Typography>

            {/* Video Description */}
            <Typography
              variant="body2"
              sx={{
                fontSize: { xs: 12, sm: 14 },
                color: "#e0e0e0",
                textAlign: { xs: "center", sm: "left" },
                mt: 0.5,
              }}
            >
              {video.description}
            </Typography>
          </Box>
        </Box>

        {/* ACTIONS RIGHT */}
        <Box
          sx={{
            position: "absolute",
            right: 16,
            bottom: 100,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            alignItems: "center",
          }}
        >
          {/* AVATAR */}
          <Link href={`/profile/${video.user._id}`}>
            <Avatar
              src={video.user?.image || "/default-avatar.png"}
              alt={video.user?.username}
              sx={{ width: 56, height: 56 }}
            />
          </Link>

          {/* LIKE */}
          <IconButton
            sx={{ color: "white", flexDirection: "column" }}
            onClick={handleLike}
          >
            <FavoriteIcon
              fontSize="medium"
              color={liked ? "error" : "inherit"}
            />
            <Typography variant="caption">{likesCount}</Typography>
          </IconButton>

          {/* COMMENT */}
          <IconButton
            sx={{ color: "white", flexDirection: "column" }}
            onClick={() => setOpenComments((prev) => !prev)}
          >
            <CommentIcon fontSize="medium" />
            <Typography variant="caption">{comments?.length ?? 0}</Typography>
          </IconButton>

          {/* SHARE */}
          <IconButton sx={{ color: "white", flexDirection: "column" }} onClick={handleShare}>
            <ShareIcon fontSize="medium" />
            <Typography variant="caption">{sharesCount?? 0}</Typography>
          </IconButton>
        </Box>
      </Card>

      {/* SLIDE COMMENTS PANEL */}
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
              my: 1,
            }}
          />
          <Typography variant="h6" sx={{ textAlign: "center", mb: 1 }}>
            Comments
          </Typography>

          <Box sx={{ px: 2, pb: 2 }}>
            <CommentList videoId={video._id} />
          </Box>
        </Box>
      </Slide>
    </Box>
  );
};

export default VideoCard;
