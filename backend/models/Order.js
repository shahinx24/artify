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

    clientRequestId: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },

    total: {
      type: Number,
      required: true,
    },

    method: {
      type: String,
      enum: ["razorpay_upi", "razorpay_card", "razorpay", "cod"],
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
        "payment_pending",
        "processing",
        "delivered",
        "cancelled",
      ],
      default: "pending",
    },

    paymentStatus: {
      type: String,
      enum: [
        "pending",
        "authorized",
        "paid",
        "failed",
        "cod_pending",
      ],
      default: "pending",
    },

    paymentProvider: {
      type: String,
      enum: ["cod", "razorpay"],
      default: "razorpay",
    },

    paymentDetails: {
      razorpayOrderId: String,
      razorpayOrderAmount: Number,
      razorpayOrderCurrency: String,
      razorpayPaymentId: String,
      razorpaySignature: String,
      selectedMethod: String,
      failureReason: String,
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
