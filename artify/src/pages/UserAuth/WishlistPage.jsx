import { useEffect, useState } from "react";
import api from "../../services/api";
import { getUser, saveUser } from "../../utils/userHelpers";
import { Link } from "react-router-dom";
import "../style/wishlist.css";

export default function WishlistPage({ showToast }) {
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState(null);

  const auth = JSON.parse(localStorage.getItem("auth"));

  useEffect(() => {
    const u = getUser();
    if (u) {
      setUser({
        ...u,
        cart: u.cart || [],
        wishlist: u.wishlist || []
      });
    }
  }, []);

  useEffect(() => {
    if (!user?.wishlist?.length) {
      setProducts([]);
      return;
    }

    api.get("/products").then(res => {
      const filtered = res.data.filter(p =>
        user.wishlist.some(id => Number(id) === Number(p.id))
      );
      setProducts(filtered);
    });
  }, [user]);


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

  if (!user) return null;

  const removeFromWishlist = async (id) => {
    const updated = {
      ...user,
      wishlist: user.wishlist.filter(
        pid => Number(pid) !== Number(id)
      )
    };

    await saveUser(updated);
    setUser(updated);
    showToast("Removed from wishlist");
  };

  const addToCart = async (productId) => {
    const updated = {
      ...user,
      cart: user.cart || []
    };

    // remove from wishlist
    updated.wishlist = updated.wishlist.filter(
      pid => Number(pid) !== Number(productId)
    );

    // add to cart
    const exist = updated.cart.find(
      item => Number(item.productId) === Number(productId)
    );

    if (exist) {
      exist.qty += 1;
    } else {
      updated.cart.push({
        productId: Number(productId),
        qty: 1
      });
    }

    await saveUser(updated);
    setUser(updated);
    showToast("Moved to Cart");
  };

    if (user.wishlist.length === 0) {
      return (
        <div className="page-contents" >
          <h2>Your wishlist is empty ❤️</h2>
          <p>Add some art supplies to get started!</p>
          <Link
            to="/" className="checkout-btn" >
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
              <button onClick={() => addToCart(p.id)}>Add to Cart</button>
              <button onClick={() => removeFromWishlist(p.id)}>Remove</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}