import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    productId: {
      type: Number,
      required: true,
    },

    qty: {
      type: Number,
      required: true,
      default: 1,
    },
  },
  {
    _id: false,
  }
);

const orderSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      unique: true,
      required: true,
    },

    userId: {
      type: Number,
      required: true,
    },

    userEmail: {
      type: String,
      required: true,
    },

    items: [itemSchema],

    total: {
      type: Number,
      required: true,
    },

    method: {
      type: String,
      enum: ["cod", "gpay"],
      required: true,
    },

    address: {
      city: {
        type: String,
        required: true,
      },

      street: {
        type: String,
        required: true,
      },

      pin: {
        type: String,
        required: true,
      },
    },

    status: {
      type: String,
      enum: [
        "pending",
        "processing",
        "delivered",
        "cancelled",
      ],
      default: "pending",
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Order", orderSchema);