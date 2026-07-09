import api from "../api";

export const getRazorpayConfig = () =>
  api.get("/checkout/razorpay/config");

export const createCheckout = (payload) =>
  api.post("/checkout", payload);

export const verifyRazorpayPayment = (payload) =>
  api.post("/checkout/razorpay/verify", payload);

export const cancelRazorpayPayment = (payload) =>
  api.post("/checkout/razorpay/cancel", payload);
