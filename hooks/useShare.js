import { useState } from "react";
import { shareItem } from "../services/share.service";

export default function useShare(initialShares = 0, videoId, postId) {
  const [sharesCount, setSharesCount] = useState(Number(initialShares) || 0);

  const handleShare = async () => {
    if (!videoId && !postId) return;

    let url = "";

    if (videoId) {
      url = `${window.location.origin}/video/${videoId}`;
    } else if (postId) {
      url = `${window.location.origin}/post/${postId}`;
    }

    // Native share
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Check this out!",
          url,
        });
      } catch {
        return; // user cancelled
      }
    } else {
      await navigator.clipboard.writeText(url);
      alert("URL copied to clipboard!");
    }

    // Optimistic update
    setSharesCount(prev => prev + 1);

    try {
      const data = await shareItem(videoId, postId);
      if (!isNaN(Number(data.sharesCount))) {
        setSharesCount(Number(data.sharesCount));
      }
    } catch (err) {
      console.error(err);
      // rollback
      setSharesCount(prev => (prev > 0 ? prev - 1 : 0));
    }
  };

  return { sharesCount, handleShare };
}