import { getUser } from "../utils/userHelpers";
import { Link } from "react-router-dom";
import cartIcon from "../assets/icons/cart.svg";
import { useEffect, useState } from "react";

export default function CartButton() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const u = getUser();
    if (u) {
      setUser(u);
    }
  }, []);

  const count = user?.cart?.reduce((a, i) => a + i.qty, 0) || 0;

  return (
    <Link to="/cart">
      <button className="cart-button">
        <img src={cartIcon} alt="cart" className="cart-icon" />
        {count > 0 && <span className="cart-badge">{count}</span>}
      </button>
    </Link>
  );
}