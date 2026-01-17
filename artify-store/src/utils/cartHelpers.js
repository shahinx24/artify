import { ENV } from "../constants/env";

export const getCart = () => {
  return JSON.parse(localStorage.getItem(ENV.CART_KEY)) || [];
};

export const saveCart = (cart) => {
  localStorage.setItem(ENV.CART_KEY, JSON.stringify(cart));
  window.dispatchEvent(new Event("storage"));
};

export const clearCart = () => {
  localStorage.removeItem(ENV.CART_KEY);
  window.dispatchEvent(new Event("storage"));
};