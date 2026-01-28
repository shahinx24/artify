import { useLocation, useNavigate } from "react-router-dom";
import AuthForm from "../../components/form/AuthForm";
import AuthSwitch from "../../components/form/AuthSwitch";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";

export default function AuthPage({ showToast }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    pass: "",
    confirm: ""
  });

  const isLogin = location.pathname === "/login";

  const handleSubmit = async () => {
    const email = form.email.trim().toLowerCase();
    const pass = form.pass.trim();

    // fetch users & admins
    const [usersRes, adminsRes] = await Promise.all([
      fetch("http://localhost:3000/users"),
      fetch("http://localhost:3000/admins")
    ]);

    const users = await usersRes.json();
    const admins = await adminsRes.json();

    if (isLogin) {
      // 🔐 check admin first
      const admin = admins.find(
        a =>
          a.email.toLowerCase() === email &&
          a.pass === pass
      );

      if (admin) {
        login(admin); // role === "admin"
        return;
      }

      // 👤 check user
      const user = users.find(
        u =>
          u.email.toLowerCase() === email &&
          u.pass === pass
      );

      if (!user) {
        showToast?.("Invalid credentials", "error");
        return;
      }

      if (!user.isActive) {
        showToast?.("Account deactivated", "error");
        return;
      }

      login(user); // role === "user"
    } else {
      // 📝 register
      if (form.pass !== form.confirm) {
        showToast?.("Passwords do not match", "error");
        return;
      }

      const exists =
        users.some(u => u.email.toLowerCase() === email) ||
        admins.some(a => a.email.toLowerCase() === email);

      if (exists) {
        showToast?.("Email already exists", "error");
        return;
      }

      await fetch("http://localhost:3000/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          pass,
          role: "user",
          cart: [],
          wishlist: [],
          orders: [],
          isActive: true
        })
      });

      navigate("/login");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <>
      <AuthForm
        title={isLogin ? "Welcome Back" : "Create Account"}
        buttonText={isLogin ? "LOGIN" : "REGISTER"}
        onSubmit={handleSubmit}
        onChange={handleChange}
        values={form}
        fields={[
          { name: "email", type: "email", placeholder: "Email" },
          { name: "pass", type: "password", placeholder: "Password" },
          ...(!isLogin
            ? [{ name: "confirm", type: "password", placeholder: "Confirm Password" }]
            : [])
        ]}
      />

      <AuthSwitch
        text={isLogin ? "Don't have an account?" : "Already have an account?"}
        actionText={isLogin ? "Register" : "Login"}
        onClick={() =>
          navigate(isLogin ? "/register" : "/login")
        }
      />
    </>
  );
}