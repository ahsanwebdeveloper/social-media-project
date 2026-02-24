"use client";
import { useEffect, useState } from "react";
import { getComments, addComment, deleteComment } from "@/services/comment.service";

export default function useComments(videoId, postId) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!videoId && !postId) return;

    getComments(videoId, postId)
      .then(setComments)
      .finally(() => setLoading(false));
  }, [videoId, postId]);

  const createComment = async (text, parentComment = null) => {
    const newComment = await addComment(videoId, postId, text, parentComment);
    setComments(prev => [newComment, ...prev]);
  };

  const removeComment = async (commentId) => {
    await deleteComment(commentId);
    setComments(prev => prev.filter(comment => comment._id !== commentId));
  };

  return {
    comments,
    loading,
    createComment,
    removeComment,
  };
}