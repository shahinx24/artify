import formatDate from "../../utils/formatDate";

export default function OrderTable({ orders }) {
  if (!orders?.length) return null;

  return (
    <div className="admin-table-wrapper" style={{ marginTop: "20px" }}>
      <h3>User Orders</h3>

      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Status</th>
            <th>Total</th>
            <th>Date</th>
            <th>Address</th>
          </tr>
        </thead>

        <tbody>
          {orders.map(o => (
            <tr key={o.id}>
              <td>#{o.id}</td>
              <td>{o.status}</td>
              <td>{o.total}</td>
              <td>{formatDate(o.createdAt)}</td>
              <td>
                {o.address.city}, {o.address.street} – {o.address.pin}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}