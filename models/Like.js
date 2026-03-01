import mongoose from "mongoose";

const likeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    video: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video",
      default: null,
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      default: null,
    },
  },
  { timestamps: true }
);

likeSchema.pre("validate", function () {
  if (!this.video && !this.post) {
    throw new Error("Either video or post must be provided");
  }
});


likeSchema.index(
  { user: 1, video: 1 },
  { unique: true, partialFilterExpression: { video: { $type: "objectId" } } }
);

likeSchema.index(
  { user: 1, post: 1 },
  { unique: true, partialFilterExpression: { post: { $type: "objectId" } } }
);

export default mongoose.models.Like ||
  mongoose.model("Like", likeSchema);