export async function shareItem(videoId, postId) {
  const res = await fetch("/api/share", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ videoId, postId }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to share");

  return data;
}