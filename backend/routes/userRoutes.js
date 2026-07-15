import express from "express"
import { auth, authorizeSelf } from "../middleware/auth.js";

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

router.use(auth);

router.get("/", getUser);
router.get("/:id", authorizeSelf, getUserById);

router.get("/:id/cart", authorizeSelf, getUserCart);
router.post("/:id/cart/items", authorizeSelf, addUserCartItem);
router.patch("/:id/cart/items/:productId", authorizeSelf, updateUserCartItem);
router.delete("/:id/cart/items/:productId", authorizeSelf, deleteUserCartItem);
router.delete("/:id/cart", authorizeSelf, clearUserCart);

router.get("/:id/wishlist/products", authorizeSelf, getUserWishlist);
router.post("/:id/wishlist/items", authorizeSelf, toggleUserWishlistItem);
router.delete("/:id/wishlist/items/:productId", authorizeSelf, deleteUserWishlistItem);
router.post("/:id/wishlist/items/:productId/move-to-cart", authorizeSelf, moveUserWishlistItemToCart);

router.put("/:id", authorizeSelf, updateUser);
router.patch("/:id", authorizeSelf, patchUser);
router.delete("/:id", authorizeSelf, deleteUser);

export default router
