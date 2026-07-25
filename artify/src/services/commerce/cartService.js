import api from "../api";

export const getCartItems = (userId) =>
  api.get(`/api/cart/${userId}`);

export const addCartItem = (userId, productId, qty = 1) =>
  api.post(`/api/cart/${userId}/items`, {
    productId,
    qty,
  });

export const updateCartItemQty = (userId, productId, qty) =>
  api.patch(`/api/cart/${userId}/items/${productId}`, {
    qty,
  });

export const removeCartItem = (userId, productId) =>
  api.delete(`/api/cart/${userId}/items/${productId}`);

export const clearCart = (userId) =>
  api.delete(`/api/cart/${userId}`);
