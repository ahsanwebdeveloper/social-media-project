import mongoose, { Schema } from "mongoose";

const postSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    postUrl: {
      type: String,
      required: true,
    },
    controls: {
      type: Boolean,
      default: true,
    },
    likesCount: {
      type: Number,
      default: 0,
    },
    shareCount: {
      type: Number,
      default: 0,
    },
    images: {
      type: [
        {
          url: {
            type: String,
            required: true,
          },
          caption: {
            type: String,
            default: "",
          },
        },
      ],
      validate: [arrayLimit, "A post can have between 1 and 4 images"],
      required: true,
    },
    transformation: {
      height: {
        type: Number,
        default: 720,
      },
      width: {
        type: Number,
        default: 1220,
      },
      quality: {
        type: Number,
        min: 1,
        max: 100,
        default: 80,
      },
    },
  },
  { timestamps: true }
);

// Custom validator to ensure 1-4 images
function arrayLimit(val) {
  return val.length >= 1 && val.length <= 4;
}
const Post = mongoose.models.Posts || mongoose.models("Post" , postSchema)
export default  Post;