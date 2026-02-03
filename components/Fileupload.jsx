"use client";
import { useRef, useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Paper,
  CircularProgress,
  Alert,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { uploadToCloudinary } from "@/lib/cloudinaryUpload";

export default function FileUpload({ onSuccess }) {
  const videoInputRef = useRef(null);
  const thumbInputRef = useRef(null);

  const [video, setVideo] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleUpload = async () => {
    console.log({ video, thumbnail, title, description });

    if (!video || !thumbnail || !title || !description) {
      setError("All fields are required");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const videoRes = await uploadToCloudinary(video, "video");
      const thumbRes = await uploadToCloudinary(thumbnail, "image");

      const res = await fetch("/api/videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          videoUrl: videoRes.secure_url,
          thumbnailUrl: thumbRes.secure_url,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      onSuccess(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={4} sx={{ maxWidth: 500, mx: "auto", p: 4 }}>
      <Typography variant="h5" mb={2} textAlign="center">
        Upload Video
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <TextField
        label="Title"
        fullWidth
        sx={{ mb: 2 }}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <TextField
        label="Description"
        fullWidth
        multiline
        rows={3}
        sx={{ mb: 2 }}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <input
        ref={videoInputRef}
        type="file"
        accept="video/*"
        hidden
        onChange={(e) => setVideo(e.target.files[0])}
      />

      <Button
        variant="outlined"
        fullWidth
        onClick={() => videoInputRef.current.click()}
      >
        Select Video
      </Button>

      {video && <Typography variant="caption"> {video.name}</Typography>}

      <input
        ref={thumbInputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => setThumbnail(e.target.files[0])}
      />

      <Button
        variant="outlined"
        fullWidth
        sx={{ mt: 2 }}
        onClick={() => thumbInputRef.current.click()}
      >
        Select Thumbnail
      </Button>

      {thumbnail && <Typography variant="caption"> {thumbnail.name}</Typography>}

      <Button
        variant="contained"
        fullWidth
        sx={{ mt: 3 }}
        onClick={handleUpload}
        disabled={loading}
        startIcon={
          loading ? <CircularProgress size={20} /> : <CloudUploadIcon />
        }
      >
        {loading ? "Uploading..." : "Upload"}
      </Button>
    </Paper>
  );
}
