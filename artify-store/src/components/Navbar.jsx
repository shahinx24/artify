import { Link } from "react-router-dom";
import CartButton from "./CartButton.jsx";

export default function Navbar({ scrollTo }) {
  return (
    <header className="top-nav">
      <nav>
        <button onClick={() => scrollTo("hero")} className="nav-btn">Home</button>
        <button onClick={() => scrollTo("categories")} className="nav-btn">Category</button>
        <button onClick={() => scrollTo("about")} className="nav-btn">About</button>
        <button onClick={() => scrollTo("contact")} className="nav-btn">Contact</button>
      </nav>
      <CartButton />
    </header>
  );
}