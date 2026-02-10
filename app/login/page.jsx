"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
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

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    mode: "onChange",
  });

  const watchEmail = watch("email", "");
  const watchPassword = watch("password", "");

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/");
    }
  }, [status, router]);

  const onSubmit = async (formData) => {
    setError("");
    setLoading(true);

    const res = await signIn("credentials", {
      redirect: false,
      email: formData.email,
      password: formData.password,
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
        width: "100%",
        minHeight: "50vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#F1F3F6",
      }}
    >
      <Box
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
            Welcome Back
          </Typography>
        </Box>

        {/* RIGHT SIDE */}
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{
            width: { xs: "100%", md: "50%" },
            p: 4,
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
            Login
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Typography variant="body2" fontWeight="bold" sx={{ mb: 0.5 }}>
            Email:
          </Typography>
          <TextField
            label="Email"
            fullWidth
            margin="dense"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Invalid email address",
              },
            })}
            error={!!errors.email}
            helperText={
              errors.email
                ? errors.email.message
                : watchEmail &&
                  !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(watchEmail)
                ? "Enter a valid email address"
                : ""
            }
          />

          <Typography
            variant="body2"
            fontWeight="bold"
            sx={{ mb: 0.5, mt: 1 }}
          >
            Password:
          </Typography>
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="dense"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
            })}
            error={!!errors.password}
            helperText={
              errors.password
                ? errors.password.message
                : watchPassword && watchPassword.length < 8
                ? "Password must be at least 8 characters"
                : ""
            }
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 3 }}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>

          <Typography variant="body2" textAlign="center" mt={2}>
            New here?{" "}
            <Button variant="text" onClick={() => router.push("/register")}>
              Register
            </Button>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
