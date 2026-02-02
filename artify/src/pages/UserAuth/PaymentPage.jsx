import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import useProducts from "../hooks/useProducts";
import api from "../../services/api";
import { reduceStock } from "../../services/productService";
import { saveUser } from "../../services/userService";

import { useAuth } from "../../context/AuthContext";
import "../style/payment.css";

export default function PaymentPage({ showToast }) {
  const navigate = useNavigate();
  const { auth, updateAuth } = useAuth();

  const [products, setProducts] = useState([]);
  const { products } = useProducts();
  
  const [method, setMethod] = useState("");
  const [upi, setUpi] = useState("");
  const [address, setAddress] = useState({
    city: "",
    street: "",
    pin: ""
  });

  // 🔐 Guards
  useEffect(() => {
    if (!auth) {
      navigate("/login");
      return;
    }
    if (!auth.cart || auth.cart.length === 0) {
      navigate("/cart");
    }
  }, [auth, navigate]);

  if (!auth || !auth.cart || auth.cart.length === 0) {
    return (
      <div className="payment-page">
        <h2>Payment</h2>
        <p className="payment-warning">
          Cart is empty. Add items first.
        </p>
      </div>
    );
  }

  const cart = auth.cart;

  const cartItems = cart
    .map(item => {
      const product = products.find(
        p => Number(p.id) === Number(item.productId)
      );
      return product ? { ...product, qty: item.qty } : null;
    })
    .filter(Boolean);

  const cartTotal = cartItems.reduce(
    (sum, item) => sum + Number(item.price) * item.qty,
    0
  );

  const cartCount = cartItems.reduce(
    (sum, item) => sum + item.qty,
    0
  );

  // 🧾 Place order
  const placeOrder = async () => {
    if (!method) return showToast("Choose a payment method");
    if (!address.city || !address.street || !address.pin)
      return showToast("Fill address");
    if (method === "gpay" && !upi)
      return showToast("Enter UPI ID");

    // Stock check
    for (const item of cartItems) {
      if (item.stock < item.qty) {
        return showToast(`${item.name} is out of stock`);
      }
    }

    // Reduce stock
    await reduceStock(cart);

    const newOrder = {
      id: Date.now(),
      userId: auth.id,
      userEmail: auth.email,
      items: cart,
      total: cartTotal,
      date: new Date().toLocaleString(),
      method,
      address,
      status: "pending"
    };

    // Save order
    await api.post("/orders", newOrder);

    // 🧹 Clear cart
    const updatedUser = { ...auth, cart: [] };
    await saveUser(updatedUser);   // backend
    updateAuth(updatedUser);       // context

    showToast("Order placed!");
    navigate("/");
  };

  return (
    <div className="payment-page">
      <h2>Checkout</h2>

      <div className="payment-container">
        <div className="pay-left">
          <h3>Choose Payment</h3>

          <label className={`method-box ${method === "gpay" ? "active" : ""}`}>
            <input
              type="radio"
              name="pay"
              onChange={() => setMethod("gpay")}
            />
            Google Pay (UPI)
          </label>

          <label className={`method-box ${method === "cod" ? "active" : ""}`}>
            <input
              type="radio"
              name="pay"
              onChange={() => setMethod("cod")}
            />
            Cash on Delivery
          </label>

          {method === "gpay" && (
            <input
              type="text"
              className="upi-input"
              placeholder="Enter your UPI ID"
              value={upi}
              onChange={e => setUpi(e.target.value)}
            />
          )}

          <div className="pay-summary">
            <p><strong>Items:</strong> {cartCount}</p>
            <p><strong>Total:</strong> ₹{cartTotal}</p>
          </div>
        </div>

        <div className="pay-right">
          <h3>Delivery Address</h3>

          <input
            type="text"
            placeholder="City"
            value={address.city}
            onChange={e =>
              setAddress({ ...address, city: e.target.value })
            }
          />

          <input
            type="text"
            placeholder="Street / Location"
            value={address.street}
            onChange={e =>
              setAddress({ ...address, street: e.target.value })
            }
          />

          <input
            type="number"
            placeholder="PIN Code"
            value={address.pin}
            onChange={e =>
              setAddress({ ...address, pin: e.target.value })
            }
          />

          <button className="place-btn" onClick={placeOrder}>
            Place Order
          </button>

          <button
            className="cancel-btn"
            onClick={() => navigate("/cart")}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}