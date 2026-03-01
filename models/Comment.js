import mongoose, { Schema } from "mongoose";

const commentSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    video: {
      type: Schema.Types.ObjectId,
      ref: "Video",
      default: null,
    },

    post: {
      type: Schema.Types.ObjectId,
      ref: "post",
      default: null,
    },

    content: {
      type: String,
      required: true,
    },

    parentComment: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
    },
  },
  { timestamps: true }
);

// Ensure either video OR post exists
commentSchema.pre("validate", function () {
  if (!this.video && !this.post) {
    throw new Error("Either video or post must be provided");
  }
});

//  Index for fast queries
commentSchema.index({ video: 1, createdAt: -1 });
commentSchema.index({ post: 1, createdAt: -1 });

const Comment =
  mongoose.models.Comment || mongoose.model("Comment", commentSchema);

export default Comment;