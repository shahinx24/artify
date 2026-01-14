import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { getUser, saveUser } from "../utils/userHelpers";

export default function ProductsPage({ showToast }) {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState(getUser());

  useEffect(() => {
    axios.get("http://localhost:3000/products")
      .then(res => setProducts(res.data.filter(p => p.category === category)));
  }, [category]);

  // ADD TO CART
  const addToCart = async (product) => {
    if (!user) return showToast("Login required");

    const updated = { ...user };
    
    const exist = updated.cart.find(item => item.id === product.id);

    if (exist) {
      exist.qty = (exist.qty || 1) + 1;
    } else {
      updated.cart.push({ ...product, qty: 1 });
    }

    await saveUser(updated);
    setUser(updated);
    showToast("Added to cart!");
  };

  // TOGGLE WISHLIST
  const toggleWishlist = async (id) => {
    if (!user) return showToast("Login required");

    const updated = { ...user };

    if (updated.wishlist.includes(id)) {
      updated.wishlist = updated.wishlist.filter(pid => pid !== id);
    } else {
      updated.wishlist.push(id);
    }

    await saveUser(updated);
    setUser(updated);
  };

  const isLiked = (id) => user && user.wishlist.includes(id);

  return (
    <div className="page-content">
      <h2 className="section-title" style={{ marginTop: "6rem", textTransform: "capitalize" }}>
        {category} Items
      </h2>

      <div className="product-grid">
        {products.map(p => (
          <div className="product-card" key={p.id}>
            <img
              src={p.image}
              alt={p.name}
              style={{
                width: "100%",
                height: "200px",
                objectFit: "cover"
              }}
            />
            <div style={{ padding: "1rem" }}>
              <h3>{p.name}</h3>
              <p>₹{p.price}</p>

              <div className="btn-group">
                <button onClick={() => addToCart(p)}>
                  Add to Cart
                </button>

                <button
                  className={`wishlist-btn ${isLiked(p.id) ? "wishlisted" : ""}`}
                  onClick={() => toggleWishlist(p.id)}
                  title="Add to Wishlist"
                >
                  ♥
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}