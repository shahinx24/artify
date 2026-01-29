import { useEffect, useState, useCallback } from "react";
import { ORDER_STATUS } from "../../constants/orderStatus";
import { ORDER_STATUS_LABELS } from "../../constants/statusLabels";
import "../style/table.css"
import { getOrders, updateOrderStatus } from "../../services/orderService";

export default function OrdersManagement() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await getOrders();
        setOrders(data);
      } catch (err) {
        console.error("Failed to load orders", err);
      }
    };

    fetchOrders();
  }, []);

  const updateStatus = useCallback(async (id, status) => {
    try {
      await updateOrderStatus(id, status);

      setOrders(prev =>
        prev.map(o => (o.id === id ? { ...o, status } : o))
      );
    } catch (err) {
      console.error("Status update failed", err);
    }
  }, []);

  return (
  <div className="admin-table-wrapper">
    <h2 className="admin-page-title">All Orders</h2>

    {orders.length === 0 ? (
      <p className="empty-text">No orders found</p>
    ) : (
      <table className="admin-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>User Email</th>
            <th>Status</th>
            <th>Update</th>
          </tr>
        </thead>

        <tbody>
          {orders.map(o => (
            <tr key={o.id}>
              <td>#{o.id}</td>
              <td>{o.userEmail}</td>
              <td>
                <span className={`status-tag status-${o.status}`}>
                  {ORDER_STATUS_LABELS[o.status]}
                </span>
              </td>
              <td>
                <select
                  className="status-select"
                  value={o.status}
                  onChange={e => updateStatus(o.id, e.target.value)}
                >
                  {Object.values(ORDER_STATUS).map(s => (
                    <option key={s} value={s}>
                      {ORDER_STATUS_LABELS[s]}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>
);
}