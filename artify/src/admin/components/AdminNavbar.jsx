import { Link } from "react-router-dom";
import "../style/navbar.css"

export default function Navbar({ setAuthMode }) {
  const user = JSON.parse(localStorage.getItem("user"));

  const logout = () => {
    localStorage.removeItem("user");
    window.location.reload();
  };

  return (
    <header className="navbar">
        <div>
      <nav>
        <Link className="nav-btn" to="/"> Home </Link>
      </nav>

        {user ? (
          <>
            <span className="username-tag">{user.email.split("@")[0]}</span>
            <button onClick={()=>{
              localStorage.removeItem("admin");
              window.location.reload();
            }}>LOGOUT</button>
          </>
        ) : (
          <button onClick={()=>setAuthMode("login")}>LOGIN</button>
        )}
      </div>
    </header>
  );
}