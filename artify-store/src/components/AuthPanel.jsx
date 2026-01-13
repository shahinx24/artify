import Login from "./auth/Login";
import Register from "./auth/Register";
import Forgot from "./auth/Forgot";
import Otp from "./auth/Otp";
import ResetPass from "./auth/ResetPass";

export default function AuthPanel({ authMode, setAuthMode }) {
  if (!authMode) return null;

  return (
    <div className="auth-box">
      {authMode === "login" && <Login setAuthMode={setAuthMode} />}
      {authMode === "register" && <Register setAuthMode={setAuthMode} />}
      {authMode === "forgot" && <Forgot setAuthMode={setAuthMode} />}
      {authMode === "otp" && <Otp setAuthMode={setAuthMode} />}
      {authMode === "reset" && <ResetPass setAuthMode={setAuthMode} />}
    </div>
  );
}