// import { useAuth } from "../hooks/useAuth";
// import AuthForm from "../components/auth/AuthForm";
// import AuthSwitch from "../components/auth/AuthSwitch";

import AuthForm from "../../components/form/AuthForm";
import AuthSwitch from "../../components/form/AuthSwitch";
import { useAuth } from "../../hooks/useAuth";

export default function AuthPage({ mode, setAuthMode, showToast }) {
  const { form, handleChange, login, register } =
    useAuth(showToast, setAuthMode);

  const isLogin = mode === "login";

  return (
    <>
      <AuthForm
        title={isLogin ? "Welcome Back" : "Create Account"}
        buttonText={isLogin ? "LOGIN" : "REGISTER"}
        onSubmit={isLogin ? login : register}
        onChange={handleChange}
        fields={[
          { name: "email", type: "email", placeholder: "Email" },
          { name: "pass", type: "password", placeholder: "Password" },
          ...(!isLogin
            ? [{ name: "confirm", type: "password", placeholder: "Confirm Password" }]
            : []),
        ]}
      />

      <AuthSwitch
        text={isLogin ? "Don't have an account?" : "Already have an account?"}
        actionText={isLogin ? "Register" : "Login"}
        onClick={() => setAuthMode(isLogin ? "register" : "login")}
      />
    </>
  );
}