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

const sendWishlist = async (res, action) => {
  try {
    res.status(200).json(await action());
  } catch (error) {
    sendError(res, error);
  }
};

export const getUserWishlist = (req, res) =>
  sendWishlist(res, () => getWishlistProducts(req.params.id));

export const toggleUserWishlistItem = (req, res) =>
  sendWishlist(res, () =>
    toggleWishlistItem(
      req.params.id,
      req.body.productId
    )
  );

export const deleteUserWishlistItem = (req, res) =>
  sendWishlist(res, () =>
    removeWishlistItem(
      req.params.id,
      req.params.productId
    )
  );

export const moveUserWishlistItemToCart = (req, res) =>
  sendWishlist(res, () =>
    moveWishlistItemToCart(
      req.params.id,
      req.params.productId
    )
  );
