import { useEffect, useState, useCallback } from "react";
import { ENV } from "../../constants/env";
import { ORDER_STATUS } from "../../constants/orderStatus";
import { ORDER_STATUS_LABELS } from "../../constants/statusLabels";

export default function OrdersManagement() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch(`${ENV.API_BASE_URL}/orders`)
      .then(res => res.json())
      .then(setOrders);
  }, []);

  const updateStatus = useCallback((id, status) => {
    fetch(`${ENV.API_BASE_URL}/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    }).then(() =>
      setOrders(prev =>
        prev.map(o => o.id === id ? { ...o, status } : o)
      )
    );
  }, []);

  return (
    <div>
      <h2>Admin Orders</h2>

      {orders.map(o => (
        <div key={o.id}>
          #{o.id} – {ORDER_STATUS_LABELS[o.status]}
          <select
            value={o.status}
            onChange={e => updateStatus(o.id, e.target.value)}
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