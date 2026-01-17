import { useState } from "react";
import { loginUser, registerUser } from "../services/authServices";
// import { loginUser, registerUser } from "../services/authService";


export function useAuth(showToast, setAuthMode) {
  const [form, setForm] = useState({
    email: "",
    pass: "",
    confirm: "",
  });

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const login = async (e) => {
    e.preventDefault();
    const user = await loginUser(form, showToast);
    if (!user) return;

    localStorage.setItem("user", JSON.stringify(user));
    showToast("Logged in!");
    setAuthMode(null);
    window.location.reload(); // temp
  };

  const register = async (e) => {
    e.preventDefault();
    const success = await registerUser(form, showToast);
    if (!success) return;

    showToast("Registered! Login now");
    setAuthMode("login");
  };

  return {
    form,
    handleChange,
    login,
    register,
  };
}