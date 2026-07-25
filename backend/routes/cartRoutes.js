import express from "express";
import { auth, authorizeSelf } from "../middleware/auth.js";

import {
  getUserCart,
  addUserCartItem,
  updateUserCartItem,
  deleteUserCartItem,
  clearUserCart,
} from "../controllers/cartController.js";

const router = express.Router();

router.use(auth);

router.get("/:id", authorizeSelf, getUserCart);

router.post("/:id/items", authorizeSelf, addUserCartItem);

router.patch("/:id/items/:productId", authorizeSelf, updateUserCartItem);

router.delete("/:id/items/:productId", authorizeSelf, deleteUserCartItem);

router.delete("/:id", authorizeSelf, clearUserCart);

export default router;