import { useEffect, useState, useCallback } from "react";
import { ENV } from "../../constants/env";

export default function UsersManagement() {
  const [users, setUsers] = useState([]);

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

  return (
    <div>
      <h2>Users</h2>
      {users.map(u => (
        <div key={u.id}>
          {u.name} - {u.isActive ? "Active" : "Blocked"}
          <button onClick={() => toggleUser(u.id, u.isActive)}>
            Toggle
          </button>
          <button onClick={() => deleteUser(u.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}