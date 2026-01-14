import { useLocation } from "react-router-dom";
import CartButton from "./CartButton.jsx";
import WishlistButton from "./WhishlistButton.jsx";
import { Link } from "react-router-dom";

export default function Navbar({ setAuthMode }) {
  const user = JSON.parse(localStorage.getItem("user"));

  const logout = () => {
    localStorage.removeItem("user");
    window.location.reload();
  };
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <header className="top-nav">
      <nav>
           <button><Link className="nav-btn" to="/">Home</Link></button>
        {isHome && (
          <>
            <button onClick={() => document.getElementById("categories")?.scrollIntoView({behavior:"smooth"})} className="nav-btn">Category</button>
            <button onClick={() => document.getElementById("about")?.scrollIntoView({behavior:"smooth"})} className="nav-btn">About</button>
            <button onClick={() => document.getElementById("about")?.scrollIntoView({behavior:"smooth"})} className="nav-btn">Contact</button>
          </>
        )}
      </nav>

      <div className="nav-icons">
        <WishlistButton />
        <CartButton />
        {user ? (
          <>
            <span className="username-tag">{user.email.split("@")[0]}</span>
            <button onClick={()=>{
              localStorage.removeItem("user");
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