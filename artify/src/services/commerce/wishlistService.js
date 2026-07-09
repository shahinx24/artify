import api from "../api";

export const getWishlistProducts = (userId) =>
  api.get(`/users/${userId}/wishlist/products`);

export const toggleWishlistItem = (userId, productId) =>
  api.post(`/users/${userId}/wishlist/items`, {
    productId,
  });

export const removeWishlistItem = (userId, productId) =>
  api.delete(`/users/${userId}/wishlist/items/${productId}`);

export const moveWishlistItemToCart = (userId, productId) =>
  api.post(`/users/${userId}/wishlist/items/${productId}/move-to-cart`);
