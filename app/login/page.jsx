"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { Box, TextField, Button, Typography, Alert } from "@mui/material";

export default function LoginPage() {
  const router = useRouter();
  const { data: session, status } = useSession(); 

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
    setLoading(true);

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    setLoading(false);

    if (res?.error) {
      setError(res.error); 
      return;
    }

    router.replace("/"); 
  };

  if (status === "loading") {
    return <div>Loading...</div>; 
  }

  return (
    <Box
      sx={{
        minHeight: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ width: 350, p: 4, boxShadow: 3, borderRadius: 2 }}
      >
        <Typography variant="h5" mb={2} textAlign="center">
          Login
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <TextField
          label="Email"
          type="email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{ mt: 2 }}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </Button>
        <Typography variant="body2" textAlign="center" mt={2}>
          If you are new please register{" "}
          <Button variant="text" onClick={() => router.push("/register")}>
            Register
          </Button>
        </Typography>
      </Box>
    </Box>
  );
}
