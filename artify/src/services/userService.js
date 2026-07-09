import api from "./api";

export const getUsers = () => api.get("/users");

export const getUserCount = async () => {
  const { data } = await api.get("/users");
  return data.length;
};

export const updateUser = (id, data) =>
  api.patch(`/users/${id}`, data);

export const deleteUserById = (id) =>
  api.delete(`/users/${id}`);
