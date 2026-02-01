"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import { Divider, Typography } from "@mui/material";
import { Masonry } from "@mui/lab";
import ProfileVideoCard from "@/components/ProfileVideoCard";

function Profile() {
  const { data: session, status } = useSession();
  const [video, setVideo] = useState([]);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.id) {
      fetch(`/api/videos?userId=${session.user.id}&page=1&limit=10`)
        .then((res) => res.json())
        .then((data) => setVideo(data))
        .catch((err) => console.error(err));
    }
  }, [status, session]);
  console.log(session)

  if (status === "loading") return null;

  return (
    <div>
      <Stack direction="row" spacing={1} alignItems="center">
        <Avatar
          alt={session?.user?.username}
          src={session?.user?.image || "/default-avatar.png"}
          sx={{ width: 56, height: 56 }}
        />
        <Typography variant="h4">
          {session?.user?.username}
        </Typography>
      </Stack>

      <Divider sx={{ my: 2 }} />

      <Masonry columns={{ xs: 1, sm: 2, md: 3, lg: 4 }} spacing={2}>
        {video.map((v) => (
          <ProfileVideoCard key={v._id} video={v} />
        ))}
      </Masonry>
    </div>
  );
}

export default Profile;
