"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import { Box, Button, Typography, Container } from "@mui/material";
import Link from "next/link";

export default function Home() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <Typography variant="h6" align="center" sx={{ mt: 10 }}>
        Loading...
      </Typography>
    );
  }

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
    
        overflow: "hidden",
      }}
    >
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover", // covers whole screen without stretching
          zIndex: -1,
        }}
        src="/main-video.mp4"
      />

      {/* Overlay Container */}
      <Container
        maxWidth="md"
        sx={{
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          color: "#fff",
          textShadow: "1px 1px 6px rgba(0,0,0,0.7)",
          px: { xs: 2, sm: 4 },
        }}
      >
        <Typography
          variant="h3"
          gutterBottom
          sx={{
            fontWeight: "bold",
            fontSize: { xs: "2rem", sm: "3rem", md: "4rem" },
          }}
        >
          Welcome to AliReels
        </Typography>

        {session && (
          <Typography
            variant="h6"
            gutterBottom
            sx={{ fontSize: { xs: 14, sm: 16, md: 18 } }}
          >
            Signed in as: {session.user?.email}
          </Typography>
        )}

        <Box
          sx={{
            display: "flex",
            gap: 2,
            mt: 4,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {session ? (
            <>
              <Button
                variant="contained"
                color="error"
                onClick={() => signOut()}
                sx={{ px: 3, py: 1.5, minWidth: 120 }}
              >
                Sign Out
              </Button>

              <Link href="/video" passHref>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ px: 3, py: 1.5, minWidth: 120 }}
                >
                  Get Started
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Button
                variant="contained"
                color="primary"
                onClick={() => signIn()}
                sx={{ px: 3, py: 1.5, minWidth: 120 }}
              >
                Sign In
              </Button>

              <Link href="/register" passHref>
                <Button
                  variant="outlined"
                  color="secondary"
                  sx={{ px: 3, py: 1.5, minWidth: 120 }}
                >
                  Register
                </Button>
              </Link>

              <Link href="/login" passHref>
                <Button
                  variant="contained"
                  color="success"
                  sx={{ px: 3, py: 1.5, minWidth: 120 }}
                >
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </Box>
      </Container>
    </Box>
  );
}
