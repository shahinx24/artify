import { ROUTES } from "../constants/routes";
import { Link } from "react-router-dom";
import wishlist from "../assets/icons/wishlist.svg";

export default function WishlistButton({user}) {
  const count = user?.cart?.length || 0;

  return (
    <Link to={ROUTES.WISHLIST}>
      <button className="wishlist-button">
        <img src={wishlist} alt="wishlist" className="wishlist-icon" />
        {count > 0 && <span className="wishlist-badge">{count}</span>}
      </button>
    </Link>
  );
}