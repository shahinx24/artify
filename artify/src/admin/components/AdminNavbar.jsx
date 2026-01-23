import { Link, useNavigate } from "react-router-dom";
import "../style/navbar.css";

export default function AdminNavbar() {
  const navigate = useNavigate();
  const auth = JSON.parse(localStorage.getItem("auth"));

  const logout = () => {
    localStorage.removeItem("auth");
    navigate("/");
    window.location.reload();
  };

  return (
    <header className="admin-nav">
      <div className="admin-left">
        <h2>Admin Panel</h2>
      </div>

      <div className="admin-center">
        <span className="admin-email">
          {auth.email.split("@")[0]} 
        </span>
        <button onClick={logout} className="admin-logout">
          Logout
        </button>
      </div>
    </header>
  );
}