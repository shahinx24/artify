import { getUser } from "../utils/userHelpers";
import { Link } from "react-router-dom";
import cartIcon from "../assets/icons/cart.svg";
import { useEffect, useState } from "react";

export default function CartButton() {
  const [count, setCount] = useState(0);

  const updateCount = () => {
    const user = getUser();
    const c = user?.cart?.reduce((a, i) => a + i.qty, 0) || 0;
    setCount(c);
  };

   useEffect(() => {
      updateCount();

      window.addEventListener("cart-change", updateCount);

      return () => window.removeEventListener("cart-change", updateCount);
    }, []);

  return (
    <Link to="/cart">
      <button className="cart-button">
        <img src={cartIcon} alt="cart" className="cart-icon" />
        {count > 0 && <span className="cart-badge">{count}</span>}
      </button>
    </Link>
  );
}