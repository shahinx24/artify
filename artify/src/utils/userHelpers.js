import api from "../services/api";

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

  await api.put(`/users/${user.id}`, user);
  return user;
};