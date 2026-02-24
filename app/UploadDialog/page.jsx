"use client";
import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Link from "next/link";

const UploadDialogPage = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      {/* Trigger Button */}
      <Button
        variant="contained"
        startIcon={<CloudUploadIcon />}
        sx={{
          bgcolor: "#E50031",
          "&:hover": { bgcolor: "#B0101F" },
        }}
        onClick={handleOpen}
      >
        Upload Video
      </Button>

      {/* Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
        <DialogTitle>Upload Options</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <Link href="/postsupload" passHref legacyBehavior>
              <Button
                variant="contained"
                fullWidth
                color="primary"
                onClick={handleClose} // close dialog on click
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
                onClick={handleClose} // close dialog on click
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
    </div>
  );
};

export default UploadDialogPage;