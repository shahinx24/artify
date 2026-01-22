import { useEffect, useState, useCallback } from "react";
import { ENV } from "../../constants/env";
import { ORDER_STATUS } from "../../constants/orderStatus";
import { ORDER_STATUS_LABELS } from "../../constants/statusLabels";

export default function OrdersManagement() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch(`${ENV.API_BASE_URL}/users`)
      .then(res => res.json())
      .then(users => {
        const allOrders = users.flatMap(user =>
          (user.orders || []).map(order => ({
            ...order,
            userId: user.id,
            userEmail: user.email
          }))
        );

        setOrders(allOrders);
      });
  }, []);

  const updateStatus = useCallback((id, status) => {
    setOrders(prev =>
      prev.map(o => (o.id === id ? { ...o, status } : o))
    );

  }, []);

  return (
    <div>
      <h2>Admin Orders</h2>

      {orders.length === 0 && <p>No orders found</p>}

      {orders.map(o => (
        <div key={o.id} style={{ marginBottom: "12px" }}>
          <strong>#{o.id}</strong> – {o.userEmail} –{" "}
          {ORDER_STATUS_LABELS[o.status]}

          <select
            value={o.status}
            onChange={e => updateStatus(o.id, e.target.value)}
            style={{ marginLeft: "8px" }}
          >
            {Object.values(ORDER_STATUS).map(s => (
              <option key={s} value={s}>
                {ORDER_STATUS_LABELS[s]}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
}