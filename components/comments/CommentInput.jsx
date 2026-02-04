"use client";
import { useState } from "react";
import {
  Box,
  TextField,
  IconButton,
  Paper,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

export default function CommentInput({ onSubmit }) {
  const [text, setText] = useState("");

  const handleSubmit = () => {
    if (!text.trim()) return;
    onSubmit(text);
    setText("");
  };

  return (
    <Paper
      elevation={3}
      sx={{
        display: "flex",
        alignItems: "center",
        p: 1,
        borderRadius: "999px",
        mt: 1,
      }}
    >
      <TextField
        variant="standard"
        placeholder="Add a comment..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        fullWidth
        multiline
        maxRows={3}
        InputProps={{
          disableUnderline: true,
          sx: { ml: 1 },
        }}
      />

      <IconButton
        onClick={handleSubmit}
        disabled={!text.trim()}
        sx={{
          color: text.trim() ? "primary.main" : "grey.400",
        }}
      >
        <SendIcon />
      </IconButton>
    </Paper>
  );
}
