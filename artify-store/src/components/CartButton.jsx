import { getUser } from "../utils/userHelpers";
import { Link } from "react-router-dom";
import cartIcon from "../assets/icons/cart.svg";

export default function CartButton() {
  const user = getUser();
  const count = user?.cart?.reduce((sum, item) => sum + (item.qty || 1), 0) || 0;

  return (
    <Link to="/cart">
      <button className="cart-button">
        <img src={cartIcon} alt="cart" className="cart-icon" />
        {count > 0 && <span className="cart-badge">{count}</span>}
      </button>
    </Link>
  );
}