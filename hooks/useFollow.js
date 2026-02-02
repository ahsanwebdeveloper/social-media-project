"use client";
import { useState, useEffect } from "react";
import { followUser, getFollowers, getFollowing } from "@/services/follow.service";
import { useSession } from "next-auth/react";

export default function useFollow(profileUserId) {
  const { data: session } = useSession();
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!profileUserId) return;

    const fetchFollowData = async () => {
      try {
        // Get all followers
        const followers = await getFollowers(profileUserId);
        setFollowersCount(followers.length);

        // Check if logged-in user is following this profile
        if (session?.user?.id) {
          const following = followers.some(f => f.follower._id === session.user.id);
          setIsFollowing(following);
        }

        //  fetch how many users this profile is following
        const followingUsers = await getFollowing(profileUserId);
        setFollowingCount(followingUsers.length);

      } catch (err) {
        console.error("Error fetching follow data:", err);
      }
    };

    fetchFollowData();
  }, [profileUserId, session?.user?.id]);

  const toggleFollow = async () => {
    if (!session?.user?.id) return;
    setLoading(true);

    try {
      const data = await followUser(profileUserId); // Backend toggles follow/unfollow

      setIsFollowing(data.following);

      // Update followers count based on backend response
      setFollowersCount(prev => (data.following ? prev + 1 : prev - 1));

    } catch (err) {
      console.error("Toggle follow error:", err);
    } finally {
      setLoading(false);
    }
  };

  return { isFollowing, followersCount, followingCount, toggleFollow, loading };
}
