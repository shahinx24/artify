import "../style/navbar.css";
import { useAuth } from "../../context/AuthContext";

export default function AdminNavbar() {
  const { auth, logout } = useAuth();

  return (
    <header className="admin-nav">
      <div className="admin-left">
        <h2>Admin Panel</h2>
      </div>

      <div className="admin-center">
        <span className="admin-email">
          {auth?.email?.split("@")[0]}
        </span>
        <button onClick={logout} className="admin-logout">
          Logout
        </button>
      </div>
    </header>
  );
}
