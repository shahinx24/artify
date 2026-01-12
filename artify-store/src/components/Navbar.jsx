import { useLocation } from "react-router-dom";
import CartButton from "./CartButton.jsx";

export default function Navbar({ scrollTo }) {
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
            <button onClick={() => scrollTo("contact")} className="nav-btn">Contact</button>
          </>
        )}
      </nav>
      {/* Cart ALWAYS visible */}
      <CartButton />
    </header>
  );
}