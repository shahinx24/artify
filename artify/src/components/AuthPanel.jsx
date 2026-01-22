import Login from "./auth/Login";
import Register from "./auth/Register";
import "./style/auth.css"

export default function AuthPanel({ authMode, setAuthMode, showToast }) {
  if (!authMode) return null;

  return (
    <div className="auth-box">
      <button className="auth-close" onClick={() => setAuthMode(null)}>✖</button>
      {authMode === "login" && (
        <Login setAuthMode={setAuthMode} showToast={showToast} />
      )}
      {authMode === "register" && (
        <Register setAuthMode={setAuthMode} showToast={showToast} />
      )}
    </div>
  );
}
