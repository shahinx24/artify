import { Link } from "react-router-dom";
import "../style/wishlist.css";
import { useAuth } from "../../context/AuthContext";
import useWishlist from "../../hooks/useWishlist";

export default function WishlistPage({ showToast }) {
  const { auth } = useAuth();
  const {
    wishlist,
    products,
    loading,
    removeFromWishlist,
    moveToCart,
  } = useWishlist(showToast);

  // Not logged in
  if (!auth) {
    return (
      <div
        className="page-contents"
        style={{ marginTop: "6rem", textAlign: "center" }}
      >
        <h2>Please login to view your wishlist</h2>
        <Link to="/" className="checkout-btn">Go Home</Link>
      </div>
    );
  }

  // Empty wishlist
  if (wishlist.length === 0) {
    return (
      <div className="page-contents">
        <h2>Your wishlist is empty ❤️</h2>
        <p>Add some art supplies to get started!</p>
        <Link to="/" className="checkout-btn">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <div className="wishlist-items">
        {products.map(p => (
          <div className="wishlist-item" key={p.id}>
            <img src={p.image} alt={p.name} />

            <div className="wishlist-info">
              <h3>{p.name}</h3>
              <p>₹{p.price}</p>
            </div>

            <div className="wishlist-actions">
              <button onClick={() => moveToCart(p.id)}>
                Move to Cart
              </button>

              <button onClick={() => removeFromWishlist(p.id)}>
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}