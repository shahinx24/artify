import api from "../services/api";

// Backend-only responsibility
export const saveUser = async (user) => {
  if (!user?.id) {
    console.error("❌ Missing user.id", user);
    return;
  }

  const res = await api.put(`/users/${user.id}`, user);
  return res.data;
};