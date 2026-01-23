import { useEffect, useState } from "react";
import axios from "axios";
import { getUser, saveUser } from "../utils/userHelpers";
import { Link } from "react-router-dom";

export default function WishlistPage({ showToast }) {
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState(getUser());

  useEffect(() => {
    if (user?.wishlist.length) {
      axios.get("http://localhost:3000/products")
        .then(res => {
          const filtered = res.data.filter(p => user.wishlist.includes(p.id));
          setProducts(filtered);
        });
    } else {
      setProducts([]);
    }
  }, [user]);

  const removeFromWishlist = async (id) => {
    if (!user) return;
  const updated = { ...user };
    updated.wishlist = updated.wishlist.filter(pid => pid !== id);

    setProducts(prev => prev.filter(p => p.id !== id));

    await saveUser(updated);
    setUser(updated);
    showToast("Removed from wishlist");
  };
  
  const addToCart = async (productId) => {
    const auth = JSON.parse(localStorage.getItem("auth"));
    if (!auth) return showToast("Login required");

    // fetch user from DB
    const res = await fetch(`${ENV.API_BASE_URL}/users/${auth.id}`);
    const user = await res.json();
    const updated = { ...user };

    // remove from wishlist
    updated.wishlist = updated.wishlist.filter(pid => pid !== productId);
    // add to cart
    const exist = updated.cart.find(item => item.productId === productId);

    if (exist) {
      exist.qty += 1;
    } else {
      updated.cart.push({ productId, qty: 1 });
    }

    // save back to DB
    await fetch(`${ENV.API_BASE_URL}/users/${auth.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated)
    });

    setUser(updated);
    setProducts(prev => prev.filter(p => p.id !== productId));
    showToast("Moved to Cart");
  };
  
    if (!user) {
      return (
        <div className="page-content" style={{ marginTop: "6rem", textAlign: "center" }}>
          <h2>Please login to view your wishlist</h2>
          <Link to="/" className="checkout-btn" style={{ display: "inline-block", marginTop: "1rem" }}>
            Go Home
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
            <button
              className="move-btn"
              onClick={() => addToCart(p.id)}
            >
              Add to Cart
            </button>
            <button
              className="remove-btn"
              onClick={() => removeFromWishlist(p.id)}
            >
              Remove
            </button>
          </div>
        </div>
      ))}

      {products.length === 0 && (
        <p className="empty-cart" style={{ gridColumn: "1 / -1" }}>
          No wishlist items yet
        </p>
      )}
    </div>
  </div>
);
}