import { Link } from "react-router-dom";

export default function CartButton() {
  return (
    <Link to="/cart" style={{ position: "absolute", top: "20px", right: "20px", textDecoration: "none" }}>
      🛒
    </Link>
  );
}
