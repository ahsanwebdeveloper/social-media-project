"use client";
import { useEffect, useState } from "react";
import { toggleLike, getLikeCount, isLikedByMe } from "@/services/like.service";
import { useSession } from "next-auth/react";

export default function useLike(videoId) {
  const { data: session } = useSession();
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!videoId) return;

    const fetchLikes = async () => {
      try {
        const [{ count }, { liked }] = await Promise.all([
          getLikeCount(videoId),
          isLikedByMe(videoId),
        ]);

        setLikesCount(count);
        setLiked(liked);
      } catch (err) {
        console.error(err);
      }
    };

    fetchLikes();
  }, [videoId]);


  const handleLike = async () => {
    if (!session?.user?.id || loading) return;

    setLoading(true);

    // optimistic UI
    setLiked(prev => !prev);
    setLikesCount(prev => (liked ? prev - 1 : prev + 1));

    try {
      const data = await toggleLike(videoId);
      setLiked(data.liked);
    } catch (err) {
      // rollback
      setLiked(prev => !prev);
      setLikesCount(prev => (liked ? prev + 1 : prev - 1));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    liked,
    likesCount,
    handleLike,
    loading,
  };
}
