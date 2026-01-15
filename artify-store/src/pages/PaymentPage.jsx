import { useNavigate } from "react-router-dom";
import { getUser, saveUser } from "../utils/userHelpers";
import { useState, useEffect } from "react";

export default function PaymentPage({showToast}) {
    const [user, setUser] = useState(getUser());
    const cartTotal = user.cart.reduce((acc, item) => acc + item.price * item.qty, 0);
    const cartCount = user.cart.reduce((acc, item) => acc + item.qty, 0);
    const [method, setMethod] = useState("");
    const [upi, setUpi] = useState("");
    const [address, setAddress] = useState({ city:"", street:"", pin:"" });
    const navigate = useNavigate();

useEffect(() => {
  if (!user) {
    navigate("/login");
    return;
  }
  if (!user.cart || user.cart.length === 0) {
    navigate("/cart");
    return;
  }
}, [user, navigate]);

  // if no user or no cart items
  if (!user || user.cart.length === 0) {
    return (
      <div className="payment-page">
        <h2>Payment</h2>
        <p className="payment-warning">Cart is empty. Add items first.</p>
      </div>
    );
  }

const placeOrder = async () => {
  if (!method) return showToast("Choose a payment method");
  if (!address.city || !address.street || !address.pin) return showToast("Fill address");

  if (method === "gpay" && !upi) return showToast("Enter UPI ID");

  // Create new order
  const newOrder = {
    id: Date.now(),
    items: user.cart,
    total: cartTotal,
    date: new Date().toLocaleString(),
    method,
    address: address
  };

  // Update user
  const updated = {
    ...user,
    orders: [...(user.orders || []), newOrder],
    cart: []  // CLEAR CART
  };

  await saveUser(updated);

  showToast("Order placed!");
  navigate("/"); // redirect to home

    await saveUser(updated);
        setUser(updated);

        showToast("Order placed!");
        navigate("/orders");
    };

  return (
    <div className="payment-page">
      <h2>Checkout</h2>

      <div className="payment-container">

        {/* LEFT */}
        <div className="pay-left">
          <h3>Choose Payment</h3>

          <label className={`method-box ${method==="gpay"?"active":""}`}>
            <input
              type="radio"
              name="pay"
              value="gpay"
              onChange={() => setMethod("gpay")}
            />
            Google Pay (UPI)
          </label>

          <label className={`method-box ${method==="cod"?"active":""}`}>
            <input
              type="radio"
              name="pay"
              value="cod"
              onChange={() => setMethod("cod")}
            />
            Cash on Delivery
          </label>

          {method === "gpay" && (
            <input
              type="text"
              className="upi-input"
              placeholder="Enter your UPI ID (example@upi)"
              value={upi}
              onChange={(e) => setUpi(e.target.value)}
            />
          )}

        {/* TOTAL BOX */}
        <div className="pay-summary">
            <p><strong>Items:</strong> {cartCount}</p>
            <p><strong>Total:</strong> ₹{cartTotal}</p>
        </div>
        </div>

        {/* RIGHT */}
        <div className="pay-right">
          <h3>Delivery Address</h3>
          <input
            type="text"
            placeholder="City"
            value={address.city}
            onChange={e => setAddress({ ...address, city: e.target.value })}
          />
          <input
            type="text"
            placeholder="Street / Location"
            value={address.street}
            onChange={e => setAddress({ ...address, street: e.target.value })}
          />
          <input
            type="number"
            placeholder="PIN Code"
            value={address.pin}
            onChange={e => setAddress({ ...address, pin: e.target.value })}
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