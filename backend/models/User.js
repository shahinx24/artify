import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      unique: true,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    pass: {
      type: String,
      required: true,
      select: false,
    },

    role: {
      type: String,
      default: "user",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);