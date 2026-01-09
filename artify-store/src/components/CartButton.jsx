import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import cart from "../assets/icons/cart.svg";
import { Link } from "react-router-dom";

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