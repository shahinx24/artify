import { Link } from "react-router-dom";
import cart from "../assets/icons/cart.svg";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";

export default function CartButton() {
  const { displayCount } = useContext(CartContext);

  return (
    <Link to="/cart" className="cart-button">
      <img src={cart} alt="Cart" className="cart-icon" />
      {displayCount > 0 && (
        <span className="cart-badge">{displayCount}</span>
      )}
    </Link>
  );
}