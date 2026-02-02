import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../style/cart.css";
import useProducts from "../hooks/useProducts";

import api from "../../services/api";
import { saveUser } from "../../services/userService";
import { useAuth } from "../../context/AuthContext";

export default function CartPage({ showToast }) {
  const navigate = useNavigate();
  const { auth, updateAuth } = useAuth();

  const [products, setProducts] = useState([]);
  const { products } = useProducts();

  //  Login guard
  if (!auth) {
    return (
      <div className="page-contents">
        <h2>Please login to view your cart</h2>
        <Link to="/" className="checkout-btn">Go Home</Link>
      </div>
    );
  }

  const cart = auth.cart || [];

  const cartItems = cart
    .map(item => {
      const product = products.find(
        p => Number(p.id) === Number(item.productId)
      );
      return product ? { ...product, qty: item.qty } : null;
    })
    .filter(Boolean);

  // 🔁 Update cart helper
  const updateCart = async (updatedCart) => {
    const updatedUser = { ...auth, cart: updatedCart };

    await saveUser(updatedUser);   // backend
    updateAuth(updatedUser);       // context (sync navbar)
  };

  const increaseQty = (id) => {
    const updated = cart.map(item =>
      Number(item.productId) === Number(id)
        ? { ...item, qty: item.qty + 1 }
        : item
    );
    updateCart(updated);
  };

  const decreaseQty = (id) => {
    const updated = cart.map(item =>
      Number(item.productId) === Number(id) && item.qty > 1
        ? { ...item, qty: item.qty - 1 }
        : item
    );
    updateCart(updated);
  };

  const removeItem = (id) => {
    const updated = cart.filter(
      item => Number(item.productId) !== Number(id)
    );
    updateCart(updated);
    showToast("Removed from cart");
  };

  const total = cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  const totalQty = cartItems.reduce(
    (acc, item) => acc + item.qty,
    0
  );

  const goToPayment = () => {
    if (cartItems.length === 0)
      return showToast("Cart is empty");
    navigate("/checkout");
  };

  // 🛒 Empty cart
  if (cartItems.length === 0) {
    return (
      <div className="page-contents">
        <h2>Your cart is empty 🛒</h2>
        <p>Add some art supplies to get started!</p>
        <Link to="/" className="checkout-btn">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-items">
        {cartItems.map(p => (
          <div className="cart-item" key={p.id}>
            <img src={p.image} alt={p.name} />

            <div className="item-info">
              <h3>{p.name}</h3>
              <p>₹{p.price}</p>
            </div>

            <div className="qty-btns">
              <button onClick={() => decreaseQty(p.id)}>-</button>
              <span>{p.qty}</span>
              <button onClick={() => increaseQty(p.id)}>+</button>
            </div>

            <button
              className="remove-btn"
              onClick={() => removeItem(p.id)}
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <h2>Order Summary</h2>

        <div className="summary-line">
          <span>Total Items:</span>
          <span>{cartItems.length}</span>
        </div>

        <div className="summary-line">
          <span>Total Quantity:</span>
          <span>{totalQty}</span>
        </div>

        <div className="summary-line">
          <span>Subtotal:</span>
          <span>₹{total}</span>
        </div>

        <hr style={{ margin: "1rem 0" }} />

        <div className="summary-line" style={{ fontWeight: "bold" }}>
          <span>Total:</span>
          <span>₹{total}</span>
        </div>

        <button className="checkout-btn" onClick={goToPayment}>
          Proceed to Checkout
        </button>

        <Link
          to="/"
          style={{ display: "block", marginTop: "1rem", textAlign: "center" }}
        >
          ← Continue Shopping
        </Link>
      </div>
    </div>
  );
}