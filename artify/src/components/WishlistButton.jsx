import { getUser } from "../utils/userHelpers";
import { Link } from "react-router-dom";
import wishlist from "../assets/icons/wishlist.svg";
import { useEffect, useState } from "react";

export default function WishlistButton() {
  const [count, setCount] = useState(0);

  const updateCount = () => {
    const user = getUser();
    setCount(user?.wishlist?.length || 0);
  };

  useEffect(() => {
    updateCount();

    window.addEventListener("cart-change", updateCount);

    return () => window.removeEventListener("cart-change", updateCount);
  }, []);

  return (
    <Link to="/wishlist">
      <button className="wishlist-button">
        <img src={wishlist} alt="wishlist" className="wishlist-icon" />
        {count > 0 && <span className="wishlist-badge">{count}</span>}
      </button>
    </Link>
  );
}
