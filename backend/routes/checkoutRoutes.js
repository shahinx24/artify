import express from "express";
import {
  cancelRazorpayPayment,
  createCheckout,
  getRazorpayConfig,
  verifyRazorpayPayment,
} from "../controllers/checkoutController.js";

const router = express.Router();

router.get("/razorpay/config", getRazorpayConfig);
router.post("/", createCheckout);
router.post("/razorpay/verify", verifyRazorpayPayment);
router.post("/razorpay/cancel", cancelRazorpayPayment);

export default router;
