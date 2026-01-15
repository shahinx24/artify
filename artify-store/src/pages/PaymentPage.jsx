import { useState } from "react";
import { getUser, saveUser } from "../utils/userHelpers";

export default function PaymentPage({ showToast }) {
  const [user, setUser] = useState(getUser());
  const [method, setMethod] = useState("");
  const [orders, setOrders] = useState(user?.orders || []);
  const [cancelled, setCancelled] = useState(user?.cancelledOrders || []);
  const confirmOrder = async () => {
    if (!method) return showToast("Select a payment method");
  const newOrder = {
      id: Date.now(),
      items: user.cart,
      total: user.cart.reduce((t, i) => t + i.price * i.qty, 0),
      method,
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
    showToast("Order Placed!");
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

        <button className="confirm-btn" onClick={confirmOrder}>
          Confirm Order
        </button>
      </div>

      {/* RIGHT ORDER STATUS LIST */}
      <div className="order-status">
        <h2>Your Orders</h2>
        <div className="order-list">
          {orders.length === 0 && <p className="empty-orders">No orders placed yet</p>}

          {orders.map(o => (
            <div className="order-card" key={o.id}>
              <p>Order #{o.id}</p>
              <p>Total: ₹{o.total}</p>
              <p>Method: {o.method}</p>
              <button className="cancel-btn" onClick={()=>cancelOrder(o.id)}>Cancel</button>
            </div>
          ))}
        </div>

        {cancelled?.length > 0 && (
          <>
            <h3>Cancelled Orders</h3>
            <div className="cancelled-list">
              {cancelled.map(c => (
                <p key={c.id} className="cancelled-item">Order #{c.id} Cancelled ❌</p>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}