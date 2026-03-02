"use client";
import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  IconButton,
  Grid,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import DeleteIcon from "@mui/icons-material/Delete";
import { useForm, useFieldArray } from "react-hook-form";
import { uploadToCloudinary } from "@/lib/cloudinaryUpload";

const CreatePostForm = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      images: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "images",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle Image Selection
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length + fields.length > 4) {
      alert("You can upload maximum 4 images");
      return;
    }

    files.forEach((file) => {
      const previewUrl = URL.createObjectURL(file);

      append({
        file,
        url: previewUrl,
        caption: "",
      });
    });
  };

  const onSubmit = async (data) => {
    if (fields.length === 0) {
      setError("At least one image is required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const uploadedImages = [];

      for (let i = 0; i < data.images.length; i++) {
        const img = data.images[i];
        const uploadRes = await uploadToCloudinary(img.file, "image");

        uploadedImages.push({
          url: uploadRes.secure_url,
          caption: img.caption || "",
        });
      }

      const postData = {
        title: data.title,
        description: data.description,
        images: uploadedImages,
        postUrl: "",
      };

      const res = await fetch("/api/posts", {
        method: "POST",
        body: JSON.stringify(postData),
        headers: { "Content-Type": "application/json" },
      });

      const result = await res.json();

      if (!res.ok) {
        setError(result.message || "Upload failed");
      } else {
        alert("Post uploaded successfully ✅");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong while uploading images");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        maxWidth: 600,
        mx: "auto",
        mt: 4,
        p: 3,
        borderRadius: 3,
        boxShadow: 3,
        bgcolor: theme.palette.background.paper,
        color: theme.palette.text.primary,
      }}
    >
      <Typography variant="h5" mb={2}>
        Create Post
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Title */}
      <TextField
        fullWidth
        label="Title"
        margin="normal"
        {...register("title", { required: "Title is required" })}
        error={!!errors.title}
        helperText={errors.title?.message}
      />

      {/* Description */}
      <TextField
        fullWidth
        label="Description"
        multiline
        rows={3}
        margin="normal"
        {...register("description", {
          required: "Description is required",
        })}
        error={!!errors.description}
        helperText={errors.description?.message}
      />

      {/* Upload Images */}
      <Button variant="contained" component="label" sx={{ mt: 2 }}>
        Upload Images (1–4)
        <input
          hidden
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
        />
      </Button>

      {/* Preview Section */}
      <Grid container spacing={2} mt={2}>
        {fields.map((field, index) => (
          <Grid item xs={6} key={field.id}>
            <Box sx={{ position: "relative" }}>
              <img
                src={field.url}
                alt="preview"
                style={{
                  width: "100%",
                  height: 150,
                  objectFit: "cover",
                  borderRadius: 8,
                }}
              />
              <IconButton
                onClick={() => remove(index)}
                sx={{
                  position: "absolute",
                  top: 5,
                  right: 5,
                  bgcolor: isDark ? "#272727" : "#fff",
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Box>

            <TextField
              fullWidth
              size="small"
              label="Caption"
              margin="dense"
              {...register(`images.${index}.caption`)}
            />
          </Grid>
        ))}
      </Grid>

      <Button
        type="submit"
        variant="contained"
        fullWidth
        sx={{ mt: 3 }}
        disabled={loading}
        startIcon={loading && <CircularProgress size={20} />}
      >
        {loading ? "Uploading..." : "Submit Post"}
      </Button>
    </Box>
  );
};

export default CreatePostForm;