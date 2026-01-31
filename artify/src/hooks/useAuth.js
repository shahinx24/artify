import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "../services/authService";

export const useAuth = (showToast = () => {}) => {
  const navigate = useNavigate();

  const [auth, setAuth] = useState(null);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    email: "",
    pass: "",
    confirm: "",
  });

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("auth"));
    if (stored?.id) setAuth(stored);
    setLoading(false);
  }, []);

  const handleChange = (e) => {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Login
  const login = async () => {
    try {
      const userAuth = await loginUser(form);

      localStorage.setItem("auth", JSON.stringify(userAuth));
      setAuth(userAuth);

      window.dispatchEvent(new Event("cart-change"));

      navigate(userAuth.role === "admin" ? "/admin" : "/");
      return userAuth;
    } catch (err) {
      showToast(err.message);
      return null;
    }
  };

  // Register
  const register = async () => {
    try {
      await registerUser(form);
      showToast("Registered successfully! Login now.");
      navigate("/login");
    } catch (err) {
      showToast(err.message);
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("auth");
    setAuth(null);
    window.dispatchEvent(new Event("cart-change"));
    navigate("/login");
  };

  return {
    auth,
    loading,
    form,
    handleChange,
    login,
    register,
    logout,
  };
};