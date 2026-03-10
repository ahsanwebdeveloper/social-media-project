"use client";
import { useEffect, useState } from "react";
import { Stack, Avatar, Typography, Button } from "@mui/material";
import useFollow from "@/hooks/useFollow"; 
import { getFollowers } from "@/services/follow.service"; 

export default function FollowerList({ userId }) {
  const [followers, setFollowers] = useState([]);

  useEffect(() => {
    const fetchFollowers = async () => {
      try {
        const data = await getFollowers(userId); 
        setFollowers(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchFollowers();
  }, [userId]);

  return (
    <Stack spacing={1}>
      {followers.map((f) => {
        const { isFollowing, toggleFollow, loading } = useFollow(f.follower._id);

        return (
          <Stack
            key={f._id}
            direction="row"
            spacing={2}
            alignItems="center"
            justifyContent="space-between"
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <Avatar src={f.follower.image || "/default-avatar.png"} />
              <Typography>@{f.follower.username}</Typography>
            </Stack>
            <Button
              size="small"
              variant={isFollowing ? "outlined" : "contained"}
              onClick={toggleFollow}
              disabled={loading}
            >
              {isFollowing ? "Following" : "Follow"}
            </Button>
          </Stack>
        );
      })}
    </Stack>
  );
}
