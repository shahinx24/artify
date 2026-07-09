import {
  getWishlistProducts,
  moveWishlistItemToCart,
  removeWishlistItem,
  toggleWishlistItem,
} from "../services/commerce/wishlistService.js";

const sendError = (res, error) =>
  res.status(error.statusCode || 500).json({
    message: error.message || "Something went wrong",
  });

export const getUserWishlist = async (req, res) => {
  try {
    const products = await getWishlistProducts(req.params.id);
    res.status(200).json(products);
  } catch (error) {
    sendError(res, error);
  }
};

export const toggleUserWishlistItem = async (req, res) => {
  try {
    const user = await toggleWishlistItem(req.params.id, req.body.productId);
    res.status(200).json(user);
  } catch (error) {
    sendError(res, error);
  }
};

export const deleteUserWishlistItem = async (req, res) => {
  try {
    const user = await removeWishlistItem(req.params.id, req.params.productId);
    res.status(200).json(user);
  } catch (error) {
    sendError(res, error);
  }
};

export const moveUserWishlistItemToCart = async (req, res) => {
  try {
    const user = await moveWishlistItemToCart(req.params.id, req.params.productId);
    res.status(200).json(user);
  } catch (error) {
    sendError(res, error);
  }
};
