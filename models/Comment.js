import mongoose, { Schema } from "mongoose";
const commentSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  video: { type: Schema.Types.ObjectId, ref: "video", required: true },
  content: { type: String, required: true },
  parentComment: { type: Schema.Types.ObjectId, ref: "Comment", default: null }, 
}, { timestamps: true });
commentSchema.index(
    {video: 1, createdAt: -1}
)

const Comment = mongoose.models.Comment || mongoose.model("Comment", commentSchema);
export default Comment;
