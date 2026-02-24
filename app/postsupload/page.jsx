"use client";
import React from "react";
import { Box, Typography } from "@mui/material";
import Postupload from "@/components/Postupload";

const CreatePostPage = () => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        py: 4,
        px: { xs: 2, sm: 4 },
        bgcolor: "#f5f5f5",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
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