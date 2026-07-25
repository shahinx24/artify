import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema(
  {
    userId: {
      type: Number,
      required: true,
      index: true,
    },

    productId: {
      type: Number,
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate wishlist entries
wishlistSchema.index(
  { userId: 1, productId: 1 },
  { unique: true }
);

export default mongoose.model("Wishlist", wishlistSchema);