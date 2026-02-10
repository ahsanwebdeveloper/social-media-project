"use client";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import useFollow from "@/hooks/useFollow";

export default function FollowButton({ profileUserId }) {
  const { isFollowing, followersCount, handleFollow, loading, followingCount, toggleFollow } = useFollow(profileUserId);

  return (
    <Stack direction="row" spacing={2} alignItems="center">
      <Button
        variant={isFollowing ? "outlined" : "contained"}
        onClick={toggleFollow}
        disabled={loading}
        size="medium"
        sx={{
          borderRadius: "50px",            
          textTransform: "none",
          px: 3,
          bgcolor: isFollowing ? "transparent" : "#EA122A", 
          color: isFollowing ? "#EA122A" : "white",
          borderColor: "#EA122A",
          fontWeight: "bold",
          "&:hover": {
            bgcolor: isFollowing ? "#fceaea" : "#c3101f",
          },
        }}
      >
        {isFollowing ? "Following" : "Follow"}
      </Button>

      <Stack direction="row" spacing={1} alignItems="center">
        <Typography variant="body2" color="text.secondary">
          {followersCount} followers
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {followingCount} following
        </Typography>
      </Stack>
    </Stack>
  );
}
