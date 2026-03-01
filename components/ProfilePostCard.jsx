"use client";
import { useState } from "react";
import {
  Box,
  Modal,
  Typography,
  Avatar,
  Stack,
  IconButton,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CommentIcon from "@mui/icons-material/Comment";
import ShareIcon from "@mui/icons-material/Share";
import CollectionsIcon from "@mui/icons-material/Collections";
import CloseIcon from "@mui/icons-material/Close";
import Link from "next/link";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

export default function ProfilePostCard({ post }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      
      <Box
        onClick={() => setOpen(true)}
        sx={{
          position: "relative",
          cursor: "pointer",
          borderRadius: 2,
          overflow: "hidden",
          "&:hover .overlay": {
            opacity: 1,
          },
        }}
      >
        {/* First Image */}
        <img
          src={post.images?.[0]?.url}
          alt="post"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />

        {/* Multi Image Icon */}
        {post.images?.length > 1 && (
          <CollectionsIcon
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              color: "white",
              fontSize: 20,
            }}
          />
        )}

        {/* Hover Overlay */}
        <Box
          className="overlay"
          sx={{
            position: "absolute",
            inset: 0,
            bgcolor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 3,
            color: "white",
            opacity: 0,
            transition: "0.3s",
          }}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <FavoriteIcon />
            <Typography>{post.likesCount ?? 0}</Typography>
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center">
            <CommentIcon />
            <Typography>{post.commentsCount ?? 0}</Typography>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <ShareIcon />
            <Typography>{post.sharesCount ?? 0}</Typography>
          </Stack>
        </Box>
      </Box>

      {/*  MODAL */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            width: "100vw",
            height: "100vh",
            bgcolor: "rgba(0,0,0,0.95)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
          }}
        >
          {/* CLOSE BUTTON */}
          <IconButton
            onClick={() => setOpen(false)}
            sx={{
              position: "absolute",
              top: 20,
              right: 20,
              color: "white",
              bgcolor: "rgba(0,0,0,0.5)",
              "&:hover": { bgcolor: "rgba(0,0,0,0.8)" },
              zIndex: 10,
            }}
          >
            <CloseIcon />
          </IconButton>

          <Box
            sx={{
              width: { xs: "95%", sm: 800 },
              bgcolor: "white",
              borderRadius: 3,
              overflow: "hidden",
            }}
          >
            {/* USER INFO */}
            <Box sx={{ p: 2 }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Avatar src={post.user?.image} />
                <Link href={`/profile/${post.user?._id}`}>
                  @{post.user?.username}
                </Link>
              </Stack>
            </Box>

            {/* SWIPE CAROUSEL  */}
            <Swiper spaceBetween={10} slidesPerView={1}>
              {post.images?.map((img) => (
                <SwiperSlide key={img._id}>
                  <Box>
                    <img
                      src={img.url}
                      alt={img.caption}
                      style={{
                        width: "100%",
                        height: 500,
                        objectFit: "cover",
                      }}
                    />

                    {img.caption && (
                      <Box sx={{ p: 2 }}>
                        <Typography variant="body2">
                          {img.caption}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </SwiperSlide>
              ))}
            </Swiper>

            <Box sx={{ p: 2 }}>
              <Typography fontWeight="bold">
                {post.caption}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Modal>
    </>
  );
}