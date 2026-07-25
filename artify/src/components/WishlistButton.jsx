import { Link } from "react-router-dom";
import wishlist from "../assets/icons/wishlist.svg";
import { useAuth } from "../context/AuthContext";
import useWishlist from "../hooks/useWishlist";

export default function WishlistButton() {
  const { auth } = useAuth();
  const { wishlist: wishlistItems } = useWishlist();

  if (!auth) return null;

  const count = wishlistItems.length;

  return (
    <Link to="/wishlist">
      <button className="wishlist-button">
        <img src={wishlist} alt="wishlist" className="wishlist-icon" />
        {count > 0 && <span className="wishlist-badge">{count}</span>}
      </button>
    </Link>
  );
}
