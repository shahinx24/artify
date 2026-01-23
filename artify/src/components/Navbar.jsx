import { useLocation } from "react-router-dom";
import CartButton from "./CartButton.jsx";
import WishlistButton from "./WishlistButton.jsx";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./style/navbar.css"

export default function Navbar({ setAuthMode }) {
  // const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const auth = JSON.parse(localStorage.getItem("auth"));

  const logout = () => {
    localStorage.removeItem("auth");
    navigate("/"); 
    window.location.reload();
  };

  const location = useLocation();
  const isHome = location.pathname === "/";
  if (auth?.role === "admin") return null;

  return (
    <header className="top-nav">
      <nav>
        <Link className="nav-btn" to="/"> Home </Link>
        {isHome && (
          <>
            <button onClick={() => document.getElementById("categories")?.scrollIntoView({behavior:"smooth"})} className="nav-btn">Category</button>
            <button onClick={() => document.getElementById("about")?.scrollIntoView({behavior:"smooth"})} className="nav-btn">About</button>
            <button onClick={() => document.getElementById("about")?.scrollIntoView({behavior:"smooth"})} className="nav-btn">Contact</button>
            {auth?.role === "user" && (
              <button onClick={() => navigate("/orders")}>
                Orders
              </button>
            )}
          </>
        )}
      </nav>

      
      <div className="nav-icons">
         {auth?.role === "user" && (
          <>
            <WishlistButton />
            <CartButton />
          </>
        )}
        {auth ? (
          <>
            <span className="username-tag">
              {auth.email.split("@")[0]} 
            </span>
            <button onClick={logout}>LOGOUT</button>
          </>
        ) : (
          <button onClick={() => setAuthMode("login")}>LOGIN</button>
        )}
      </div>
    </header>
  );
}