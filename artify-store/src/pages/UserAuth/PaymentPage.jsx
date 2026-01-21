import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ENV } from "../../constants/env";
import { ROUTES } from "../../constants/routes";
import { ORDER_STATUS } from "../../constants/orderStatus";
import { PAYMENT_STATUS } from "../../constants/paymentStatus";
import { DELIVERY_STATUS } from "../../constants/deliveryStatus";
import { getCart, clearCart } from "../../utils/cartHelpers";

export default function PaymentPage({ showToast,user }) {
  const navigate = useNavigate();
  const cart = getCart();

  const cartTotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  const cartCount = cart.reduce((acc, item) => acc + item.qty, 0);

  const [method, setMethod] = useState("");
  const [upi, setUpi] = useState("");
  const [address, setAddress] = useState({ city: "", street: "", pin: "" });

  /* ---------- GUARDS ---------- */
  useEffect(() => {
    if (!user) {
      navigate(ROUTES.HOME);
      return;
    }
    if (!cart || cart.length === 0) {
      navigate(ROUTES.CART);
    }
  }, [user, cart, navigate]);

  if (!user || cart.length === 0) {
    return (
      <div className="payment-page">
        <h2>Payment</h2>
        <p className="payment-warning">
          Cart is empty. Add items first.
        </p>
      </div>
    );
  }

  /* ---------- PLACE ORDER ---------- */
  const placeOrder = async () => {
    if (!method) return showToast?.("Choose a payment method");
    if (!address.city || !address.street || !address.pin)
      return showToast?.("Fill delivery address");
    if (method === "gpay" && !upi)
      return showToast?.("Enter UPI ID");

    const order = {
      userId: user.id,
      total: cartTotal,
      status: ORDER_STATUS.PENDING,
      paymentStatus:
        method === "cod"
          ? PAYMENT_STATUS.PENDING
          : PAYMENT_STATUS.SUCCESS,
      deliveryStatus: DELIVERY_STATUS.NOT_DISPATCHED,
      address,
      createdAt: new Date().toISOString()
    };

    await fetch(`${ENV.API_BASE_URL}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order)
    });

    clearCart();
    showToast?.("Order placed successfully!");
    navigate(ROUTES.ORDERS);
  };

  return (
    <div className="payment-page">
      <h2>Checkout</h2>

      <div className="payment-container">

        {/* LEFT */}
        <div className="pay-left">
          <h3>Choose Payment</h3>

          <label className={`method-box ${method === "gpay" ? "active" : ""}`}>
            <input
              type="radio"
              name="pay"
              value="gpay"
              onChange={() => setMethod("gpay")}
            />  Google Pay (UPI)
          </label>

          <label className={`method-box ${method === "cod" ? "active" : ""}`}>
            <input
              type="radio"
              name="pay"
              value="cod"
              onChange={() => setMethod("cod")}
            /> Cash on Delivery
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
            onChange={(e) =>
              setAddress({ ...address, city: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Street / Location"
            value={address.street}
            onChange={(e) =>
              setAddress({ ...address, street: e.target.value })
            }
          />
          <input
            type="number"
            placeholder="PIN Code"
            value={address.pin}
            onChange={(e) =>
              setAddress({ ...address, pin: e.target.value })
            }
          />

          <button className="place-btn" onClick={placeOrder}>
            Place Order
          </button>
          <button
            className="cancel-btn"
            onClick={() => navigate(ROUTES.CART)}
          > Cancel </button>
        </div>
      </div>
    </div>
  );
}