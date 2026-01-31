import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../style/wishlist.css";
import { getWishlistProducts } from "../../services/productService";
import { useAuth } from "../../context/AuthContext";
import useCart from "../../hooks/useCart";
import { saveUser } from "../../services/userService";

export default function WishlistPage({ showToast }) {
  const { auth, updateAuth } = useAuth();
  const { addToCart } = useCart();

  const [products, setProducts] = useState([]);

  const wishlist = auth?.wishlist || [];

  // 🚀 Load wishlist products
  useEffect(() => {
    const loadWishlist = async () => {
      if (!wishlist.length) {
        setProducts([]);
        return;
      }

      try {
        const res = await getWishlistProducts(wishlist);
        setProducts(res);
      } catch (err) {
        console.error("Failed to load wishlist", err);
      }
    };

    loadWishlist();
  }, [wishlist]);

  // 🔒 Not logged in
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

  const removeFromWishlist = async (productId) => {
    const updatedUser = {
      ...auth,
      wishlist: auth.wishlist.filter(
        id => Number(id) !== Number(productId)
      ),
    };

    await saveUser(updatedUser);   // backend
    updateAuth(updatedUser);       // context

    showToast("Removed from wishlist");
  };

  //  Move to cart
  const moveToCart = async (productId) => {
    const cart = auth.cart || [];

    const updatedCart = [...cart];
    const existing = updatedCart.find(
      i => Number(i.productId) === Number(productId)
    );

    if (existing) {
      existing.qty += 1;
    } else {
      updatedCart.push({ productId, qty: 1 });
    }

    const updatedUser = {
      ...auth,
      cart: updatedCart,
      wishlist: auth.wishlist.filter(
        id => Number(id) !== Number(productId)
      ),
    };

    await saveUser(updatedUser);
    updateAuth(updatedUser);

    showToast("Moved to cart");
  };

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