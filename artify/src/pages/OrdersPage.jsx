import { useState } from "react";
import { getUser, saveUser } from "../utils/userHelpers";
import "./style/orders.css"

export default function OrdersPage({ showToast }) {
  const [user, setUser] = useState(getUser());

  if (!user) {
    return <p className="payment-login-msg">Login required</p>;
  }

  const orders = user.orders || [];

  const updateStatus = async (id, status) => {
    const updatedOrders = orders.map(o =>
      o.id === id ? { ...o, status } : o
    );

    const updatedUser = { ...user, orders: updatedOrders };
    await saveUser(updatedUser);
    setUser(updatedUser);

    showToast(`Order ${status}`);
  };

const getStatusColor = (status) => {
  switch (status) {
    case "pending": return "pending";
    case "confirmed": return "confirmed";
    case "shipped": return "shipped";
    case "delivered": return "delivered";
    case "cancelled": return "cancelled";
    default: return "unknown";
  }
};


  const activeOrders = orders.filter(o => o.status !== "cancelled");
  const cancelledOrders = orders.filter(o => o.status === "cancelled");
return (
  <div className="orders-page">
    <h2>My Orders</h2>

    {orders.length === 0 && <p>No orders yet</p>}

    <div className="orders-layout">
      <div className="orders-left">
        <h3>Active Orders</h3>

        {activeOrders.length === 0 && <p>No active orders</p>}

        {activeOrders.map(o => (
          <div className={`order-card ${o.status}`} key={o.id}>
            <div className="order-header">
              <p><strong>Order #{o.id}</strong></p>
              <span className={`order-status ${o.status}`}>
                {o.status.toUpperCase()}
              </span>
            </div>

            <p>Date: {o.date}</p>
            <p>Total: ₹{o.total}</p>
            <p>Payment: {o.method}</p>
            <p>Address: {o.address.city}, {o.address.street}</p>

            {o.status === "pending" && (
              <button
                className="cancel-btn"
                onClick={() => updateStatus(o.id, "cancelled")}
              >
                Cancel Order
              </button>
            )}
          </div>
        ))}
      </div>

      {/* COLUMN 2: CANCELLED ORDERS */}
      <div className="orders-cancelled">
        <h3>Cancelled Orders</h3>

        {cancelledOrders.length === 0 && <p>No cancelled orders</p>}

        {cancelledOrders.map(o => (
          <div className="order-card cancelled" key={o.id}>
            <div className="order-header">
              <p><strong>Order #{o.id}</strong></p>
              <span className="order-status cancelled">CANCELLED</span>
            </div>

            <p>Date: {o.date}</p>
            <p>Total: ₹{o.total}</p>
            <p>Payment: {o.method}</p>
            <p>Address: {o.address.city}, {o.address.street}</p>
          </div>
        ))}
      </div>

      {/* COLUMN 3: STATUS LEGEND */}
      <div className="orders-right">
        <h3>Order Status</h3>
        <p><span className="dot pending"></span> Pending</p>
        <p><span className="dot confirmed"></span> Confirmed</p>
        <p><span className="dot shipped"></span> Shipped</p>
        <p><span className="dot delivered"></span> Delivered</p>
        <p><span className="dot cancelled"></span> Cancelled</p>
      </div>

    </div>

</div>
);
}