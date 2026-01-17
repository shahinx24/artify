import axios from "axios";
import { ENV } from "../constants/env";

const API = `${ENV.API_BASE_URL}/users`;

// GET LOGGED IN USER (from localStorage)
export const getUser = () => {
  const u = JSON.parse(localStorage.getItem(ENV.USER_KEY));
  if (!u) return null;

  // ensure cart and wishlist are at least empty arrays
  return {
    ...u,
    cart: u.cart || [],
    wishlist: u.wishlist || []
  };
};

// SAVE UPDATED USER
export const saveUser = async (user) => {
  // Update in DB
  await axios.put(`${API}/${user.id}`, user);

  // Update currently logged in user
  localStorage.setItem(ENV.USER_KEY, JSON.stringify(user));

  // Notify other tabs / hooks
  window.dispatchEvent(new Event("storage"));
};

// LOGOUT USER (NEW — REQUIRED BY NAVBAR)
export const logoutUser = () => {
  localStorage.removeItem(ENV.USER_KEY);

  // Notify other tabs / hooks
  window.dispatchEvent(new Event("storage"));
};