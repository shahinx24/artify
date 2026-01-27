import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_USERS = "http://localhost:3000/users";
const API_ADMINS = "http://localhost:3000/admins";

export const useAuth = (showToast) => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    pass: "",
    confirm: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const login = async (e) => {
    e.preventDefault();

    const { email, pass } = form;

    /* ADMIN LOGIN */
    const { data: admins } = await axios.get(API_ADMINS);
    const admin = admins.find(
      a => a.email === email && a.password === pass
    );

    if (admin) {
      localStorage.setItem("auth", JSON.stringify({
        id: admin.id,
        email: admin.email,
        role: "admin"
      }));
      navigate("/admin");
      return;
    }

    /* USER LOGIN */
    const { data: users } = await axios.get(API_USERS);
    const user = users.find(
      u => u.email === email && u.pass === pass
    );

    if (!user) return showToast("Invalid credentials");

    if (!user.isActive) {
      localStorage.removeItem("auth");
      return showToast("Your account is deactivated");
    }

    localStorage.setItem("auth", JSON.stringify(user));
    navigate("/");
  };

  const register = async (e) => {
    e.preventDefault();

    const { email, pass, confirm } = form;

    if (!email || !pass || !confirm)
      return showToast("All fields required");

    if (pass !== confirm)
      return showToast("Passwords don't match");

    const { data: users } = await axios.get(API_USERS);

    if (users.find(u => u.email === email))
      return showToast("User already exists");

    const newUser = {
      email,
      pass,
      role: "user",
      cart: [],
      wishlist: [],
      orders: [],
      isActive: true
    };

    await axios.post(API_USERS, newUser);
    showToast("Registered! Login now");
    navigate("/login");
  };

  return { form, handleChange, login, register };
};