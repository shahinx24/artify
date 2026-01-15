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
    showToast("Order cancelled");
  };

  const dlt = async (id) => {
    const remaining = cancelled.filter(o => o.id !== id);

    const updated = {
      ...user,
      cancelledOrders: remaining
    };

    await saveUser(updated);
    setUser(updated);
    setCancelled(remaining);
    showToast("Deleted from history");
  };

  if (!user) return <p className="payment-login-msg">Login required</p>;

  return (
    <div className="orders-page">
      <h2>My Orders</h2>

      <div className="orders-layout">

        {/* LEFT: ACTIVE */}
        <div className="orders-left">
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

        {/* RIGHT: CANCELLED */}
        {cancelled.length > 0 && (
          <div className="orders-right">
            <h3>Cancelled Orders</h3>
            <div className="cancelled-list">
              {cancelled.map(c => (
                <p key={c.id} className="cancelled-item">
                  Order #{c.id} ❌
                  <button
                    className="delete-x"
                    onClick={() => dlt(c.id)}
                  >
                    ✖
                  </button>
                </p>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}