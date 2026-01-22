import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    users: 0,
    products: 0,
    orderedItems: 0,
  });

  useEffect(() => {
    Promise.all([
      fetch("http://localhost:3000/users").then(res => res.json()),
      fetch("http://localhost:3000/products").then(res => res.json()),
    ]).then(([users, products]) => {
      setStats({
        users: users.length,
        products: products.length,
        orderedItems: 0, // ✅ order system not implemented yet
      });
    });
  }, []);

  return (
    <div className="admin-page" style={{ padding: "2rem" }}>
      <h1>Admin Dashboard</h1>

      <div
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
          <button onClick={() => navigate("/admin/users")}>
            Manage Users
          </button>
        </div>

        <div className="stat-card">
          <h3>Total Products</h3>
          <p>{stats.products}</p>
          <button onClick={() => navigate("/admin/products")}>
            Manage Products
          </button>
        </div>

        <div className="stat-card">
          <h3>Add New Product</h3>
          <p>{stats.products}</p>
          <button onClick={() => navigate("/admin/add")}>
            Add Product
          </button>
        </div>

        <div className="stat-card">
          <h3>Ordered Items</h3>
          <p>{stats.orderedItems}</p>
          <button onClick={() => navigate("/admin/orders")}>
            Manage Orders
          </button>
        </div>
      </div>
    </div>
  );
}