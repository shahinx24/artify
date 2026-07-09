import express from "express";

import {
  createOrder,
  getAllOrders,
  getOrderById,
  getOrdersByUser,
  updateOrder,
  patchOrder,
  deleteOrder,
  updateOrderStatus,
} from "../controllers/orderController.js";

const router = express.Router();

router.post("/", createOrder);

router.get("/", getAllOrders);

router.get("/:id", getOrderById);

router.get("/user/:userId", getOrdersByUser);

router.put("/:id", updateOrder);
router.patch("/:id", patchOrder);

router.patch("/:id/status", updateOrderStatus);

router.delete("/:id", deleteOrder);

export default router;
