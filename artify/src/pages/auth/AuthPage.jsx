import { useLocation, useNavigate } from "react-router-dom";
import AuthForm from "../../components/auth/AuthForm";
import AuthSwitch from "../../components/auth/AuthSwitch";
import { useAuth } from "../../hooks/useAuth";

export default function AuthPage({ showToast }) {
  const { form, handleChange, login, register } = useAuth(showToast);
  const location = useLocation();
  const navigate = useNavigate();

  const isLogin = location.pathname === "/login";

  return (
    <div className="auth-page">
      <AuthForm
        title={isLogin ? "Welcome Back" : "Create Account"}
        buttonText={isLogin ? "LOGIN" : "REGISTER"}
        onSubmit={isLogin ? login : register}
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
        onClick={() => navigate(isLogin ? "/register" : "/login")}
      />
    </div>
  );
}