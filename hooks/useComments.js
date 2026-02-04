"use client";
import { useEffect, useState } from "react";
import {
  getComments,
  addComment,
  deleteComment,
} from "@/services/comment.service";

export default function useComments(videoId) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!videoId) return;

    getComments(videoId)
      .then(setComments)
      .finally(() => setLoading(false));
  }, [videoId]);

  const createComment = async (text, parentComment = null) => {
    const newComment = await addComment(videoId, text, parentComment);
    setComments(prev => [newComment, ...prev]);
  };

  const removeComment = async (commentId) => {
    await deleteComment(commentId);
    setComments(prev =>
      prev.filter(comment => comment._id !== commentId)
    );
  };

  return {
    comments,
    loading,
    createComment,
    removeComment,
  };
}
