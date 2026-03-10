"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { Box, TextField, Button, Typography, Alert } from "@mui/material";
import { useForm } from "react-hook-form";

export default function LoginPage() {
  const router = useRouter();
  const { status } = useSession();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, watch } = useForm({ mode: "onChange" });

  useEffect(() => {
    if (status === "authenticated") router.replace("/");
  }, [status, router]);

  const onSubmit = async (formData) => {
    setError(""); 
    setLoading(true);

    const res = await signIn("credentials", {
      redirect: false,
      email: formData.email,
      password: formData.password,
    });

    // Redirect unverified users to verify page
    if (res?.ok && res?.notVerified) {
      router.push(`/verify?email=${res.email}`);
      return;
    }

    if (res?.error) {
      setError(res.error);
      setLoading(false);
      return;
    }

    // login successful
    router.replace("/");
  };

  if (status === "loading") return <div>Loading...</div>;

  return (
    <Box sx={{ width: "100%", minHeight: "50vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Box sx={{ width: "100%", maxWidth: 900, display: "flex", borderRadius: 5, overflow: "hidden", boxShadow: 4, flexDirection: { xs: "column", md: "row" } }}>
        
        {/* LEFT SIDE */}
        <Box sx={{ width: { xs: "100%", md: "50%" }, bgcolor: "#E50031", color: "white", display: { xs: "none", md: "flex" }, alignItems: "center", justifyContent: "center", p: 4 }}>
          <Typography variant="h4" fontWeight="bold" textAlign="center">Welcome Back</Typography>
        </Box>

        {/* RIGHT SIDE */}
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ width: { xs: "100%", md: "50%" }, borderRadius: 5, p: 4, bgcolor: "background.paper" }}>
          <Typography variant="h5" mb={2} textAlign="center" fontWeight="bold" color="primary">Login</Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <TextField
            label="Email"
            fullWidth
            margin="dense"
            {...register("email", { required: "Email is required" })}
            error={!!errors.email}
            helperText={errors.email ? errors.email.message : ""}
          />

          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="dense"
            {...register("password", { required: "Password is required" })}
            error={!!errors.password}
            helperText={errors.password ? errors.password.message : ""}
            sx={{ mt: 1 }}
          />

          <Button type="submit" variant="contained" fullWidth sx={{ mt: 3 }} disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>

          <Typography variant="body2" textAlign="center" mt={2}>
            New here? <Button variant="text" onClick={() => router.push("/register")}>Register</Button>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}