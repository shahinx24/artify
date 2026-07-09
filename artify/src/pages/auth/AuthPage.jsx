import { useLocation, useNavigate } from "react-router-dom";
import AuthForm from "../../components/form/AuthForm";
import AuthSwitch from "../../components/form/AuthSwitch";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import { loginUser, registerUser } from "../../services/authServices";
import { API_BASE_URL } from "../../constants/api";

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
    try {
      if (isLogin) {
        const user = await loginUser(form);
        login(user);
      } else {
        await registerUser(form);
        showToast?.("Registered successfully", "success");
        navigate("/login");
      }
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        `Cannot reach the server at ${API_BASE_URL}`;
      console.error("Auth request failed", error);
      showToast?.(message, "error");
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
