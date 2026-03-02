"use client";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { AppBar, Toolbar, IconButton, Typography, Button, Drawer, Box, List, ListItem, ListItemText, Avatar, Stack, Divider,Dialog,DialogTitle,DialogContent,DialogActions } from "@mui/material";
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
   const [openDialog, setOpenDialog] = useState(false);

  const handleOpen = () => setOpenDialog(true);
  const handleClose = () => setOpenDialog(false);

  if (status === "loading") return null;

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawerWidth = 240;

  const drawer = (
    <Box sx={{ width: drawerWidth, borderRadius:2 }} role="presentation" onClick={handleDrawerToggle}>
      <Box sx={{ p: 2, display: "flex", alignItems: "center", gap: 1, bgcolor: "#1D4ED8", color: "white", borderRadius: 2 }}>
        <Image src={logo} alt="AliReels Logo" width={40} height={40} style={{ borderRadius: 8 }} />
        <Typography variant="h6" noWrap>AliReels</Typography>
      </Box>
      <Divider />
      <List>
        {session ? (
          <>
            <ListItem button component={Link} href={`/profile/${session.user.id}`} sx={{ bgcolor: "#E50031", "&:hover": { bgcolor: "#B0101F", cursor: "pointer" , borderRadius: 2},borderRadius: 2 }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Avatar src={session.user.image || "/default-avatar.png"} />
                <Typography sx={{color:"white"}}>@{session.user.username}</Typography>
              </Stack>
            </ListItem>
              <Divider/>
            <ListItem button onClick={() => signOut()} sx={{ bgcolor: "#E50031", "&:hover": { bgcolor: "#B0101F", cursor: "pointer" , borderRadius: 2},borderRadius: 2 }}>
              <ListItemText primary="Sign Out" sx={{color:"white"}} />
            </ListItem>
            <Divider/>
            <ListItem button onClick={handleOpen}  sx={{ bgcolor: "#E50031", "&:hover": { bgcolor: "#B0101F", cursor: "pointer" , borderRadius: 2},borderRadius: 2 }}>
        <CloudUploadIcon sx={{ mr: 1, color:"white" }} />
        <ListItemText primary="Upload Video" sx={{color:"white"}} />
      </ListItem>
      <Divider/>
       <Box sx={{ display: { xs: "flex", md: "none" }, alignItems: "center", gap: 1 , bgcolor: "#E50031", p: 1, borderRadius: 2, justifyContent: "center" ,"&:hover":{bgcolor: "#B0101F", cursor: "pointer", borderRadius: 2} }}>
            <IconButton onClick={toggleColorMode} sx={{ color: "white" }}>
              {mode === "light" ? <Brightness4Icon /> : <Brightness7Icon />}
            </IconButton>
          </Box>

      {/* Dialog */}
      <Dialog open={openDialog} onClose={handleClose} maxWidth="xs" fullWidth>
        <DialogTitle>Upload Options</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <Link href="/postsupload" passHref legacyBehavior>
              <Button
                variant="contained"
                fullWidth
                color="primary"
                onClick={handleClose}
              >
                Upload Post
              </Button>
            </Link>

            <Link href="/uploadfile" passHref legacyBehavior>
              <Button
                variant="contained"
                fullWidth
                color="secondary"
                sx={{ bgcolor: "#E50031", "&:hover": { bgcolor: "#B0101F" } }}
                onClick={handleClose}
              >
                Upload Video
              </Button>
            </Link>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="inherit">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
          
        ) : (
          <>
            <ListItem button component={Link} href="/login" sx={{ bgcolor: "#E50031", "&:hover": { bgcolor: "#B0101F", cursor: "pointer" , borderRadius: 2},borderRadius: 2 }}>
              <ListItemText primary="Login" sx={{color:"white"}} />
            </ListItem>
            <Divider/>
            <ListItem button component={Link} href="/register" sx={{ bgcolor: "#E50031", "&:hover": { bgcolor: "#B0101F", cursor: "pointer" , borderRadius: 2},borderRadius: 2 }}>
              <ListItemText primary="Register" sx={{color:"white"}}/>
            </ListItem>
              <Divider/>
            <ListItem button onClick={handleOpen}  sx={{ bgcolor: "#E50031", "&:hover": { bgcolor: "#B0101F", cursor: "pointer" , borderRadius: 2},borderRadius: 2 }}>
        <CloudUploadIcon sx={{ mr: 1 , color: "white" }} />
        <ListItemText primary="Upload Video" sx={{color:"white"}} />
      </ListItem>
      <Divider/>
      
      
      {/* Dialog */}
      <Dialog open={openDialog} onClose={handleClose} maxWidth="xs" fullWidth>
        <DialogTitle>Upload Options</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <Link href="/postsupload" passHref legacyBehavior>
              <Button
                variant="contained"
                fullWidth
                color="primary"
                onClick={handleClose}
              >
                Upload Post
              </Button>
            </Link>

            <Link href="/uploadfile" passHref legacyBehavior>
              <Button
                variant="contained"
                fullWidth
                color="secondary"
                sx={{ bgcolor: "#E50031", "&:hover": { bgcolor: "#B0101F", color: "white" } }}
                onClick={handleClose}
              >
                Upload Video
              </Button>
            </Link>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="inherit">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
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
                <Button variant="contained" onClick={() => signOut()} sx={{ bgcolor: "#E50031", color:"white", "&:hover": { bgcolor: "#B0101F", cursor: "pointer" , borderRadius: 2},borderRadius: 2 }}>
                  Sign Out
                </Button>
                 <Button
      variant="contained"
      startIcon={<CloudUploadIcon  sx={{color:"white"}}/>}
      sx={{ bgcolor: "#E50031", color:"white", "&:hover": { bgcolor: "#B0101F", borderRadius: 2},borderRadius: 2 }}
      onClick={handleOpen} 
    >
      Upload Video
    </Button>

    {/* Upload Dialog */}
    <Dialog open={openDialog} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>Upload Options</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <Link href="/postsupload" passHref legacyBehavior>
            <Button
              variant="contained"
              fullWidth
              color="primary"
              onClick={handleClose}
              sx={{color:"white"}}
            >
              Upload Post
            </Button>
          </Link>

          <Link href="/uploadfile" passHref legacyBehavior>
            <Button
              variant="contained"
              fullWidth
              color="secondary"
              sx={{ bgcolor: "#E50031", color: "white", "&:hover": { bgcolor: "#B0101F" } }}
              onClick={handleClose}
            >
              Upload Video
            </Button>
          </Link>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="inherit">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
              </>
            ) : (
              <>
                <Link href="/login" passHref>
                  <Button variant="contained" sx={{ bgcolor: "#E50031", color:"white", "&:hover": { bgcolor: "#B0101F" } }}>
                    Login
                  </Button>
                </Link>
                <Link href="/register" passHref>
                  <Button variant="contained" sx={{ bgcolor: "#E50031", color:"white", "&:hover": { bgcolor: "#B0101F" } }}>
                    Register
                  </Button>
                </Link>
                <Link href="/UploadDialog" passHref>
                  <Button variant="contained" startIcon={<CloudUploadIcon  sx={{color:"white"}}/>} sx={{ bgcolor: "#E50031", color:"white", "&:hover": { bgcolor: "#B0101F" } }}>
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
