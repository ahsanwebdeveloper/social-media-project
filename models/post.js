import mongoose, { Schema } from "mongoose";

function arrayLimit(val) {
  return val.length >= 1 && val.length <= 4;
}

const postSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    postUrl: { type: String, default: "" }, // optional video URL
    controls: { type: Boolean, default: true },
    likesCount: { type: Number, default: 0 },
    sharesCount: { type: Number, default: 0 },
    images: {
      type: [
        {
          url: { type: String, required: true },
          caption: { type: String, default: "" },
        },
      ],
      validate: [arrayLimit, "A post can have between 1 and 4 images"],
      default: [], // optional images
    },
    transformation: {
      height: { type: Number, default: 720 },
      width: { type: Number, default: 1220 },
      quality: { type: Number, min: 1, max: 100, default: 80 },
    },
  },
  { timestamps: true }
);

// Avoid OverwriteModelError in Next.js dev
const Post = mongoose.models.Post || mongoose.model("Post", postSchema);

export default Post;