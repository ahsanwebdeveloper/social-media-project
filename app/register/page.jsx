"use client";
import { useState ,useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { TextField, Button, Box, Typography, Alert, Avatar,  ButtonBase } from "@mui/material";
export default function Register() { 
  const router = useRouter();
  const { data: session, status } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username , setUsername] = useState("");
  const [avatarSrc, setAvatarSrc] = useState(undefined);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
useEffect(() => {
    if (status === "authenticated") {
      router.replace("/"); 
    }
  }, [status, router]);

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  if (password !== confirmPassword) {
    setError("Passwords do not match");
    return;
  }

  setLoading(true);

  try {
    const res = await fetch("/api/auth/register", { 
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        email, 
        password, 
        username, 
        image: avatarSrc 
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data?.error || "Registration failed");
      return;
    }

    router.push("/login");
  } catch (err) {
    console.error(err);
    setError("Registration failed");
  } finally {
    setLoading(false);
  }
};

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setAvatarSrc(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box component="form" onSubmit={handleSubmit} sx={{ width: 350, p: 4, boxShadow: 3, borderRadius: 2 }}>
        <Typography variant="h5" mb={2} textAlign="center">
          Register
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <TextField label="UserName" type="text" fullWidth margin="normal" value={username} onChange={(e) => setUsername(e.target.value)} required />
        <TextField label="Email" type="email" fullWidth margin="normal" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <TextField label="Password" type="password" fullWidth margin="normal" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <TextField label="Confirm Password" type="password" fullWidth margin="normal" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
          <ButtonBase
      component="label"
      role={undefined}
      tabIndex={-1} 
      aria-label="Avatar image"
      sx={{
        borderRadius: '40px',
        '&:has(:focus-visible)': {
          outline: '2px solid',
          outlineOffset: '2px',
        },
      }}
    >
      <Avatar alt="Upload new avatar" src={avatarSrc} />
      <input
        type="file"
        accept="image/*"
        style={{
          border: 0,
          clip: 'rect(0 0 0 0)',
          height: '1px',
          margin: '-1px',
          overflow: 'hidden',
          padding: 0,
          position: 'absolute',
          whiteSpace: 'nowrap',
          width: '1px',
        }}
        onChange={handleAvatarChange}
      />
    </ButtonBase>

        <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }} disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </Button>

        <Typography variant="body2" textAlign="center" mt={2}>
          Already have an account? <Button variant="text" onClick={() => router.push("/login")}>Login</Button>
        </Typography>
      </Box>
    </Box>
  );
}
