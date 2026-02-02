import api from "./api";

// Get all users (admin)
export const getUsers = () => api.get("/users");

// Count users (admin dashboard)
export const getUserCount = async () => {
  const { data } = await api.get("/users");
  return data.length;
};

// Save / update full user (auth, wishlist, cart)
export const saveUser = async (user) => {
  if (!user?.id) {
    console.error("❌ Missing user.id", user);
    return;
  }

  const res = await api.put(`/users/${user.id}`, user);
  return res.data;
};

// Partial update (admin toggle)
export const updateUser = (id, data) =>
  api.patch(`/users/${id}`, data);

// Delete user (admin)
export const deleteUserById = (id) =>
  api.delete(`/users/${id}`);