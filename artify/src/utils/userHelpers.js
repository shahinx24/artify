import axios from "axios";

const API = "http://localhost:3000/users";

// GET LOGGED IN USER (from local)
export const getUser = async () => {
  const auth = JSON.parse(localStorage.getItem("auth"));
  if (!auth) return null;
 // ensure cart and wishlist are at least empty arrays 
  return { 
    ...auth, // Makes a new object copying all fields (name, email, etc.)
    cart: auth.cart || [],
    wishlist: auth.wishlist || []
  };
};

// SAVE UPDATED USER
export const saveUser = async (user) => {
  // Update in DB
  await axios.put(`${API}/${user.id}`, user);

  // Update currently logged in user
  localStorage.setItem("user", JSON.stringify(user));
};