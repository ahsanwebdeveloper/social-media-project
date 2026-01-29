"use client";

import { useSession, signOut } from "next-auth/react";
import { Box, Button, IconButton } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import Link from "next/link";
import Image from "next/image";
import logo from "@/public/favicon.ico";
import { useColorMode } from "@/app/theme-provider"; 

export default function Header() {
  const { data: session, status } = useSession();
  const { toggleColorMode, mode } = useColorMode(); 

  if (status === "loading") return null;

  return (
    <header className="flex justify-between items-center p-4 border-b">

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 2,
          overflow: "hidden",
          border: "1px solid #e0e0e0",
        }}
      >
        <Image
          src={logo}
          alt="AliReels Logo"
          style={{
            objectFit: "contain",
            borderRadius: 8,
            width: 50,
            height: 50,
          }}
        />
      </Box>

    
      <div className="flex items-center gap-2">

        <IconButton onClick={toggleColorMode} color="inherit">
          {mode === "light" ? <Brightness4Icon /> : <Brightness7Icon />}
        </IconButton>

        {session ? (
          <>
            <p>{session.user?.email}</p>
            <Button variant="contained" onClick={() => signOut()}>
              Sign Out
            </Button>
            <Link href="/uploadfile" passHref>
              <Button
                variant="contained"
                startIcon={<CloudUploadIcon />}
                sx={{ textTransform: "none", borderRadius: 2 }}
              >
                Upload Video
              </Button>
            </Link>
          </>
        ) : (
          <>
            <Link href="/login" passHref>
              <Button variant="contained" sx={{ textTransform: "none", borderRadius: 2 }}>
                Login
              </Button>
            </Link>
            <Link href="/register" passHref>
              <Button variant="contained" sx={{ textTransform: "none", borderRadius: 2 }}>
                Register
              </Button>
            </Link>
            <Link href="/uploadfile" passHref>
              <Button
                variant="contained"
                startIcon={<CloudUploadIcon />}
                sx={{ textTransform: "none", borderRadius: 2 }}
              >
                Upload Video
              </Button>
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
