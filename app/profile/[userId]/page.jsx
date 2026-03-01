"use client";

import { useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import { Divider, Typography, Box, Tabs, Tab } from "@mui/material";
import { Masonry } from "@mui/lab";
import ProfileVideoCard from "@/components/ProfileVideoCard";
import ProfilePostCard from "@/components/ProfilePostCard";
import { useParams } from "next/navigation";
import FollowButton from "@/components/follow/FollowButton";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function ProfilePage() {
  const params = useParams();
  const userId = params.userId;

  const [user, setUser] = useState(null);
  const [videos, setVideos] = useState([]);
  const [posts, setPosts] = useState([]);

  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingVideos, setLoadingVideos] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(true);

  const [error, setError] = useState(null);
  const [tab, setTab] = useState(0);

  const { data: session } = useSession();

  useEffect(() => {
    if (!userId) return;

    setLoadingUser(true);
    setLoadingVideos(true);
    setLoadingPosts(true);

    /* ================= FETCH USER ================= */
    fetch(`/api/users/${userId}`)
      .then((res) => {
        if (!res.ok) throw new Error("User fetch failed");
        return res.json();
      })
      .then((data) => setUser(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoadingUser(false));

    /* ================= FETCH VIDEOS ================= */
    fetch(`/api/videos?userId=${userId}&page=1&limit=50`)
      .then((res) => {
        if (!res.ok) throw new Error("Videos fetch failed");
        return res.json();
      })
      .then((data) => setVideos(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoadingVideos(false));

    /* ================= FETCH POSTS ================= */
    fetch(`/api/posts?userId=${userId}&page=1&limit=50`)
      .then((res) => {
        if (!res.ok) throw new Error("Posts fetch failed");
        return res.json();
      })
      .then((data) => setPosts(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoadingPosts(false));

  }, [userId]);

  if (error) return <Typography color="error">{error}</Typography>;
  if (loadingUser) return <Typography>Loading profile...</Typography>;

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", px: { xs: 2, sm: 4 }, py: 4 }}>

      {/* ================= PROFILE HEADER ================= */}
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

            <Typography variant="h6">
              ❤️ {user.totalLikes} Likes
            </Typography>

            {session?.user?.id === userId && (
              <Link
                href={`/profileupdate/${userId}`}
                style={{ textDecoration: "none" }}
              >
                <Typography variant="body2" color="primary">
                  Update Profile
                </Typography>
              </Link>
            )}
          </Stack>
        </Box>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* ================= TABS ================= */}
      <Tabs
        value={tab}
        onChange={(e, newValue) => setTab(newValue)}
        variant="fullWidth"
        textColor="primary"
        indicatorColor="primary"
        sx={{ mb: 3 }}
      >
        <Tab label="Reels" />
        <Tab label="Posts" />
      </Tabs>

      {/* ================= CONTENT ================= */}

      {/* ===== REELS TAB ===== */}
      {tab === 0 && (
        <>
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
                  videos={videos}
                />
              ))}
            </Masonry>
          )}
        </>
      )}

      {/* ===== POSTS TAB ===== */}
      {tab === 1 && (
        <>
          {loadingPosts ? (
            <Typography>Loading posts...</Typography>
          ) : posts.length === 0 ? (
            <Typography>No posts uploaded yet.</Typography>
          ) : (
            <Masonry
              columns={{ xs: 1, sm: 2, md: 3, lg: 4 }}
              spacing={2}
            >
              {posts.map((p) => (
                <ProfilePostCard
                  key={p._id}
                  post={p}
                />
              ))}
            </Masonry>
          )}
        </>
      )}

    </Box>
  );
}