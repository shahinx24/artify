import { Link } from "react-router-dom";
import wishlist from "../assets/icons/wishlist.svg";
import { useContext } from "react";
import { WishlistContext } from "../context/WishlistContext";

export default function Wishlist() {
  const { displayCount } = useContext(WishlistContext);

  return (
    <Link to="/wishlist" className="wishlist-icon">
      <img src={wishlist} alt="wishlist" className="wishlist-icon" />
      {displayCount > 0 && (
        <span className="wishlist-badge">{displayCount}</span>
      )}
    </Link>
  );
}