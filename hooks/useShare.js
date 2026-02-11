import { useState, useEffect } from "react";
import { shareVideo } from "../services/share.service";

export default function useShare(initialShares = 0, videoId) {
  const [sharesCount, setSharesCount] = useState(Number(initialShares) || 0);

  const handleShare = async () => {
    if (!videoId) return;

    const url = `${window.location.origin}/vide/${videoId}`;

    // Native share
    if (navigator.share) {
      try {
        await navigator.share({ title: "Check out this video!", url });
      } catch {
        return; // user canceled
      }
    } else {
      // fallback
      await navigator.clipboard.writeText(url);
      alert("Video URL copied to clipboard!");
    }

    // Optimistic update
    setSharesCount((prev) => prev + 1);

    // Backend update
    try {
      const data = await shareVideo(videoId);
      const backendCount = Number(data.sharesCount);
      if (!isNaN(backendCount)) setSharesCount(backendCount);
    } catch (err) {
      console.error(err);
      // rollback
      setSharesCount((prev) => (prev > 0 ? prev - 1 : 0));
    }
  };

  return { sharesCount, handleShare };
}
