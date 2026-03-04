"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
} from "@mui/material";
import { useForm } from "react-hook-form";

export default function LoginPage() {
  const router = useRouter();
  const { status } = useSession();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [magicSent, setMagicSent] = useState("");

  const { register, handleSubmit, watch, formState: { errors } } = useForm({ mode: "onChange" });
  const watchEmail = watch("email", "");
  const watchPassword = watch("password", "");

  useEffect(() => {
    if (status === "authenticated") router.replace("/");
  }, [status, router]);

  const handleCredentials = async (formData) => {
    setError("");
    setLoading(true);

    const res = await signIn("credentials", {
      redirect: false,
      email: formData.email,
      password: formData.password,
    });

    setLoading(false);

    if (res?.error) setError(res.error);
    else router.replace("/");
  };

  const handleMagicLink = async () => {
    setError("");
    setMagicSent("");
    setLoading(true);

    const res = await signIn("email", { redirect: false, email: watchEmail });

    setLoading(false);

    if (res?.error) setError(res.error);
    else setMagicSent("Magic Link sent! Check your email.");
  };

  if (status === "loading") return <div>Loading...</div>;

  return (
    <Box sx={{ width: "100%", minHeight: "50vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Box sx={{ width: "100%", maxWidth: 900, display: "flex", borderRadius: 5, overflow: "hidden", boxShadow: 4, flexDirection: { xs: "column", md: "row" } }}>
        {/* LEFT */}
        <Box sx={{ width: { xs: "100%", md: "50%" }, bgcolor: "#E50031", color: "white", display: { xs: "none", md: "flex" }, alignItems: "center", justifyContent: "center", p: 4 }}>
          <Typography variant="h4" fontWeight="bold" textAlign="center">Welcome Back</Typography>
        </Box>

        {/* RIGHT */}
        <Box component="form" onSubmit={handleSubmit(handleCredentials)} sx={{ width: { xs: "100%", md: "50%" }, borderRadius: 5, p: 4, bgcolor: "background.paper" }}>
          <Typography variant="h5" mb={2} textAlign="center" fontWeight="bold" color="primary">Login</Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {magicSent && <Alert severity="success" sx={{ mb: 2 }}>{magicSent}</Alert>}

          <TextField
            label="Email"
            fullWidth
            margin="dense"
            {...register("email", { required: "Email is required", pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email" } })}
            error={!!errors.email}
            helperText={errors.email ? errors.email.message : ""}
          />

          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="dense"
            {...register("password", { required: "Password is required", minLength: { value: 8, message: "Password must be at least 8 characters" } })}
            error={!!errors.password}
            helperText={errors.password ? errors.password.message : ""}
          />

          <Button type="submit" variant="contained" fullWidth sx={{ mt: 3 }} disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>

          {/* Magic Link button */}
          <Button variant="outlined" fullWidth sx={{ mt: 2 }} onClick={handleMagicLink} disabled={!watchEmail || loading}>
            Send Magic Link
          </Button>

          <Typography variant="body2" textAlign="center" mt={2}>
            New here? <Button variant="text" onClick={() => router.push("/register")}>Register</Button>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}