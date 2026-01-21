import { Link } from "react-router-dom";

export default function NotFound() {

  return (
    <div className="page-content" style={{ marginTop: "6rem", textAlign: "center" }}>
      <h1>404 Not Found</h1>
        <p>Page not found !</p>
      <Link to="/" className="checkout-btn" style={{ display: "inline-block", marginTop: "1rem" }}>
        Go Home
      </Link>
    </div>
  );
}