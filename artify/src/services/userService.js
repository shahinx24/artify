import { api } from "./api";

export const getUserCount = async () => {
  const { data } = await api.get("/users");
  return data.length;
};