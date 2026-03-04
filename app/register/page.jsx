"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
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
  const [avatarSrc, setAvatarSrc] = useState(undefined);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({ mode: "onChange" });

  const watchpassword = watch("password", "");
  const watchconfirmPassword = watch("confirmPassword", "");
  const passwordsMatch = watchpassword === watchconfirmPassword;
  const watchEmail = watch("email", "");
  const watchUsername = watch("username", "");

  useEffect(() => {
    if (status === "authenticated") router.replace("/");
  }, [status, router]);

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setAvatarSrc(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (formData) => {
    setError("");
    setSuccess("");
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      // 1️⃣ Register user in DB
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
        setLoading(false);
        return;
      }

      // 2️⃣ Auto send Magic Link
      const magicRes = await signIn("email", {
        redirect: false,
        email: formData.email,
      });

      if (magicRes?.error) {
        setError(magicRes.error);
        setLoading(false);
        return;
      }

      setSuccess("Registration successful! Check your email for Magic Link.");
    } catch (err) {
      console.error(err);
      setError("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "50vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          width: "100%",
          maxWidth: 900,
          display: "flex",
          borderRadius: 5,
          overflow: "hidden",
          boxShadow: 4,
          flexDirection: { xs: "column", md: "row" },
        }}
      >
        {/* LEFT SIDE */}
        <Box
          sx={{
            width: { xs: "100%", md: "50%" },
            bgcolor: "#E50031",
            color: "white",
            display: { xs: "none", md: "flex" },
            alignItems: "center",
            justifyContent: "center",
            p: 4,
          }}
        >
          <Typography variant="h4" fontWeight="bold" textAlign="center">
            Welcome to Register
          </Typography>
        </Box>

        {/* RIGHT SIDE */}
        <Box
          sx={{
            width: { xs: "100%", md: "50%" },
            p: 4,
            borderRadius: 5,
            bgcolor: "background.paper",
          }}
        >
          <Typography
            variant="h5"
            mb={2}
            textAlign="center"
            fontWeight="bold"
            color="primary"
          >
            Register
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          <TextField
            label="Username"
            fullWidth
            margin="dense"
            {...register("username", {
              required: "Username is required",
              minLength: { value: 5, message: "Username must be at least 5 characters" },
            })}
            error={!!errors.username}
            helperText={errors.username ? errors.username.message : ""}
          />

          <TextField
            label="Email"
            fullWidth
            margin="normal"
            {...register("email", {
              required: "Email is required",
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email" },
            })}
            error={!!errors.email}
            helperText={errors.email ? errors.email.message : ""}
          />

          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            {...register("password", {
              required: "Password required",
              minLength: { value: 8, message: "Password must be at least 8 characters" },
            })}
            error={!!errors.password}
            helperText={errors.password ? errors.password.message : ""}
          />

          <TextField
            label="Confirm Password"
            type="password"
            fullWidth
            margin="normal"
            {...register("confirmPassword", {
              required: "Confirm password required",
              validate: (value) => value === watchpassword || "Passwords do not match",
            })}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword ? errors.confirmPassword.message : ""}
          />

          {/* Avatar Upload */}
          <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
            <ButtonBase component="label">
              <Avatar src={avatarSrc} sx={{ width: 80, height: 80 }} />
              <input type="file" accept="image/*" hidden onChange={handleAvatarChange} />
            </ButtonBase>
          </Box>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 2 }}
            disabled={loading}
          >
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