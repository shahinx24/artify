import { useEffect, useState, useCallback } from "react";
import { ORDER_STATUS } from "../../constants/orderStatus";
import { ORDER_STATUS_LABELS } from "../../constants/statusLabels";
import { getAllOrders, updateOrderStatus } from "../../services/orderService";
import { reduceStock } from "../../services/productService";
import "../style/table.css";
import useCancelOrder from "../../hooks/useCancelOrder";

export default function OrdersManagement() {
  const [orders, setOrders] = useState([]);
  const { cancelOrder } = useCancelOrder();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await getAllOrders();
        setOrders(data);
      } catch (err) {
        console.error("Failed to load orders", err);
      }
    };

    fetchOrders();
  }, []);

  const updateStatus = useCallback(
    async (order, newStatus) => {
      const prevStatus = order.status;

      try {
        if (
          prevStatus !== ORDER_STATUS.CANCELLED &&
          newStatus === ORDER_STATUS.CANCELLED
        ) {
          await cancelOrder(order, true);
        }

        // RE-ACTIVATE -> decrease stock
        if (
          prevStatus === ORDER_STATUS.CANCELLED &&
          newStatus !== ORDER_STATUS.CANCELLED
        ) {
          await reduceStock(order.items);
        }

        await updateOrderStatus(order.id, newStatus);

        setOrders(prev =>
          prev.map(o =>
            o.id === order.id ? { ...o, status: newStatus } : o
          )
        );
      } catch (err) {
        console.error("Status update failed", err);
      }
    },
    [cancelOrder]
  );

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
                    onChange={e => updateStatus(o, e.target.value)}
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