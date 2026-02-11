"use client";
import { useState } from "react";
import {
  Box,
  Modal,
  IconButton,
  Typography,
  Avatar,
  Stack,
  Slide,
  Button,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CommentIcon from "@mui/icons-material/Comment";
import ShareIcon from "@mui/icons-material/Share";
import useLike from "../hooks/useLike";
import useShare from "../hooks/useShare";
import useComments from "../hooks/useComments";
import Link from "next/link";
import FollowButton from "@/components/follow/FollowButton";
import CommentList from "@/components/comments/CommentList";

export default function ProfileVideoCard({ video, videos }) {
  const [open, setOpen] = useState(false);
  const [openComments, setOpenComments] = useState(false);

  const { liked, likesCount, handleLike } = useLike(video._id);
  const { sharesCount, handleShare } = useShare(video.sharesCount, video._id);
  const { comments } = useComments(video._id);

  return (
    <>
      {/* Thumbnail Preview */}
      <Box
        onClick={() => setOpen(true)}
        sx={{
          width: 300,
          height: 450,
          borderRadius: 3,
          overflow: "hidden",
          cursor: "pointer",
        }}
      >
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </Box>

      {/* Full Screen Modal */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        sx={{ zIndex: (theme) => theme.zIndex.modal }}
      >
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            bgcolor: "rgba(0,0,0,0.95)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* Scroll Container */}
          <Box
            sx={{
              width: { xs: "100%", sm: 400 },
              height: { xs: "100%", sm: 700 },
              bgcolor: "black",
              borderRadius: { sm: 3 },
              overflowY: "scroll",
              scrollSnapType: "y mandatory",
              "&::-webkit-scrollbar": { display: "none" },
            }}
          >
            {videos?.map((v) => (
              <Box
                key={v._id}
                sx={{
                  height: "100%",
                  scrollSnapAlign: "start",
                  position: "relative",
                }}
              >
                {/* VIDEO */}
                <video
                  src={v.videoUrl}
                  autoPlay
                  loop
                  playsInline
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
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
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Avatar
                      src={v.user?.image || "/default-avatar.png"}
                    />
                    <Link
                      href={`/profile/${v.user._id}`}
                      style={{
                        color: "white",
                        textDecoration: "none",
                      }}
                    >
                      @{v.user?.username}
                    </Link>
                    <FollowButton profileUserId={v.user._id} />
                  </Stack>

                  <Typography fontWeight="bold" mt={1}>
                    {v.title}
                  </Typography>
                  <Typography variant="body2">
                    {v.description}
                  </Typography>
                </Box>

                {/* RIGHT ACTIONS */}
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
                  <Link href={`/profile/${v.user._id}`}>
            <Avatar
              src={v.user?.image || "/default-avatar.png"}
              alt={v.user?.username}
              sx={{ width: 56, height: 56 }}
            />
          </Link>
                  {/* LIKE */}
                  <IconButton
                    sx={{ color: "white", flexDirection: "column" }}
                    onClick={handleLike}
                  >
                    <FavoriteIcon
                      color={liked ? "error" : "inherit"}
                    />
                    <Typography variant="caption">
                      {likesCount}
                    </Typography>
                  </IconButton>

                  {/* COMMENT */}
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

                {/* COMMENTS PANEL */}
                <Slide
                  direction="up"
                  in={openComments}
                  mountOnEnter
                  unmountOnExit
                >
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
                      sx={{
                        position: "absolute",
                        right: 8,
                        top: 8,
                      }}
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

                    <Typography
                      variant="h6"
                      sx={{ textAlign: "center", mb: 2 }}
                    >
                      Comments
                    </Typography>

                    <Box sx={{ px: 2 }}>
                      <CommentList videoId={v._id} />
                    </Box>
                  </Box>
                </Slide>
              </Box>
            ))}
          </Box>
        </Box>
      </Modal>
    </>
  );
}
