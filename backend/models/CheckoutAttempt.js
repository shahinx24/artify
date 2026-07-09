import mongoose from "mongoose";

const checkoutAttemptSchema = new mongoose.Schema(
  {
    requestId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    userId: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["processing", "completed", "failed"],
      default: "processing",
    },

    orderId: {
      type: Number,
    },

    errorMessage: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("CheckoutAttempt", checkoutAttemptSchema);
