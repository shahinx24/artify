import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
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

    qty: {
      type: Number,
      default: 1,
      min: 1,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate cart rows for the same user and product
cartSchema.index(
  { userId: 1, productId: 1 },
  { unique: true }
);

export default mongoose.model("Cart", cartSchema);