import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
// import axios from "axios";
import { getUser, saveUser } from "../../utils/userHelpers";
import { ENV } from "../../constants/env";

export default function ProductsPage({ showToast }) {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState(getUser());

    useEffect(() => {
    fetch(`${ENV.API_BASE_URL}/products?category=${category}`)
      .then(res => res.json())
      .then(setProducts);
  }, [category]);

  const safeUser = user ? {
    ...user,
    cart: user.cart || [],
    wishlist: user.wishlist || []
  } : null;

  const addToCart = async (product) => {
    if (!safeUser) return showToast("Login required!");

    const updated = { ...safeUser };
    const exist = updated.cart.find(i => i.id === product.id);
    exist ? exist.qty++ : updated.cart.push({ ...product, qty: 1 });

    await saveUser(updated);
    setUser(updated);
    showToast("Added to cart!");
  };

  const toggleWishlist = async (id) => {
    if (!safeUser) return showToast("Login required!");

    const updated = { ...safeUser };
    updated.wishlist = updated.wishlist.includes(id)
      ? updated.wishlist.filter(w => w !== id)
      : [...updated.wishlist, id];

    await saveUser(updated);
    setUser(updated);
  };

  const isLiked = (id) => safeUser?.wishlist?.includes(id);

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
                <button onClick={()=>addToCart(p)}>Add to Cart</button>
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