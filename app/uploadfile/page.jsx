"use client";

import FileUpload from "@/components/Fileupload";
import { Box, Card, CardMedia, Typography } from "@mui/material";
import { useState } from "react";

export default function UploadPage() {
  const [video, setVideo] = useState(null);

  return (
    <Box p={4}>
      <FileUpload onSuccess={setVideo} />

      {video && (
        <Card sx={{ mt: 4 }}>
          <Typography variant="h6">{video.title}</Typography>
          <CardMedia component="video" src={video.videoUrl} controls />
          <CardMedia component="img" src={video.thumbnailUrl} />
        </Card>
      )}
    </Box>
  );
}
