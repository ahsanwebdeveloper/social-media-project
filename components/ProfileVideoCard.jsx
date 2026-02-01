"use client"
import { Card, CardMedia, CardContent, Typography } from "@mui/material";

const VideoCard = ({ video }) => {
  return (
    <Card
      sx={{
        mb: 2,
        breakInside: "avoid", 
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      <CardMedia
        component="video"
        src={video.videoUrl}
        controls
        sx={{
          width: "100%",
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
        }}
      />
      {video.caption && (
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            {video.caption}
          </Typography>
        </CardContent>
      )}
    </Card>
  );
};

export default VideoCard;
