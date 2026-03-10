"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { TextField, Button, Box, Typography, Alert } from "@mui/material";

export default function VerifyPage() {
  const params = useSearchParams();
  const router = useRouter();

  // Decode email from URL
  const email = params.get("email") ? decodeURIComponent(params.get("email")) : null;

  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const verify = async () => {
    if (!email) {
      setError("Invalid verification link.");
      return;
    }

    if (!code) {
      setError("Enter the verification code");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Verification failed");
        return;
      }

      setSuccess("Email verified successfully! Redirecting to login...");

      setTimeout(() => {
        router.push("/login");
      }, 1500);

    } catch (err) {
      console.error("VERIFY ERROR:", err);
      setError("Verification failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 10 }}>
      <Typography variant="h5" mb={2}>Verify Your Email</Typography>

      {email ? (
        <Typography sx={{ mb: 2 }}>
          We sent a code to <strong>{email}</strong>
        </Typography>
      ) : (
        <Alert severity="error" sx={{ mb: 2 }}>Invalid verification link.</Alert>
      )}

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <TextField
        label="Verification Code"
        fullWidth
        value={code}
        onChange={(e) => setCode(e.target.value)}
        sx={{ mb: 2 }}
      />

      <Button
        variant="contained"
        fullWidth
        onClick={verify}
        disabled={loading || !email}
      >
        {loading ? "Verifying..." : "Verify"}
      </Button>
    </Box>
  );
}