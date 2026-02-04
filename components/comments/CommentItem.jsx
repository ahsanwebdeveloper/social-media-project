"use client";

import { useSession } from "next-auth/react";
import {
  Box,
  Typography,
  IconButton,
  Avatar,
  Stack,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

export default function CommentItem({ comment, onDelete }) {
  const { data: session } = useSession();

  const isOwner = session?.user?.id === comment.user?._id;

  return (
    <Box sx={{ mb: 2 }}>
      <Stack direction="row" spacing={2} alignItems="flex-start">
        {/* User Avatar */}
        <Avatar
          src={comment.user?.image || "/default-avatar.png"}
          alt={comment.user?.username}
          sx={{ width: 36, height: 36 }}
        />

        {/* Comment Body */}
        <Box sx={{ flex: 1 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 600 }}
            >
              @{comment.user.username}
            </Typography>

            {isOwner && (
              <IconButton
                size="small"
                onClick={() => onDelete(comment._id)}
                sx={{ ml: "auto" }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            )}
          </Stack>

          <Typography
            variant="body2"
            sx={{ mt: 0.5, color: "text.secondary" }}
          >
            {comment.content}
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
}
