import { Link } from "react-router-dom";
import cartIcon from "../assets/icons/cart.svg";
import { ROUTES } from "../constants/routes";

export default function CartButton({ user }) {
  const count = user?.cart?.length || 0;

  return (
    <Link to={ROUTES.CART}>
      <button className="cart-button">
        <img src={cartIcon} alt="cart" className="cart-icon" />
        {count > 0 && <span className="cart-badge">{count}</span>}
      </button>
    </Link>
  );
}