import { useState, useEffect } from "react";
import axios from "axios";

const API_USERS = "http://localhost:3000/users";
const API_ADMINS = "http://localhost:3000/admins";

export const useAuth = (showToast = () => {}) => {
  const [auth, setAuth] = useState(null);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    email: "",
    pass: "",
    confirm: ""
  });

  // Load auth once
  useEffect(() => {
    const storedAuth = JSON.parse(localStorage.getItem("auth"));
    setAuth(storedAuth);
    setLoading(false);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const login = async () => {
    const { email, pass } = form;

    // ADMIN
    const { data: admins } = await axios.get(API_ADMINS);
    const admin = admins.find(
      a => a.email === email && a.password === pass
    );

    if (admin) {
      const adminAuth = {
        id: admin.id,
        email: admin.email,
        role: "admin"
      };
      localStorage.setItem("auth", JSON.stringify(adminAuth));
      setAuth(adminAuth);
      return adminAuth;
    }

    // USER
    const { data: users } = await axios.get(API_USERS);
    const user = users.find(
      u => u.email === email && u.pass === pass
    );

    if (!user) {
      showToast("Invalid credentials");
      return null;
    }

    if (!user.isActive) {
      showToast("Your account is deactivated");
      return null;
    }

    localStorage.setItem("auth", JSON.stringify(user));
    setAuth(user);
    return user;
  };

  const register = async () => {
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
      isActive: true
    };

    await axios.post(API_USERS, newUser);
    showToast("Registered! Login now");
  };

  const logout = () => {
    localStorage.removeItem("auth");
    setAuth(null);
  };

  return {
    auth,
    loading,
    form,
    handleChange,
    login,
    register,
    logout
  };
};