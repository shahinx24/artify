import Login from "./auth/Login";
import Register from "./auth/Register";

export default function AuthPanel({ authMode, setAuthMode }) {
  if (!authMode) return null;

  return (
    <div className="auth-box">
      <button className="auth-close" onClick={()=>setAuthMode(null)}>✖</button>

      {authMode === "login" && <Login setAuthMode={setAuthMode} />}
      {authMode === "register" && <Register setAuthMode={setAuthMode} />}
    </div>
  );
}