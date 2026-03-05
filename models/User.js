import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import { type } from "node:os";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true, 
      unique: true,
      index: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    password: {
      type: String,
      required: true,
      select: false, 
    },

    image: {
      type: String,
      required: true, 
    },
    emailVerified: {
       type: Boolean,
        default: true, 
      },
    emailToken: {
    type: String,
  },

  emailTokenExpires: {
    type: Date,
  },
  },
  {
    timestamps: true, 
  }
);

// password hash middleware
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;

