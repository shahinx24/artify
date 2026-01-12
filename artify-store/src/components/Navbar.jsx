import { useLocation } from "react-router-dom";
import CartButton from "./CartButton.jsx";
import WishlistButton from "./WhishlistButton.jsx";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext.jsx";

export default function Navbar({ scrollTo }) {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const { theme, toggleTheme } = useContext(ThemeContext);
  
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
        <button onClick={toggleTheme} className="theme-btn">
          {theme === "dark" ? "🌕" : "🌑"}
        </button>
        <WishlistButton />
        <CartButton />
      </div>
    </header>
  );
}