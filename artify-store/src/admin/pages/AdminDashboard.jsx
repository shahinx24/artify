import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    products: 0,
    orders: 0,
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [usersRes, productsRes, ordersRes] = await Promise.all([
          axios.get("http://localhost:3000/users"),
          axios.get("http://localhost:3000/products"),
          axios.get("http://localhost:3000/orders"),
        ]);

        setStats({
          users: usersRes.data.length,
          products: productsRes.data.length,
          orders: ordersRes.data.length,
        });
      } catch (err) {
        console.error("Failed to load admin stats", err);
      }
    };

    loadStats();
  }, []);

  return (
    <div className="admin-page" style={{ padding: "2rem" }}>
      <h1>Admin Dashboard</h1>

      <div
        className="admin-stats"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1.5rem",
          marginTop: "2rem",
        }}
      >
        <div className="stat-card">
          <h3>Total Users</h3>
          <p>{stats.users}</p>
        </div>

        <div className="stat-card">
          <h3>Total Products</h3>
          <p>{stats.products}</p>
        </div>

        <div className="stat-card">
          <h3>Total Orders</h3>
          <p>{stats.orders}</p>
        </div>
      </div>
    </div>
  );
}