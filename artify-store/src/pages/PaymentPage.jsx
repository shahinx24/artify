import { useState } from "react";
import { getUser, saveUser } from "../utils/userHelpers";

export default function PaymentPage({ showToast }) {
  const [user, setUser] = useState(getUser());
  const [method, setMethod] = useState("");
  const [upi, setUpi] = useState("");
  const [city, setCity] = useState("");
  const [street, setStreet] = useState("");
  const [location, setLocation] = useState("");

  const [orders, setOrders] = useState(user?.orders || []);
  const [cancelled, setCancelled] = useState(user?.cancelledOrders || []);

  const validate = () => {
    if (!method) return "Choose a payment method";
    if (!city || !street || !location) return "Fill all address fields";
    if (method === "gpay" && !upi) return "Enter UPI ID";
    if (method === "gpay" && !/^[\w.-]+@[\w.-]+$/.test(upi)) return "Invalid UPI ID format";
    return null;
  };

  const confirmOrder = async () => {
    const err = validate();
    if (err) return showToast(err);

    const total = user.cart.reduce((t, i) => t + i.price * i.qty, 0);

    const newOrder = {
      id: Date.now(),
      items: user.cart,
      total,
      method,
      address: { city, street, location },
      upi: method === "gpay" ? upi : null,
      status: "active"
    };

    const updated = {
      ...user,
      orders: [...orders, newOrder],
      cart: []
    };

    await saveUser(updated);
    setUser(updated);
    setOrders(updated.orders);
    showToast("Order Successful!");
  };

  const cancelOrder = async (orderId) => {
    const active = orders.filter(o => o.id !== orderId);
    const removed = orders.find(o => o.id === orderId);

    const updated = {
      ...user,
      orders: active,
      cancelledOrders: [...(cancelled || []), removed]
    };

    await saveUser(updated);
    setUser(updated);
    setOrders(active);
    setCancelled(updated.cancelledOrders);
    showToast("Order Cancelled");
  };

  if (!user) return <p className="payment-login-msg">Login required</p>;

  return (
    <div className="payment-page">

      {/* LEFT PAYMENT BOX */}
      <div className="payment-options">
        <h2>Choose Payment</h2>

        <label className="pay-option">
          <input type="radio" name="method" value="gpay" onChange={e=>setMethod(e.target.value)} />
          Google Pay
        </label>

        <label className="pay-option">
          <input type="radio" name="method" value="cod" onChange={e=>setMethod(e.target.value)} />
          Cash on Delivery
        </label>

        {method === "gpay" && (
          <input
            type="text"
            placeholder="Enter UPI ID (e.g., name@oksbi)"
            className="upi-input"
            onChange={e => setUpi(e.target.value)}
          />
        )}

        <h3 style={{ marginTop: "1rem" }}>Delivery Address</h3>

        <input className="inp" type="text" placeholder="City" onChange={e=>setCity(e.target.value)} />
        <input className="inp" type="text" placeholder="Street" onChange={e=>setStreet(e.target.value)} />
        <input className="inp" type="text" placeholder="House / Landmark / Location" onChange={e=>setLocation(e.target.value)} />

        <button className="confirm-btn" onClick={confirmOrder}>
          Confirm Order
        </button>
      </div>

      {/* RIGHT ORDER STATUS */}
      <div className="order-status">
        <h2>Your Orders</h2>

        <div className="order-list">
          {orders.length === 0 && <p className="empty-orders">No orders yet</p>}

          {orders.map(o => (
            <div className="order-card" key={o.id}>
              <p>Order #{o.id}</p>
              <p>Total: ₹{o.total}</p>
              <p>Method: {o.method}</p>
              <p>City: {o.address.city}</p>
              <button className="cancel-btn" onClick={()=>cancelOrder(o.id)}>Cancel</button>
            </div>
          ))}
        </div>

        {cancelled?.length > 0 && (
          <>
            <h3>Cancelled Orders</h3>
            <div className="cancelled-list">
              {cancelled.map(c => (
                <p key={c.id} className="cancelled-item">
                  Order #{c.id} ❌
                </p>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}