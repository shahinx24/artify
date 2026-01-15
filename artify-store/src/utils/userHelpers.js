import axios from "axios";

const API = "http://localhost:3000/users";

// GET LOGGED IN USER (from local)
export const getUser = () => {
  const u = JSON.parse(localStorage.getItem("user"));
  if (!u) return null;

  return {
    ...u, // ensure cart and wishlist are at least empty arrays
    cart: u.cart || [],
    wishlist: u.wishlist || []
  };
};

// SAVE UPDATED USER
export const saveUser = async (user) => {
  // Update in DB
  await axios.put(`${API}/${user.id}`, user);

  // Update currently logged in user
  localStorage.setItem("user", JSON.stringify(user));
};