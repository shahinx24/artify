import useCart from "../hooks/useCart";
import React from "react";

function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <div className="card">
      <h4>{product.title}</h4>
      <p>₹{product.price}</p>
      <p>Stock: {product.stock}</p>

      <button
        disabled={product.stock === 0}
        onClick={() => addToCart(product)}
      >
        Add to Cart
      </button>
    </div>
  );
}

export default React.memo(ProductCard);