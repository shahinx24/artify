import { getUser } from "../utils/userHelpers";
import { Link } from "react-router-dom";
import wishlist from "../assets/icons/wishlist.svg";

export default function WishlistButton() {
  const [user, setUser] = useState(null);

    useEffect(() => {
      getUser().then(u => setUser(u));
    }, []);
  const count = user?.wishlist?.length || 0;

  return (
    <Link to="/wishlist">
      <button className="wishlist-button">
        <img src={wishlist} alt="wishlist" className="wishlist-icon" />
        {count > 0 && <span className="wishlist-badge">{count}</span>}
      </button>
    </Link>
  );
}