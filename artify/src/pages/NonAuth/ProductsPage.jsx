import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../services/api";
import Search from "../../components/search/Search";
import "../style/product.css";
import { saveUser } from "../../services/userService";
import useCart from "../../hooks/useCart";
import { useAuth } from "../../context/AuthContext";

export default function ProductsPage({ showToast }) {
  const { category } = useParams();

  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const { auth, updateAuth } = useAuth();
  const { addToCart } = useCart();

  //  Load products by category
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

  // 🛒 Add to cart
  const handleAddToCart = async (productId) => {
    try {
      await addToCart(productId);
      showToast("Added to cart");
    } catch (err) {
      showToast(err.message);
    }
  };

  // ❤️ Toggle wishlist
  const toggleWishlist = async (productId) => {
    if (!auth) return showToast("Login required!");

    const wishlist = auth.wishlist || [];

    const updatedUser = {
      ...auth,
      wishlist: wishlist.includes(productId)
        ? wishlist.filter(id => Number(id) !== Number(productId))
        : [...wishlist, productId],
    };

    await saveUser(updatedUser);
    updateAuth(updatedUser);

    showToast(
      wishlist.includes(productId)
        ? "Removed from wishlist"
        : "Added to wishlist"
    );
  };

  const isLiked = (id) => auth?.wishlist?.includes(id);

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
                <button onClick={() => handleAddToCart(p.id)}>
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