import mongoose, { Schema } from "mongoose";

const videoSchema = new Schema(
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

    videoUrl: {
      type: String,
      required: true,
    },

    thumbnailUrl: {
      type: String,
      required: true,
    },

    controls: {
      type: Boolean,
      default: true,
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
  {
    timestamps: true, 
  }
);

const Video = mongoose.models.Video || mongoose.model("Video", videoSchema);
export default Video;
