"use client";
import React, { useRef, useState } from "react";
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

const PostCard = ({ post }) => {
  const scrollRef = useRef(null);
  const { ref } = useInView({ threshold: 0.75 });

  // pass postId as second argument
  const { liked, likesCount, handleLike } = useLike(null, post._id);

  const { sharesCount, handleShare } = useShare(
    post.sharesCount,
    null,
    post._id
  );

  const { comments } = useComments(null, post._id);

  const [openComments, setOpenComments] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const scrollLeft = scrollRef.current.scrollLeft;
    const width = scrollRef.current.clientWidth;
    const index = Math.round(scrollLeft / width);
    setCurrentIndex(index);
  };

  return (
    <Box
          ref={ref}
          sx={{
            width: { xs: "100%", sm: 400 },
            height: { xs: "80%", sm: 700 },
            position: "relative",
          }}
        >
      <Card
        sx={{
          width: "100%",
          height: "100%",
          borderRadius: { xs: 3, sm: 3 },
          overflow: "hidden",
          backgroundColor: "black",
          position: "relative",
        }}
      >
        {/* IMAGE SLIDER */}
        <Box
          ref={scrollRef}
          onScroll={handleScroll}
          sx={{
            display: "flex",
            overflowX: "scroll",
            scrollSnapType: "x mandatory",
            height: "100%",
            scrollBehavior: "smooth",
            "&::-webkit-scrollbar": { display: "none" },
            scrollbarWidth: "none",
          }}
        >
          {post.images?.map((img, index) => (
            <Box
              key={index}
              sx={{
                minWidth: "100%",
                height: "100%",
                scrollSnapAlign: "center",
              }}
            >
              <img
                src={img.url}
                alt={img.caption || "Post image"}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </Box>
          ))}
        </Box>

        {/* DOTS */}
        <Box
          sx={{
            position: "absolute",
            bottom: 150,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: 2,
          }}
        >
          {post.images?.map((_, index) => (
            <Box
              key={index}
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                gap: 2,
                backgroundColor:
                  currentIndex === index ? "white" : "gray",
              }}
            />
          ))}
        </Box>

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
          <Stack direction="column" spacing={1}>
            <Link
              href={`/profile/${post.user._id}`}
              style={{
                color: "white",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <Avatar
                src={post.user?.image || "/default-avatar.png"}
                sx={{ width: 50, height: 50 }}
              />
              @{post.user?.username}
            </Link>

            <FollowButton profileUserId={post.user._id} />
          </Stack>

          <Typography fontWeight="bold" mt={1}>
            {post.title}
          </Typography>

          <Typography variant="body2">
            {post.description}
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
          <Link href={`/profile/${post.user._id}`}>
            <Avatar
              src={post.user?.image || "/default-avatar.png"}
              sx={{ width: 56, height: 56 }}
            />
          </Link>

          {/* LIKE */}
          <IconButton
            sx={{ color: "white", flexDirection: "column" }}
            onClick={handleLike}
          >
            <FavoriteIcon color={liked ? "error" : "inherit"} />
            <Typography variant="caption">
              {likesCount}
            </Typography>
          </IconButton>

          {/* COMMENTS */}
          <IconButton
            sx={{ color: "white", flexDirection: "column" }}
            onClick={() => setOpenComments(true)}
          >
            <CommentIcon />
            <Typography variant="caption">
              {comments?.length ?? 0}
            </Typography>
          </IconButton>

          {/* SHARE */}
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

      {/* COMMENT PANEL */}
      <Slide direction="up" in={openComments} mountOnEnter unmountOnExit>
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            width: "100%",
            height: "70%",
           bgcolor: "background.paper",
            opacity: 0.85,
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
            <CommentList postId={post._id} />
          </Box>
        </Box>
      </Slide>
    </Box>
  );
};

export default PostCard;