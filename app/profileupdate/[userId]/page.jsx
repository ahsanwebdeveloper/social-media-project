"use client";
import { useEffect, useState } from "react";
import { Box, TextField, Button, Avatar, ButtonBase } from "@mui/material";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
export default function UpdateProfile() {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [imageFile, setImageFile] = useState(null); 
  const [avatarSrc, setAvatarSrc] = useState(""); 
  const { data: session } = useSession();
  const loggedInUserId = session?.user?.id; 
  const params = useParams();
  const userId = params.userId;

  // Fetch user data on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/users/${userId}`);
        const data = await res.json();
        if (!data) return;

        setUser(data);
        setUsername(data.username || "");
        setEmail(data.email || "");
        setAvatarSrc(data.image || ""); 
      } catch (err) {
        console.error("Fetch user error:", err);
      }
    };
    fetchUser();
  }, [userId]);

  // Convert File to Base64
  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  // Handle Avatar change
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);

    // Show preview
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => setAvatarSrc(reader.result);
  };

  const handleUpdate = async () => {
    if (!user) return;

    let base64Image;
    if (imageFile) {
      base64Image = await toBase64(imageFile);
    }

    const body = {
      userId,
      username,
      email,
      password: password || undefined,
      image: base64Image || undefined,
      loggedInUserId,
    };

    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      alert(data.message || data.error);
    } catch (err) {
      console.error("Update profile error:", err);
      alert("Error updating profile");
    }
  };

  if (!user) return <p>Loading...</p>;

  return (
    <Box display="flex" flexDirection="column" gap={2} maxWidth={400} mx="auto" mt={4}>
      <TextField label="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
      <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <TextField
        label="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
      />

      <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
        <ButtonBase component="label">
          <Avatar src={avatarSrc} sx={{ width: 80, height: 80 }} />
          <input type="file" accept="image/*" hidden onChange={handleAvatarChange} />
        </ButtonBase>
      </Box>

      <Button variant="contained" onClick={handleUpdate}>
        Update Profile
      </Button>
    </Box>
  );
}