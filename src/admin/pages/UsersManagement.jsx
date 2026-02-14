import useUsers from "../../hooks/useUsers";
import useUserOrders from "../../hooks/useUserOrders";
import OrderTable from "../components/OrderTable";

import "../style/adminLayout.css";
import "../style/table.css";
import "../style/buttons.css";

export default function UsersManagement() {
  const { users, toggleUser, deleteUser } = useUsers();
  const { selectedUser, orders, viewOrders } = useUserOrders();

  return (
    <div className="admin-container">
      <h1 className="admin-title">Users Management</h1>

      <div className="admin-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Orders</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td>{u.email}</td>

                <td>
                  <button
                    className="btn btn-primary"
                    onClick={() => viewOrders(u.email)}
                  >
                    View Orders
                  </button>
                </td>

                <td>
                  <span
                    className={
                      u.isActive ? "status-active" : "status-blocked"
                    }
                  >
                    {u.isActive ? "Active" : "Blocked"}
                  </span>
                </td>

                <td>
                  <button
                    className="btn btn-secondary"
                    onClick={() => toggleUser(u.id, u.isActive)}
                  >
                    Toggle
                  </button>

                  <button
                    className="btn btn-danger"
                    onClick={() => deleteUser(u.id)}
                    style={{ marginLeft: "8px" }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Orders table styled using SAME table.css */}
        {selectedUser && <OrderTable orders={orders} />}
      </div>
    </div>
  );
}
