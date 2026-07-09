import api from "../api";

export const getCartItems = (userId) =>
  api.get(`/users/${userId}/cart`);

export const addCartItem = (userId, productId, qty = 1) =>
  api.post(`/users/${userId}/cart/items`, {
    productId,
    qty,
  });

export const updateCartItemQty = (userId, productId, qty) =>
  api.patch(`/users/${userId}/cart/items/${productId}`, {
    qty,
  });

export const removeCartItem = (userId, productId) =>
  api.delete(`/users/${userId}/cart/items/${productId}`);

export const clearCart = (userId) =>
  api.delete(`/users/${userId}/cart`);
