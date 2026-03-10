"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  Avatar,
  ButtonBase,
} from "@mui/material";
import { useForm } from "react-hook-form";

export default function Register() {
  const router = useRouter();
  const { status } = useSession();
  const [avatarSrc, setAvatarSrc] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({ mode: "onChange" });

  const watchPassword = watch("password", "");
  const watchConfirmPassword = watch("confirmPassword", "");
  const watchEmail = watch("email", "");
  const watchUsername = watch("username", "");
  const passwordsMatch = watchPassword === watchConfirmPassword;

  //  If user is already logged in, redirect to home
  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/");
    }
  }, [status, router]);

  // Register page onSubmit
  const onSubmit = async (formData) => {
    setError("");
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          username: formData.username,
          image: avatarSrc,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error || "Registration failed");
        return;
      }

      //  Success: redirect to verify page directly
      setSuccess("Registration successful! Redirecting to email verification...");
      setTimeout(() => {
      router.push(`/verify?email=${formData.email}`);
      }, 1000);

    } catch (err) {
      console.error("REGISTER ERROR:", err);
      setError("Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setAvatarSrc(reader.result);
    reader.readAsDataURL(file);
  };

  return (
    <Box sx={{ width: "100%", minHeight: "50vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{ width: "100%", maxWidth: 900, display: "flex", borderRadius: 5, overflow: "hidden", boxShadow: 4, bgcolor: "#E50031", flexDirection: { xs: "column", md: "row" } }}
      >
        {/* LEFT SIDE */}
        <Box sx={{ width: { xs: "100%", md: "50%" }, bgcolor: "#E50031", color: "white", display: { xs: "none", md: "flex" }, alignItems: "center", justifyContent: "center", p: 4 }}>
          <Typography variant="h4" fontWeight="bold" textAlign="center">
            Welcome to Register Form
          </Typography>
        </Box>

        {/* RIGHT SIDE */}
        <Box sx={{ width: { xs: "100%", md: "50%" }, p: 4, borderRadius: 5, bgcolor: "background.paper" }}>
          <Typography variant="h5" mb={2} textAlign="center" fontWeight="bold" color="primary">
            Register
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

          <Typography variant="body2" fontWeight="bold" sx={{ mb: 0.5 }}>Username:</Typography>
          <TextField
            label="Username"
            fullWidth
            margin="dense"
            {...register("username", { required: "Username is required", minLength: { value: 5, message: "Username must be at least 5 characters" } })}
            error={!!errors.username}
            helperText={errors.username ? errors.username.message : watchUsername && watchUsername.length < 5 ? "Username must be at least 5 characters" : ""}
          />

          <Typography variant="body2" fontWeight="bold" sx={{ mb: 0.5 }}>Email:</Typography>
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            {...register("email", { required: "Email is required", pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email address" } })}
            error={!!errors.email}
            helperText={errors.email ? errors.email.message : watchEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(watchEmail) ? "Enter a valid email address" : ""}
          />

          <Typography variant="body2" fontWeight="bold" sx={{ mb: 0.5 }}>Password:</Typography>
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            {...register("password", { required: "Password is required", minLength: { value: 8, message: "Password must be at least 8 characters" } })}
            error={!!errors.password}
            helperText={errors.password ? errors.password.message : watchPassword && watchPassword.length < 8 ? "Password must be at least 8 characters" : ""}
          />

          <Typography variant="body2" fontWeight="bold" sx={{ mb: 0.5 }}>Confirm password:</Typography>
          <TextField
            label="Confirm Password"
            type="password"
            fullWidth
            margin="normal"
            {...register("confirmPassword", { required: "Confirm Password is required", validate: (value) => value === watchPassword || "Passwords do not match" })}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword ? errors.confirmPassword.message : watchConfirmPassword && !passwordsMatch ? "Passwords do not match" : ""}
          />

          <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
            <ButtonBase component="label">
              <Avatar src={avatarSrc || ""} sx={{ width: 80, height: 80 }} />
              <input type="file" accept="image/*" hidden onChange={handleAvatarChange} />
            </ButtonBase>
          </Box>

          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }} disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </Button>

          <Typography variant="body2" textAlign="center" mt={2}>
            Already have an account?{" "}
            <Button variant="text" onClick={() => router.push("/login")}>
              Login
            </Button>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}