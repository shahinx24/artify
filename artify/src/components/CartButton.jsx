import { Link } from "react-router-dom";
import cartIcon from "../assets/icons/cart.svg";
import { useAuth } from "../context/AuthContext";
import useCart from "../hooks/useCart";

export default function CartButton() {
  const { auth } = useAuth();
  const { cartItems } = useCart();

  if (!auth) return null;

  const count = cartItems.reduce((total, item) => total + item.qty, 0);

  return (
    <Link to="/cart">
      <button className="cart-button">
        <img src={cartIcon} alt="cart" className="cart-icon" />
        {count > 0 && <span className="cart-badge">{count}</span>}
      </button>
    </Link>
  );
}
