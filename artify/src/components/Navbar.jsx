import { useLocation, useNavigate, Link } from "react-router-dom";
import CartButton from "./CartButton.jsx";
import WishlistButton from "./WishlistButton.jsx";
import "./style/navbar.css";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { auth, loading, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === "/";

  if (loading) return null;
  if (auth?.role === "admin") return null;

  return (
    <header className="top-nav">
      <nav>
        <Link className="nav-btn" to="/">Home</Link>

        {isHome && (
          <>
            <button
              className="nav-btn" onClick={() =>
                document .getElementById("categories")
                  ?.scrollIntoView({ behavior: "smooth" })
              } >
              Category
            </button>

            <button
              className="nav-btn" onClick={() =>
                document .getElementById("about")
                  ?.scrollIntoView({ behavior: "smooth" })
              } >
              About
            </button>

            <button
              className="nav-btn" onClick={() =>
                document .getElementById("contact")
                  ?.scrollIntoView({ behavior: "smooth" })
              } >
              Contact
            </button>

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
          <button onClick={() => navigate("/login")}>
            LOGIN
          </button>
        )}
      </div>
    </header>
  );
}