import api from "../services/api";
export const authGuard = async () => {
  const auth = JSON.parse(localStorage.getItem("auth"));
  if (!auth || auth.role !== "user") return null;

  const { data: freshUser } = await api.get(`/users/${auth.id}`);

  if (!freshUser.isActive) {
    localStorage.removeItem("auth");
    return "Your account has been deactivated";
  }

  return null;
};