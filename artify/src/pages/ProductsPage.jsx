import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { getUser, saveUser } from "../utils/userHelpers";
import "./style/product.css"
import { ENV } from "../constants/env";

export default function ProductsPage({ showToast }) {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState(getUser());

  useEffect(() => {
    axios.get("http://localhost:3000/products")
      .then(res => setProducts(res.data.filter(p => p.category === category)));
  }, [category]);

  const safeUser = user ? {
    ...user, cart: user.cart || [], wishlist: user.wishlist || []
  } : null;

  const addToCart = async (productId) => {
    const auth = JSON.parse(localStorage.getItem("auth"));
    if (!auth) return showToast("Login required");

    const res = await fetch(`${ENV.API_BASE_URL}/users/${auth.id}`);
    const user = await res.json();
    const exists = user.cart.find(
      item => item.productId === productId
    );
    let updatedCart;

    if (exists) {
      updatedCart = user.cart.map(item =>
        item.productId === productId
          ? { ...item, qty: item.qty + 1 }
          : item
      );
    } else {
      updatedCart = [
        ...user.cart,
        { productId: String(productId), qty: 1 }
      ];
    }
    const updatedUser = { ...user, cart: updatedCart };

    await fetch(`${ENV.API_BASE_URL}/users/${auth.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedUser)
    });

    localStorage.setItem("auth", JSON.stringify(updatedUser));
    showToast("Added to cart");
  };

  const toggleWishlist = async (id) => {
    if (!safeUser) return showToast("Login required!");

    const updated = { ...safeUser };
    updated.wishlist = updated.wishlist.includes(id)
      ? updated.wishlist.filter(w => w !== id)
      : [...updated.wishlist, id];

    await saveUser(updated);
    setUser(updated);
    showToast("Added to wishlist!");
  };

  const isLiked = (id) => user?.wishlist?.includes(id);

  return (
    <div className="page-content">
      <h2 className="section-title" style={{ marginTop: "6rem", textTransform:"capitalize" }}>
        {category} Items
      </h2>

      <div className="product-grid">
        {products.map(p => (
          <div className="product-card" key={p.id}>
            <img src={p.image} alt={p.name} style={{ width:"100%", height:"200px", objectFit:"cover" }} />
            <div style={{ padding:"1rem" }}>
              <h3>{p.name}</h3>
              <p>₹{p.price}</p>

              <div className="btn-group">
                <button onClick={() => addToCart(p.id)}>Add to Cart</button>
                <button
                  className={`wishlist-btn ${isLiked(p.id) ? "wishlisted" : ""}`}
                  onClick={()=>toggleWishlist(p.id)}
                >♥</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}