import { useLocation, Link, useNavigate } from "react-router-dom";
import CartButton from "./CartButton.jsx";
import WishlistButton from "./WishlistButton.jsx";
import { getUser, logoutUser } from "../utils/userHelpers";
import { ROUTES } from "../constants/routes";

export default function Navbar() {
  const user = getUser();
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === ROUTES.HOME;

  return (
    <header className="top-nav">
      <nav>

        <Link className="nav-btn" to={ROUTES.HOME}> Home </Link>

        {isHome && (
          <>
            <button
              className="nav-btn"
              onClick={() =>
                document
                  .getElementById("categories")
                  ?.scrollIntoView({ behavior: "smooth" })
            }> Category </button>
            <button
              className="nav-btn"
              onClick={() =>
                document
                  .getElementById("about")
                  ?.scrollIntoView({ behavior: "smooth" })
              }> About </button>
            <button
              className="nav-btn"
              onClick={() =>
                document
                  .getElementById("about")
                  ?.scrollIntoView({ behavior: "smooth" })
              }> Contact </button>

            {user && (
              <button onClick={() => navigate(ROUTES.ORDERS)}>
                Orders
              </button>
            )}
          </>
        )}
      </nav>

      <div className="nav-icons">
        <WishlistButton />
        <CartButton />

        {user ? (
          <>
            <span className="username-tag">
              {user.email.split("@")[0]}
            </span>
            <button onClick={logoutUser}>LOGOUT</button>
          </>
        ) : (
          <button onClick={() => navigate(ROUTES.LOGIN)}>
            LOGIN
          </button>
        )}
      </div>
    </header>
  );
}