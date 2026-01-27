import axios from "axios";
import { ENV } from "../constants/env";

const API = `${ENV.API_BASE_URL}/users`;

export const getUser = () => {
  const u = JSON.parse(localStorage.getItem("auth"));
  if (!u || !u.id) return null;

  return {
    ...u,
    cart: u.cart ?? [],
    wishlist: u.wishlist ?? []
  };
};

export const saveUser = async (user) => {
  if (!user?.id) {
    console.error("❌ Missing user.id", user);
    return;
  }

  await axios.put(`${API}/${user.id}`, user);
  localStorage.setItem("auth", JSON.stringify(user));
};