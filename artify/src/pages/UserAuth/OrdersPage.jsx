import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../style/orders.css";

import api from "../../services/api";
import useCancelOrder from "../../hooks/useCancelOrder";
import { useAuth } from "../../context/AuthContext";

export default function OrdersPage({ showToast }) {
  const { auth, loading } = useAuth();
  const [orders, setOrders] = useState([]);
  const { cancelOrder } = useCancelOrder(showToast);

  // 🔄 Load user orders
  useEffect(() => {
    if (!auth) return;

    api.get(`/orders?userEmail=${auth.email}`)
      .then(res => setOrders(res.data))
      .catch(err => console.error("Failed to load orders", err));
  }, [auth]);

  // 🔒 Not logged in
  if (!loading && !auth) {
    return (
      <div className="page-contents">
        <h2>Login required</h2>
        <Link to="/" className="checkout-btn">Go Home</Link>
      </div>
    );
  }

  if (loading) return null;

  // ❌ Cancel order
  const handleCancel = async (order) => {
    await cancelOrder(order);

    setOrders(prev =>
      prev.map(o =>
        o.id === order.id ? { ...o, status: "cancelled" } : o
      )
    );
  };

  const activeOrders = orders.filter(o => o.status !== "cancelled");
  const cancelledOrders = orders.filter(o => o.status === "cancelled");

  return (
    <div className="orders-page">
      <h2>My Orders</h2>

      {orders.length === 0 && <p>No orders yet</p>}

      <div className="orders-layout">

        {/* COLUMN 1: ACTIVE ORDERS */}
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
                  onClick={() => handleCancel(o)}
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
          <p><span className="dot delivered"></span> Delivered</p>
          <p><span className="dot cancelled"></span> Cancelled</p>
        </div>

      </div>
    </div>
  );
}