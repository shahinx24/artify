import { api } from "./api";

export const getUserCount = async () => {
  const { data } = await api.get("/users");
  return data.length;
};

export const saveUser = async (user) => {
  if (!user?.id) {
    console.error("❌ Missing user.id", user);
    return;
  }

  const res = await api.put(`/users/${user.id}`, user);
  return res.data;
};