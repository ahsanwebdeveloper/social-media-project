import mongoose, { Schema } from "mongoose";

const likeSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    video: {
      type: Schema.Types.ObjectId,
      ref: "video",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);


likeSchema.index(
    { user: 1, video: 1 }, 
    { unique: true }
);

const Like = mongoose.models.Like || mongoose.model("Like", likeSchema);
export default Like;
