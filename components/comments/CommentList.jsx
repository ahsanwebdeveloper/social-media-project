"use client";
import useComments from "@/hooks/useComments";
import CommentItem from "./CommentItem";
import CommentInput from "./CommentInput";

export default function CommentList({ videoId }) {
  const {
    comments,
    loading,
    createComment,
    removeComment,
  } = useComments(videoId);

  if (loading) return <p>Loading comments...</p>;

  return (
    <div>
      <CommentInput onSubmit={createComment} />

      <p>{comments.length} comments</p>

      {comments.map(comment => (
        <CommentItem
          key={comment._id}
          comment={comment}
          onDelete={removeComment}
        />
      ))}
    </div>
  );
}
