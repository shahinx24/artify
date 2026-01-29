import React, { useEffect, useState, useCallback } from "react";
import api from "../../services/api";

import "../style/adminLayout.css";
import "../style/table.css";
import "../style/buttons.css";

import Order from "../components/Order";

export default function UsersManagement() {
  const [users, setUsers] = useState([]);
  const [userOrders, setUserOrders] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  // Fetch users
  useEffect(() => {
    api.get("/users").then(res => {
      setUsers(res.data);
    });
  }, []);

  // Toggle user active / blocked
  const toggleUser = useCallback(async (id, isActive) => {
    await api.patch(`/users/${id}`, { isActive: !isActive });

    setUsers(prev =>
      prev.map(u =>
        u.id === id ? { ...u, isActive: !isActive } : u
      )
    );
  }, []);

  // Delete user
  const deleteUser = useCallback(async (id) => {
    await api.delete(`/users/${id}`);

    setUsers(prev => prev.filter(u => u.id !== id));
  }, []);

  // View orders for a user (toggle)
  const viewOrders = async (email) => {
    if (selectedUser === email) {
      setSelectedUser(null);
      setUserOrders([]);
      return;
    }

    const res = await api.get(`/orders?userEmail=${email}`);

    setUserOrders(res.data);
    setSelectedUser(email);
  };

  return (
    <div className="admin-container">
      <h1 className="admin-title">Users Management</h1>

      <div className="admin-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Mail</th>
              <th>Orders</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <React.Fragment key={u.id}>
                <tr>
                  <td>{u.email}</td>

                  <td>
                    <button
                      className="btn btn-primary"
                        onClick={() => viewOrders(u.email)}>
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

                {/* User Orders */}
                {selectedUser === u.email && userOrders.length > 0 && (
                  <tr>
                    <td colSpan="4">
                      <Order orders={userOrders} />
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}