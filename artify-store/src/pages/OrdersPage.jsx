import { useState } from "react";
import { getUser, saveUser } from "../utils/userHelpers";

export default function OrdersPage({ showToast }) {
  const [user, setUser] = useState(getUser());
  const [orders, setOrders] = useState(user?.orders || []);
  const [cancelled, setCancelled] = useState(user?.cancelledOrders || []);
  const cancelOrder = async (id) => {
  const active = orders.filter(o => o.id !== id);
  const cancelledOne = orders.find(o => o.id === id);

    const updated = {
      ...user,
      orders: active,
      cancelledOrders: [...cancelled, cancelledOne]
    };

    await saveUser(updated);
    setUser(updated);
    setOrders(active);
    setCancelled(updated.cancelledOrders);
    showToast("Order Cancelled");
  };

  if (!user) return <p className="payment-login-msg">Login required</p>;

  return (
    <div className="orders-page">
  <div className="order-left">
    <h2>My Orders</h2>

    <div className="order-list">
      {orders.length === 0 && <p>No active orders</p>}
      {orders.map(o => (
        <div className="order-card" key={o.id}>
          <p>Order #{o.id}</p>
          <p>Total: ₹{o.total}</p>
          <p>Method: {o.method}</p>
          <p>City: {o.address.city}</p>
          <button className="cancel-btn" onClick={() => cancelOrder(o.id)}>
            Cancel
          </button>
        </div>
      ))}
    </div>
  </div>

  {cancelled.length > 0 && (
    <div className="cancelled-section">
      <h3>Cancelled Orders</h3>

      <div className="cancelled-list">
        {cancelled.map(c => (
          <p key={c.id} className="cancelled-item">
            Order #{c.id} ❌
          </p>
        ))}
      </div>
    </div>
  )}
</div>
  );
}