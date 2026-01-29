import { useState, useEffect } from "react";
import { getUser, saveUser } from "../../utils/userHelpers";
import "../style/orders.css"
import api from "../../services/api";
import usePayment from "../../hooks/usePayment";

export default function OrdersPage({ showToast }) {
  const [user, setUser] = useState(getUser());
  const [orders, setOrders] = useState([]);
  const { cancelOrder } = usePayment(showToast);

  useEffect(() => {
    if (!user) return;

    api.get(`/orders?userEmail=${user.email}`)
      .then(res => {
        setOrders(res.data);
      });
  }, [user]);

  if (!user) {
    return(
        <div
          className="page-contents">
          <h2>Login required</h2>
          <Link to="/" className="checkout-btn">Go Home</Link>
      </div>
  )}

  const updateStatus = async (id, status) => {
    await api.patch(`/orders/${id}`, { status });

    setOrders(prev =>
      prev.map(o => (o.id === id ? { ...o, status } : o))
    );

    showToast(`Order ${status}`);
  };

const getStatusColor = (status) => {
  switch (status) {
    case "pending": return "pending";
    case "confirmed": return "confirmed";
    case "delivered": return "delivered";
    case "cancelled": return "cancelled";
    default: return "unknown";
  }
};

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