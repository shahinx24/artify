import { useParams } from "react-router-dom";
import { useState } from "react";
import Search from "../../components/search/Search";
import "../style/product.css";
import useCart from "../../hooks/useCart";
import { useAuth } from "../../context/AuthContext";
import useProducts from "../../hooks/useProducts";
import useWishlist from "../../hooks/useWishlist";

export default function ProductsPage({ showToast }) {
  const { category } = useParams();
  const { products } = useProducts({ category });
  const [searchTerm, setSearchTerm] = useState("");
  const { auth } = useAuth();
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist(showToast);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddToCart = async (productId) => {
    try {
      await addToCart(productId);
      showToast("Added to cart");
    } catch (err) {
      showToast(err.message);
    }
  };

  const handleWishlist = (productId) => {
    if (!auth) return showToast("Login required!");
    return toggleWishlist(productId);
  };

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
        {filteredProducts.map((product) => (
          <div className="product-card" key={product.id}>
            <img
              src={product.image?.url}
              alt={product.name}
            />

            <div className="product-info">
              <div className="product-header">
                <button
                  className={`wishlist-btn ${isWishlisted(product.id) ? "wishlisted" : ""
                    }`}
                  onClick={() => handleWishlist(product.id)}
                >
                  {isWishlisted(product.id) ? "♥" : "♡"}
                </button>

                <div className="product-details">
                  <h3>{product.name}</h3>
                  <p>
                    <span>Rs</span> {product.price}
                  </p>
                </div>
              </div>

              <button
                className="add-cart-btn"
                onClick={() => handleAddToCart(product.id)}
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}

        {filteredProducts.length === 0 && (
          <p style={{ textAlign: "center", width: "100%" }}>
            No products found
          </p>
        )}
      </div>
    </div>
  );
}
