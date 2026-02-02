"use client";
import { useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import { Divider, Typography } from "@mui/material";
import { Masonry } from "@mui/lab";
import ProfileVideoCard from "@/components/ProfileVideoCard";
import { useParams } from "next/navigation";

export default function ProfilePage() {
  const params = useParams();
  const userId = params.userId;

  const [user, setUser] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingVideos, setLoadingVideos] = useState(true);
  const [error, setError] = useState(null);

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

    fetch(`/api/videos?userId=${userId}&page=1&limit=2`)
      .then((res) => {
        if (!res.ok) throw new Error("Videos fetch failed");
        return res.json();
      })
      .then((data) => setVideos(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoadingVideos(false));
  }, [userId]);
  console.log(`${userId}`)

  if (error) return <Typography color="error">{error}</Typography>;
  if (loadingUser) return <Typography>Loading profile...</Typography>;

  return (
    <div style={{ padding: "16px" }}>
      <Stack direction="row" spacing={2} alignItems="center">
        <Avatar
          alt={user.username || "Unknown"}
          src={user.image || "/default-avatar.png"}
          sx={{ width: 64, height: 64 }}
        />
        <Typography variant="h4">@{user.username}</Typography>
      </Stack>

      <Divider sx={{ my: 2 }} />
      <Typography variant="h4">User Reel</Typography>
      {loadingVideos ? (
        <Typography>Loading videos...</Typography>
      ) : videos.length === 0 ? (
        <Typography>No videos uploaded yet.</Typography>
      ) : (
        <Masonry columns={{ xs: 1, sm: 2, md: 3, lg: 4 }} spacing={2}>
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
    </div>
  );
}
