import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="page-contents">
      <h1>404 Not Found</h1>
        <p>Page not found !</p>
      <Link to="/" className="checkout-btn">Go Home</Link>
    </div>
  );
}