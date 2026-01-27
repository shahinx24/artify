import { useLocation, useNavigate } from "react-router-dom";
import AuthPage from "../pages/auth/AuthPage";
import { ROUTES } from "../constants/routes";
import "./style/auth.css";

export default function AuthPanel({ showToast }) {
  const location = useLocation();
  const navigate = useNavigate();

  const isAuthRoute =
    location.pathname === ROUTES.LOGIN ||
    location.pathname === ROUTES.REGISTER;

  if (!isAuthRoute) return null;

  return (
    <>
      <div
        className="auth-overlay"
        onClick={() => navigate(ROUTES.HOME)}
      />

      <div className="auth-box">
        <button
          className="auth-close"
          onClick={() => navigate(ROUTES.HOME)}
        >
          ✖
        </button>

        <AuthPage showToast={showToast} />
      </div>
    </>
  );
}