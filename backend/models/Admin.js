import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
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
    },

    pass: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      default: "admin",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Admin", adminSchema);