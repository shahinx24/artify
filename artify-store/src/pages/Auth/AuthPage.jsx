import { useLocation, useNavigate } from "react-router-dom";

import AuthForm from "../../components/form/AuthForm";
import AuthSwitch from "../../components/form/AuthSwitch";
import { useAuth } from "../../hooks/useAuth";
import { ROUTES } from "../../constants/routes";

export default function AuthPage({ showToast }) {
  const location = useLocation();
  const navigate = useNavigate();

  // decide mode from URL
  const isLogin = location.pathname === ROUTES.LOGIN;

  const { handleChange, login, register } =
    useAuth(showToast);

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
            ? [
                {
                  name: "confirm",
                  type: "password",
                  placeholder: "Confirm Password",
                },
              ]
            : []),
        ]}
      />

      <AuthSwitch
        text={isLogin ? "Don't have an account?" : "Already have an account?"}
        actionText={isLogin ? "Register" : "Login"}
        onClick={() =>
          navigate(isLogin ? ROUTES.REGISTER : ROUTES.LOGIN)
        }
      />
    </>
  );
}