"use client";

import { useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import { Divider, Typography, Box, Tabs, Tab, Grid } from "@mui/material";
import { Masonry } from "@mui/lab";
import ProfileVideoCard from "@/components/ProfileVideoCard";
import { useParams } from "next/navigation";
import FollowButton from "@/components/follow/FollowButton";

export default function ProfilePage() {
  const params = useParams();
  const userId = params.userId;

  const [user, setUser] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingVideos, setLoadingVideos] = useState(true);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState(0);

  useEffect(() => {
    if (!userId) return;

    setLoadingUser(true);
    setLoadingVideos(true);

    fetch(`/api/users/${userId}`)
      .then((res) => {
        if (!res.ok) throw new Error("User fetch failed");
        return res.json();
      })
      .then((data) => setUser(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoadingUser(false));

    fetch(`/api/videos?userId=${userId}&page=1&limit=50`)
      .then((res) => {
        if (!res.ok) throw new Error("Videos fetch failed");
        return res.json();
      })
      .then((data) => setVideos(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoadingVideos(false));
  }, [userId]);

  if (error) return <Typography color="error">{error}</Typography>;
  if (loadingUser) return <Typography>Loading profile...</Typography>;

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", px: { xs: 2, sm: 4 }, py: 4 }}>
      {/* Profile Header */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "center", sm: "flex-start" },
          gap: 3,
          mb: 4,
        }}
      >
        <Avatar
          alt={user.username || "Unknown"}
          src={user.image || "/default-avatar.png"}
          sx={{ width: 100, height: 100 }}
        />
        <Box sx={{ textAlign: { xs: "center", sm: "left" } }}>
          <Typography variant="h4" fontWeight="bold">
            @{user.username}
          </Typography>
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            justifyContent={{ xs: "center", sm: "flex-start" }}
            mt={1}
          >
            <FollowButton profileUserId={user._id} />
            <Typography variant="h6">❤️ {user.totalLikes} Likes</Typography>
          </Stack>
        </Box>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Tabs for Reels / Likes (expandable) */}
      <Tabs
        value={tab}
        onChange={(e, newValue) => setTab(newValue)}
        variant="fullWidth"
        textColor="primary"
        indicatorColor="primary"
        sx={{ mb: 3 }}
      >
        <Tab label="Reels" />
        <Tab label="Liked" disabled />
      </Tabs>

      {/* Videos Grid / Masonry */}
      {loadingVideos ? (
        <Typography>Loading videos...</Typography>
      ) : videos.length === 0 ? (
        <Typography>No videos uploaded yet.</Typography>
      ) : (
        <Masonry
          columns={{ xs: 1, sm: 2, md: 3, lg: 4 }}
          spacing={2}
        >
          {videos.map((v) => (
            <ProfileVideoCard
              key={v._id}
              video={v}
              videoUrl={v.videoUrl}
              thumbnailUrl={v.thumbnailUrl}
              title={v.title}
              description={v.description}
            />
          ))}
        </Masonry>
      )}
    </Box>
  );
}
