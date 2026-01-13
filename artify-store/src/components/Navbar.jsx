import { useLocation } from "react-router-dom";
import CartButton from "./CartButton.jsx";
import WishlistButton from "./WhishlistButton.jsx";
import ThemeButton from "./ThemeButton.jsx";
import { useState } from "react";

export default function Navbar({ scrollTo },{ setAuthMode }) {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const [authMode, setAuthMode] = useState(null); 
// null | "login" | "register" | "forgot" | "otp" | "reset"
  
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
        <ThemeButton />
        <WishlistButton />
        <CartButton />
        <button onClick={() => setAuthMode("login")}>LOGIN</button>
      </div>
    </header>
  );
}