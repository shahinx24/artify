import crypto from "node:crypto";
import CheckoutAttempt from "../../models/CheckoutAttempt.js";
import Order from "../../models/Order.js";
import Product from "../../models/Product.js";
import User from "../../models/User.js";
import { createRazorpayOrder } from "../payments/razorpayService.js";
import { isRazorpayPaymentMethod } from "../payments/paymentMethods.js";
import { normalizeEmail, toNumber } from "../../utils/normalize.js";

const timingSafeEqualHex = (left = "", right = "") => {
  if (!/^[a-f0-9]+$/i.test(left) || !/^[a-f0-9]+$/i.test(right)) {
    return false;
  }

  const leftBuffer = Buffer.from(left, "hex");
  const rightBuffer = Buffer.from(right, "hex");

  return (
    leftBuffer.length === rightBuffer.length &&
    crypto.timingSafeEqual(leftBuffer, rightBuffer)
  );
};

const nextNumericId = async () => {
  const docs = await Order.find({}, { id: 1, _id: 0 }).lean();
  const maxId = docs.reduce((max, doc) => {
    const value = Number(doc.id);
    return Number.isFinite(value) ? Math.max(max, value) : max;
  }, 0);

  return maxId + 1;
};

const ensureAddress = (address = {}) => {
  if (!address.city || !address.street || !address.pin) {
    const error = new Error("Fill address");
    error.statusCode = 400;
    throw error;
  }

  return {
    city: String(address.city).trim(),
    street: String(address.street).trim(),
    pin: String(address.pin).trim(),
  };
};

const markAttemptFailed = async (attemptId, message) => {
  await CheckoutAttempt.findByIdAndUpdate(attemptId, {
    status: "failed",
    errorMessage: message,
  });
};

const releaseReservedStock = async (changes) => {
  for (const change of changes) {
    await Product.findOneAndUpdate(
      { id: change.productId },
      { $inc: { stock: change.qty } }
    );
  }
};

const releaseOrderStock = async (items = []) => {
  for (const item of items) {
    await Product.findOneAndUpdate(
      { id: Number(item.productId) },
      { $inc: { stock: Math.max(1, Number(item.qty) || 1) } }
    );
  }
};

const reserveStock = async (cartItems) => {
  const appliedChanges = [];

  for (const item of cartItems) {
    const productId = Number(item.productId);
    const qty = Math.max(1, Number(item.qty) || 1);

    const product = await Product.findOneAndUpdate(
      {
        id: productId,
        stock: { $gte: qty },
      },
      {
        $inc: { stock: -qty },
      },
      {
        new: true,
      }
    ).lean();

    if (!product) {
      await releaseReservedStock(appliedChanges);
      const error = new Error("One or more items are out of stock");
      error.statusCode = 409;
      throw error;
    }

    appliedChanges.push({ productId, qty, product });
  }

  return appliedChanges;
};

const buildOrderItems = (cart = []) =>
  cart.map((item) => ({
    productId: Number(item.productId),
    qty: Math.max(1, Number(item.qty) || 1),
  }));

const computeTotal = (reservedStock) =>
  reservedStock.reduce(
    (sum, item) => sum + Number(item.product.price || 0) * Number(item.qty),
    0
  );

const toStoredRazorpayOrder = (paymentDetails = {}) => {
  if (!paymentDetails.razorpayOrderId) return null;

  return {
    id: paymentDetails.razorpayOrderId,
    amount: paymentDetails.razorpayOrderAmount,
    currency: paymentDetails.razorpayOrderCurrency || "INR",
  };
};

export const beginCheckout = async ({
  userId,
  method,
  address,
  clientRequestId,
}) => {
  const numericUserId = toNumber(userId);
  if (!numericUserId) {
    const error = new Error("Invalid user");
    error.statusCode = 400;
    throw error;
  }

  if (!clientRequestId?.trim()) {
    const error = new Error("Missing checkout request id");
    error.statusCode = 400;
    throw error;
  }

  if (!isRazorpayPaymentMethod(method)) {
    const error = new Error("Choose a payment method");
    error.statusCode = 400;
    throw error;
  }

  const existingAttempt = await CheckoutAttempt.findOne({
    requestId: clientRequestId,
  }).lean();

  if (existingAttempt?.status === "completed" && existingAttempt.orderId) {
    const existingOrder = await Order.findOne({ id: existingAttempt.orderId }).lean();
    return {
      duplicate: true,
      order: existingOrder,
      razorpayOrder: toStoredRazorpayOrder(existingOrder?.paymentDetails),
    };
  }

  if (existingAttempt?.status === "processing") {
    const error = new Error("Checkout is already being processed");
    error.statusCode = 409;
    throw error;
  }

  let attempt;
  try {
    attempt = await CheckoutAttempt.create({
      requestId: clientRequestId,
      userId: numericUserId,
      status: "processing",
    });
  } catch (error) {
    if (error?.code === 11000) {
      const activeAttempt = await CheckoutAttempt.findOne({
        requestId: clientRequestId,
      }).lean();

      if (activeAttempt?.status === "completed" && activeAttempt.orderId) {
        const existingOrder = await Order.findOne({ id: activeAttempt.orderId }).lean();
        return {
          duplicate: true,
          order: existingOrder,
          razorpayOrder: toStoredRazorpayOrder(existingOrder?.paymentDetails),
        };
      }

      const duplicateError = new Error("Checkout is already being processed");
      duplicateError.statusCode = 409;
      throw duplicateError;
    }

    throw error;
  }

  let reservedStock = [];

  try {
    const user = await User.findOne({ id: numericUserId });
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    if (!user.isActive) {
      const error = new Error("Account deactivated");
      error.statusCode = 403;
      throw error;
    }

    if (!user.cart?.length) {
      const error = new Error("Cart is empty");
      error.statusCode = 400;
      throw error;
    }

    const normalizedAddress = ensureAddress(address);
    reservedStock = await reserveStock(buildOrderItems(user.cart));

    const orderId = await nextNumericId();
    const total = computeTotal(reservedStock);
    const amountInPaise = Math.round(total * 100);

    if (!Number.isFinite(amountInPaise) || amountInPaise <= 0) {
      const error = new Error("Invalid checkout amount");
      error.statusCode = 400;
      throw error;
    }

    console.info("[checkout] creating payment order", {
      userId: numericUserId,
      orderId,
      method,
      total,
      amountInPaise,
      itemCount: user.cart.length,
    });

    const razorpayOrder = await createRazorpayOrder({
      amount: amountInPaise,
      receipt: `artify-${orderId}`,
      notes: {
        userId: String(numericUserId),
        clientRequestId,
        selectedMethod: method,
      },
    });

    const order = await Order.create({
      id: orderId,
      userId: numericUserId,
      userEmail: normalizeEmail(user.email),
      clientRequestId,
      items: buildOrderItems(user.cart),
      total,
      method,
      address: normalizedAddress,
      status: "payment_pending",
      paymentStatus: "pending",
      paymentProvider: "razorpay",
      paymentDetails: {
        razorpayOrderId: razorpayOrder.id,
        razorpayOrderAmount: razorpayOrder.amount,
        razorpayOrderCurrency: razorpayOrder.currency,
        selectedMethod: method,
      },
    });

    await CheckoutAttempt.findByIdAndUpdate(attempt._id, {
      status: "completed",
      orderId: order.id,
      errorMessage: undefined,
    });

    return {
      duplicate: false,
      order: order.toObject(),
      user: user.toObject(),
      razorpayOrder,
    };
  } catch (error) {
    if (reservedStock.length > 0) {
      await releaseReservedStock(reservedStock);
    }

    await markAttemptFailed(attempt._id, error.message);
    throw error;
  }
};

export const verifyRazorpayCheckout = async ({
  orderId,
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature,
}) => {
  console.info("[checkout] verifying razorpay payment", {
    orderId,
    razorpayOrderId,
    hasPaymentId: Boolean(razorpayPaymentId),
    hasSignature: Boolean(razorpaySignature),
  });

  const order = await Order.findOne({ id: toNumber(orderId) });
  if (!order) {
    const error = new Error("Order not found");
    error.statusCode = 404;
    throw error;
  }

  if (
    !razorpayOrderId ||
    !razorpayPaymentId ||
    !razorpaySignature ||
    order.paymentDetails?.razorpayOrderId !== razorpayOrderId
  ) {
    console.error("[checkout] razorpay verification payload mismatch", {
      orderId,
      expectedRazorpayOrderId: order.paymentDetails?.razorpayOrderId,
      receivedRazorpayOrderId: razorpayOrderId,
      hasPaymentId: Boolean(razorpayPaymentId),
      hasSignature: Boolean(razorpaySignature),
    });

    const error = new Error("Invalid Razorpay payment response");
    error.statusCode = 400;
    throw error;
  }

  if (!process.env.RAZORPAY_KEY_SECRET?.trim()) {
    const error = new Error("Razorpay is not configured");
    error.statusCode = 503;
    throw error;
  }

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET.trim())
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest("hex");

  if (!timingSafeEqualHex(expectedSignature, razorpaySignature)) {
    console.error("[checkout] invalid razorpay signature", {
      orderId,
      razorpayOrderId,
      razorpayPaymentId,
    });

    const error = new Error("Invalid payment signature");
    error.statusCode = 400;
    throw error;
  }

  order.status = "processing";
  order.paymentStatus = "paid";
  order.paymentDetails = {
    ...order.paymentDetails,
    razorpayOrderId,
    selectedMethod: order.method,
    razorpayPaymentId,
    razorpaySignature,
  };
  await order.save();

  const user = await User.findOne({ id: order.userId });
  if (user) {
    user.cart = [];
    await user.save();
  }

  return {
    order: order.toObject(),
    user: user?.toObject() || null,
  };
};

export const cancelPendingRazorpayCheckout = async ({ orderId, reason }) => {
  const order = await Order.findOne({ id: toNumber(orderId) });
  if (!order) {
    const error = new Error("Order not found");
    error.statusCode = 404;
    throw error;
  }

  if (order.paymentProvider !== "razorpay") {
    const error = new Error("Only Razorpay checkout can be cancelled here");
    error.statusCode = 400;
    throw error;
  }

  if (order.paymentStatus === "paid") {
    const error = new Error("Paid order cannot be cancelled from checkout");
    error.statusCode = 409;
    throw error;
  }

  if (order.status === "cancelled") {
    return { order: order.toObject(), releasedStock: false };
  }

  if (order.status !== "payment_pending") {
    const error = new Error("Only pending payment orders can be cancelled");
    error.statusCode = 409;
    throw error;
  }

  await releaseOrderStock(order.items);

  order.status = "cancelled";
  order.paymentStatus = "failed";
  order.paymentDetails = {
    ...order.paymentDetails,
    failureReason: reason || "Checkout was not completed",
  };
  await order.save();

  console.info("[checkout] cancelled pending razorpay order", {
    orderId: order.id,
    reason: order.paymentDetails.failureReason,
  });

  return { order: order.toObject(), releasedStock: true };
};
