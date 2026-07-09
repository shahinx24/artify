import express from "express"
const router = express.Router();

import {
    createUser,
    getUser,
    getUserById,
    loginUser,
    updateUser,
    patchUser,
    deleteUser
} from "../controllers/userController.js";
import {
    addUserCartItem,
    clearUserCart,
    deleteUserCartItem,
    getUserCart,
    updateUserCartItem,
} from "../controllers/cartController.js";
import {
    deleteUserWishlistItem,
    getUserWishlist,
    moveUserWishlistItemToCart,
    toggleUserWishlistItem,
} from "../controllers/wishlistController.js";

router.post("/login", loginUser);
router.post("/", createUser);
router.get("/", getUser);
router.get("/:id", getUserById);
router.get("/:id/cart", getUserCart);
router.post("/:id/cart/items", addUserCartItem);
router.patch("/:id/cart/items/:productId", updateUserCartItem);
router.delete("/:id/cart/items/:productId", deleteUserCartItem);
router.delete("/:id/cart", clearUserCart);
router.get("/:id/wishlist/products", getUserWishlist);
router.post("/:id/wishlist/items", toggleUserWishlistItem);
router.delete("/:id/wishlist/items/:productId", deleteUserWishlistItem);
router.post("/:id/wishlist/items/:productId/move-to-cart", moveUserWishlistItemToCart);
router.put("/:id", updateUser);
router.patch("/:id", patchUser);
router.delete("/:id", deleteUser);

export default router
