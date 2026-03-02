"use client";
import React from "react";
import { Box, Typography } from "@mui/material";
import Postupload from "@/components/Postupload";
import { useTheme } from "@mui/material/styles";

const CreatePostPage = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        py: 4,
        px: { xs: 2, sm: 4 },
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        bgcolor: theme.palette.background.default,
        color: theme.palette.text.primary,
      }}
    >
      <Typography variant="h4" fontWeight="bold" mb={3}>
        Create New Post
      </Typography>

      <Postupload />
    </Box>
  );
};

export default CreatePostPage;