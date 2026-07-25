import api from "../api";

export const getWishlistProducts = (userId) =>
  api.get(`/api/wishlist/${userId}`);

export const toggleWishlistItem = (userId, productId) =>
  api.post(`/api/wishlist/${userId}/items`, {
    productId,
  });

export const removeWishlistItem = (userId, productId) =>
  api.delete(`/api/wishlist/${userId}/items/${productId}`);

export const moveWishlistItemToCart = (userId, productId) =>
  api.post(`/api/wishlist/${userId}/items/${productId}/move-to-cart`);
