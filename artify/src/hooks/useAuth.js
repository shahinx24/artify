import { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../constants/api";

const API_USERS = `${API_BASE_URL}/users`;
const API_ADMINS = `${API_BASE_URL}/admins`;

export { API_USERS, API_ADMINS };


const normalizeUser = (u) => ({
  id: u.id,
  email: u.email,
  role: u.role || "user",
  cart: u.cart ?? [],
  wishlist: u.wishlist ?? [],
  isActive: u.isActive ?? true
});

export const useAuth = (showToast = () => {}) => {
  const [auth, setAuth] = useState(null);
  const [loading, setLoading] = useState(true);


  const [form, setForm] = useState({
    email: "",
    pass: "",
    confirm: ""
  });

  useEffect(() => {
    const storedAuth = JSON.parse(localStorage.getItem("auth"));
    if (storedAuth?.id) {
      setAuth(normalizeUser(storedAuth));
    }
    setLoading(false);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const login = async () => {
    const { email, pass } = form;

    if (!email || !pass) {
      showToast("All fields required");
      return null;
    }

    // ADMIN LOGIN 
    const { data: admins } = await axios.get(API_ADMINS);
    const admin = admins.find(
      a => a.email === email && a.password === pass
    );

    if (admin) {
      const adminAuth = normalizeUser({
        ...admin,
        role: "admin"
      });
      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }

      localStorage.setItem("auth", JSON.stringify(adminAuth));
      setAuth(adminAuth);
      window.dispatchEvent(new Event("cart-change"));
      return adminAuth;
    }

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

    const userAuth = normalizeUser(user);

    localStorage.setItem("auth", JSON.stringify(userAuth));
    setAuth(userAuth);
    window.dispatchEvent(new Event("cart-change"));
    return userAuth;
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
    showToast("Registered successfully! Login now.");
  };

  const logout = () => {
    localStorage.removeItem("auth");
    setAuth(null);
    window.dispatchEvent(new Event("cart-change"));
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
