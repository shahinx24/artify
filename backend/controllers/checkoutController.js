import {
  beginCheckout,
  cancelPendingRazorpayCheckout,
  verifyRazorpayCheckout,
} from "../services/orders/checkoutService.js";
import { getRazorpayPublicConfig } from "../services/payments/razorpayService.js";

const sendError = (res, error) =>
  res.status(error.statusCode || 500).json({
    message: error.message || "Something went wrong",
  });

export const getRazorpayConfig = async (req, res) => {
  try {
    res.status(200).json(getRazorpayPublicConfig());
  } catch (error) {
    sendError(res, error);
  }
};

export const createCheckout = async (req, res) => {
  try {
    const result = await beginCheckout(req.body);
    res.status(result.duplicate ? 200 : 201).json(result);
  } catch (error) {
    sendError(res, error);
  }
};

export const verifyRazorpayPayment = async (req, res) => {
  try {
    const result = await verifyRazorpayCheckout(req.body);
    res.status(200).json(result);
  } catch (error) {
    sendError(res, error);
  }
};

export const cancelRazorpayPayment = async (req, res) => {
  try {
    const result = await cancelPendingRazorpayCheckout(req.body);
    res.status(200).json(result);
  } catch (error) {
    sendError(res, error);
  }
};
