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

    const fetchData = async () => {
      try {
        const followers = await getFollowers(profileUserId);
        setFollowersCount(followers.length);

        if (session?.user?.id) {
          const followed = followers.some(
            f => f.follower._id === session.user.id
          );
          setIsFollowing(followed);
        }

        const following = await getFollowing(profileUserId);
        setFollowingCount(following.length);

      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [profileUserId, session?.user?.id]);

  //  TOGGLE FOLLOW / UNFOLLOW
  const toggleFollow = async () => {
    if (!session?.user?.id) return;
    setLoading(true);

    try {
      const data = await followUser(profileUserId); 
      setIsFollowing(data.following);
      setFollowersCount(prev =>
        data.following ? prev + 1 : prev - 1
      );
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    isFollowing,
    followersCount,
    followingCount,
    toggleFollow,
    loading,
  };
}
