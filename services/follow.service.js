// services/follow.service.js
export async function followUser(targetUserId) {
  try {
    const res = await fetch("/api/follows", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ targetUserId }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to follow user");
    return data; 
  } catch (err) {
    console.error("Follow service error:", err);
    throw err;
  }
}

export async function getFollowers(userId) {
  const res = await fetch(`/api/follows?userId=${userId}&type=followers`);
  if (!res.ok) throw new Error("Failed to fetch followers");
  return res.json();
}

export async function getFollowing(userId) {
  const res = await fetch(`/api/follows?userId=${userId}&type=following`);
  if (!res.ok) throw new Error("Failed to fetch following");
  return res.json();
}
