export default function Order({ orders }) {
  if (!orders || orders.length === 0) return null;

  return (
    <div className="admin-table-wrapper" style={{ marginTop: "20px" }}>
      <h3>User Orders</h3>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Status</th>
            <th>Total</th>
            <th>Date</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((o) => (
            <tr key={o.id}>
              <td>#{o.id}</td>
              <td>{o.status}</td>
              <td>{o.total}</td>
              <td>{o.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}