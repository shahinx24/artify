import express from "express";
import { auth, authorizeSelf } from "../middleware/auth.js";

import {
  getUserWishlist,
  toggleUserWishlistItem,
  deleteUserWishlistItem,
  moveUserWishlistItemToCart,
} from "../controllers/wishlistController.js";

const router = express.Router();

router.use(auth);

router.get("/:id", authorizeSelf, getUserWishlist);

router.post("/:id/items", authorizeSelf, toggleUserWishlistItem);

router.delete(
  "/:id/items/:productId",
  authorizeSelf,
  deleteUserWishlistItem
);

router.post(
  "/:id/items/:productId/move-to-cart",
  authorizeSelf,
  moveUserWishlistItemToCart
);

export default router;