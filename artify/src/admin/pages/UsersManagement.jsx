import { useEffect, useState, useCallback } from "react";
import { ENV } from "../../constants/env";
import "../style/adminLayout.css";
import "../style/table.css";
import "../style/buttons.css";

export default function UsersManagement() {
  const [users, setUsers] = useState([]);
  const [userOrders, setUserOrders] = useState([]);

  useEffect(() => {
    fetch(`${ENV.API_BASE_URL}/users`)
      .then(res => res.json())
      .then(setUsers);
  }, []);

  const toggleUser = useCallback((id, isActive) => {
    fetch(`${ENV.API_BASE_URL}/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !isActive })
    }).then(() =>
      setUsers(prev =>
        prev.map(u => u.id === id ? { ...u, isActive: !isActive } : u)
      )
    );
  }, []);

  const deleteUser = useCallback((id) => {
    fetch(`${ENV.API_BASE_URL}/users/${id}`, { method: "DELETE" })
      .then(() => setUsers(prev => prev.filter(u => u.id !== id)));
  }, []);

  const viewOrders = async (email) => {
    console.log("VIEW ORDERS CLICKED FOR:", email);

    const res = await fetch(
        `${ENV.API_BASE_URL}/orders?userEmail=${email}`
    );

    const data = await res.json();
    console.log("ORDERS FETCHED:", data);

    setUserOrders(data);
  }

  return (
  <div className="admin-container">
    <h1 className="admin-title">Users Management</h1>

    <div className="admin-card">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Mail</th>
            <th>Order</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.email}</td>
              <td>
                <button onClick={() => viewOrders(users.email)}>
                  View Orders
                </button>
                {userOrders.length > 0 && (
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
                    {userOrders.map(o => (
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
            )}

              </td>
              <td>
                <span className={u.isActive ? "status-active" : "status-blocked"}>
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
    </div>
  </div>
);
}