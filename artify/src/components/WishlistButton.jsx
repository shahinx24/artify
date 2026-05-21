import { Link } from "react-router-dom";
import wishlist from "../assets/icons/wishlist.svg";
import { useAuth } from "../context/AuthContext";

export default function WishlistButton() {
  const { auth } = useAuth();

  if (!auth) return null;

  const count = auth.wishlist?.length || 0;

  return (
    <Link to="/wishlist">
      <button className="wishlist-button">
        <img src={wishlist} alt="wishlist" className="wishlist-icon" />
        {count > 0 && <span className="wishlist-badge">{count}</span>}
      </button>
    </Link>
  );
}