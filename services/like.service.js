// services/like.service.js

export async function toggleLike(videoId, postId) {
  const res = await fetch("/api/like", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ videoId, postId }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Like failed");

  return data; // { liked: true | false }
}

export async function getLikeCount(videoId, postId) {
  const res = await fetch(
    `/api/like?videoId=${videoId || ""}&postId=${postId || ""}&type=count`
  );
  if (!res.ok) throw new Error("Failed to fetch like count");
  return res.json(); // { count }
}

export async function isLikedByMe(videoId, postId) {
  const res = await fetch(
    `/api/like?videoId=${videoId || ""}&postId=${postId || ""}&type=me`
  );
  if (!res.ok) throw new Error("Failed to check like status");
  return res.json(); // { liked: true | false }
}