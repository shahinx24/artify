import axios from "axios";

export const getUser = () =>
  JSON.parse(localStorage.getItem("user"));

export const saveUser = async(updatedUser) => {
  await axios.put(`http://localhost:3000/users/${updatedUser.id}`, updatedUser);
  localStorage.setItem("user", JSON.stringify(updatedUser));
};
//This keeps everything in one place