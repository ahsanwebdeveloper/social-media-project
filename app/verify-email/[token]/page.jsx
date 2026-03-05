"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function VerifyEmailPage() {
  const router = useRouter();
  const { token } = router.query;
  const [message, setMessage] = useState("Verifying...");

  useEffect(() => {
    if (!token) return;

    fetch(`/api/auth/verify-email?token=${token}`)
      .then(res => {
        if (res.redirected) {
          window.location.href = res.url; // redirect to login
        }
        return res.json().catch(() => ({}));
      })
      .then(data => {
        if (data.success) {
          setMessage("Email verified! You can now login.");
        } else if (data.error) {
          setMessage(data.error);
        }
      })
      .catch(() => setMessage("Something went wrong."));
  }, [token]);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>{message}</h1>
      {message.includes("verified") && <a href="/login">Go to Login</a>}
    </div>
  );
}