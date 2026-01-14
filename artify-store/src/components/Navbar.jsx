import { useLocation } from "react-router-dom";
import CartButton from "./CartButton.jsx";
import WishlistButton from "./WhishlistButton.jsx";

export default function Navbar({ scrollTo, setAuthMode }) {
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
        {isHome && (
          <>
            <button onClick={() => scrollTo("hero")} className="nav-btn">Home</button>
            <button onClick={() => scrollTo("categories")} className="nav-btn">Category</button>
            <button onClick={() => scrollTo("about")} className="nav-btn">About</button>
            <button onClick={() => scrollTo("about")} className="nav-btn">Contact</button>
          </>
        )}
      </nav>

      <div className="nav-icons">
        <WishlistButton />
        <CartButton />
        {user ? (
          <>
            <span>{user.email.split("@")[0]}</span>
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