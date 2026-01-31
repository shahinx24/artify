import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../services/api";
import { getUser, saveUser } from "../../utils/userHelpers";
import Search from "../../components/search/Search";
import "../style/product.css";
import useCart from "../hooks/useCart";
import { useAuth } from "../context/AuthContext";

export default function ProductsPage({ showToast }) {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { auth } = useAuth();


  useEffect(() => {
    api.get("/products").then(res => {
      const filtered = res.data.filter(
        p => p.category === category
      );
      setProducts(filtered);
    });
  }, [category]);

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const safeUser = user
    ? { ...user, cart: user.cart || [], wishlist: user.wishlist || [] }
    : null;


  const { addToCart } = useCart();

  const AddToCart = async (productId) => {
    try {
      await addToCart(productId);
      showToast("Added to cart");
    } catch (err) {
      showToast(err.message);
    }
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
    <div className="page-contents">
      
      <Search
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder={`Search in ${category}...`}
      />

      <h2
        className="section-title"
        style={{ marginTop: "6rem", textTransform: "capitalize" }}
      >
        {category} Items
      </h2>

      <div className="product-grid">
        {filteredProducts.map(p => (
          <div className="product-card" key={p.id}>
            <img
              src={p.image}
              alt={p.name}
              style={{ width: "100%", height: "200px", objectFit: "cover" }}
            />
            <div style={{ padding: "1rem" }}>
              <h3>{p.name}</h3>
              <p>₹{p.price}</p>

              <div className="btn-group">
                <button onClick={() => AddToCart(p.id)}>
                  Add to Cart
                </button>
                <button
                  className={`wishlist-btn ${isLiked(p.id) ? "wishlisted" : ""}`}
                  onClick={() => toggleWishlist(p.id)}
                >
                  ♥
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredProducts.length === 0 && (
          <p style={{ textAlign: "center", width: "100%" }}>
            No products found 😕
          </p>
        )}
      </div>
    </div>
  );
}