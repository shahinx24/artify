import { Link } from "react-router-dom";
import wishlist from "../assets/icons/wishlist.svg";
import { useContext } from "react";
import { WishlistContext } from "../context/WishlistContext";

export default function Wishlist() {
  const { displayWishlistCount } = useContext(WishlistContext);

  return (
     <Link to="/wishlist" className="wishlist-button">
      <img src={wishlist} alt="Wishlist" className="wishlist-icon" />
      {displayWishlistCount > 0 && (
        <span className="wishlist-badge">{displayWishlistCount}</span>
      )}
    </Link>
  );
}