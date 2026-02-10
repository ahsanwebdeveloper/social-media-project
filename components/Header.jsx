"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { AppBar, Toolbar, IconButton, Typography, Button, Drawer, Box, List, ListItem, ListItemText, Avatar, Stack, Divider } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
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
  const [mobileOpen, setMobileOpen] = useState(false);

  if (status === "loading") return null;

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawerWidth = 240;

  const drawer = (
    <Box sx={{ width: drawerWidth }} role="presentation" onClick={handleDrawerToggle}>
      <Box sx={{ p: 2, display: "flex", alignItems: "center", gap: 1 }}>
        <Image src={logo} alt="AliReels Logo" width={40} height={40} style={{ borderRadius: 8 }} />
        <Typography variant="h6" noWrap>AliReels</Typography>
      </Box>
      <Divider />
      <List>
        {session ? (
          <>
            <ListItem button component={Link} href={`/profile/${session.user.id}`}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Avatar src={session.user.image || "/default-avatar.png"} />
                <Typography>@{session.user.username}</Typography>
              </Stack>
            </ListItem>
            <ListItem button onClick={() => signOut()}>
              <ListItemText primary="Sign Out" />
            </ListItem>
            <ListItem button component={Link} href="/uploadfile">
              <CloudUploadIcon sx={{ mr: 1 }} />
              <ListItemText primary="Upload Video" />
            </ListItem>
          </>
        ) : (
          <>
            <ListItem button component={Link} href="/login">
              <ListItemText primary="Login" />
            </ListItem>
            <ListItem button component={Link} href="/register">
              <ListItemText primary="Register" />
            </ListItem>
            <ListItem button component={Link} href="/uploadfile">
              <CloudUploadIcon sx={{ mr: 1 }} />
              <ListItemText primary="Upload Video" />
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="static" sx={{ bgcolor: "#1D4ED8" }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          {/* Logo */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Image src={logo} alt="AliReels Logo" width={40} height={40} style={{ borderRadius: 8 }} />
            <Typography variant="h6" sx={{ color: "#E50031", fontWeight: "bold" }}>
              AliReels
            </Typography>
          </Box>

          <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 1 }}>
            <IconButton onClick={toggleColorMode} sx={{ color: "white" }}>
              {mode === "light" ? <Brightness4Icon /> : <Brightness7Icon />}
            </IconButton>

            {session ? (
              <>
                <Link href={`/profile/${session.user.id}`} style={{ textDecoration: "none", color: "white" }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Avatar src={session.user.image || "/default-avatar.png"} sx={{ width: 35, height: 35 }} />
                    <Typography>@{session.user.username}</Typography>
                  </Stack>
                </Link>
                <Button variant="contained" color="error" onClick={() => signOut()}>
                  Sign Out
                </Button>
                <Link href="/uploadfile" passHref>
                  <Button variant="contained" startIcon={<CloudUploadIcon />} sx={{ bgcolor: "#E50031", "&:hover": { bgcolor: "#B0101F" } }}>
                    Upload Video
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/login" passHref>
                  <Button variant="contained" sx={{ bgcolor: "#E50031", "&:hover": { bgcolor: "#B0101F" } }}>
                    Login
                  </Button>
                </Link>
                <Link href="/register" passHref>
                  <Button variant="contained" sx={{ bgcolor: "#E50031", "&:hover": { bgcolor: "#B0101F" } }}>
                    Register
                  </Button>
                </Link>
                <Link href="/uploadfile" passHref>
                  <Button variant="contained" startIcon={<CloudUploadIcon />} sx={{ bgcolor: "#E50031", "&:hover": { bgcolor: "#B0101F" } }}>
                    Upload Video
                  </Button>
                </Link>
              </>
            )}
          </Box>

          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="end"
            onClick={handleDrawerToggle}
            sx={{ display: { md: "none" } }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer anchor="left" open={mobileOpen} onClose={handleDrawerToggle}>
        {drawer}
      </Drawer>
    </>
  );
}
