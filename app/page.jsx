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
        marginTop:"20%",
        width: "100%",
        height: "100%",
        overflow: "hidden",
      }}
    >
    
      <video
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: "absolute",
          paddingTop:"4.5%",
          width: "100%",
          height: "100%",
          objectFit: "cover",
          top: 0,
          left: 0,
          zIndex: -1,
        }}
        src= "/main-video.mp4"
      ></video>


      <Container
        maxWidth="md"
        sx={{
          position: "relative",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          color: "#fff",
          textShadow: "1px 1px 4px rgba(0,0,0,0.7)",
        }}
      >
        <Typography variant="h2" gutterBottom sx={{ fontWeight: "bold" }}>
          Welcome to AliReels
        </Typography>

        {session && (
          <Typography variant="h6" gutterBottom>
            Signed in as: {session.user?.email}
          </Typography>
        )}

        
        <Box sx={{ display: "flex", gap: 2, mt: 4, flexWrap: "wrap", justifyContent: "center" }}>
          {session ? (
            <>
              <Button
                variant="contained"
                color="error"
                onClick={() => signOut()}
                sx={{ px: 3, py: 1.5 }}
              >
                Sign Out
              </Button>

              <Link href="/video" passHref>
                <Button variant="contained" color="primary" sx={{ px: 3, py: 1.5 }}>
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
                sx={{ px: 3, py: 1.5 }}
              >
                Sign In
              </Button>
               <Link href="/register" passHref>
              <Button
                variant="outlined"
                color="secondary"
                sx={{ px: 3, py: 1.5 }}
              >
                Register
              </Button>
              </Link>

              <Link href="/login" passHref>
                <Button variant="contained" color="success" sx={{ px: 3, py: 1.5 }}>
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
