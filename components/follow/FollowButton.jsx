"use client";
import Button from "@mui/material/Button";
import useFollow from "@/hooks/useFollow";

export default function FollowButton({ profileUserId }) {
  const { isFollowing, followersCount, handleFollow, loading, followingCount } = useFollow(profileUserId);

  return (
    <div>
      <Button
        variant={isFollowing ? "outlined" : "contained"}
        color="primary"
        disabled={loading}
        onClick={handleFollow}
      >
        {isFollowing ? "unFollow" : "Follow"}
      </Button>
      <span style={{ marginLeft: 8 }}>{followersCount} followers</span>
      <span style={{ marginLeft: 8 }}>{followingCount} following</span>
    </div>
  );
}
