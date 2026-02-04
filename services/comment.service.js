export async function getComments(videoId) {
  const res = await fetch(`/api/comments?videoId=${videoId}`);
  if (!res.ok) throw new Error("Failed to fetch comments");
  return res.json();
}

export async function addComment(videoId, content, parentComment = null) {
  const res = await fetch("/api/comments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ videoId, content, parentComment }),
  });

  if (!res.ok) throw new Error("Failed to add comment");
  return res.json();
}

export async function deleteComment(commentId) {
  const res = await fetch(`/api/comments/${commentId}`, {
    method: "DELETE",
  });

  if (!res.ok) throw new Error("Failed to delete comment");
  return res.json();
}
