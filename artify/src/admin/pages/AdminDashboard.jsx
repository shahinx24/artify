import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ENV } from "../../constants/env";
import "../style/adminLayout.css";
import "../style/dashboard.css";
import "../style/buttons.css";

export default function AdminDashboard() {
  // const [users, setUsers] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [stats, setStats] = useState({ users: 0, products: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${ENV.API_BASE_URL}/users`)
      .then(res => res.json())
      .then(data => {
        const ordersCount = data.reduce(
          (sum, user) => sum + (user.orders?.length || 0),
          0
        );
        setTotalOrders(ordersCount);
      });
  }, []);

  useEffect(() => {
    Promise.all([
      fetch(`${ENV.API_BASE_URL}/users`).then(res => res.json()),
      fetch(`${ENV.API_BASE_URL}/products`).then(res => res.json()),
    ]).then(([users, products]) => {
      setStats({
        users: users.length,
        products: products.length,
      });
    });
  }, []);

  return (
    <>
      <h1 className="admin-title">Admin Dashboard</h1>

      <div className="admin-grid">
        <div className="stat-card">
          <div className="dashboard-box">
            <h3>Total Users</h3>
            <p>{stats.users}</p>
          </div>
          <button className="btn btn-sec" onClick={() => navigate("/admin/users")}>
            Manage Users
          </button>
        </div>

        <div className="stat-card">
          <div className="dashboard-box">
            <h3>Total Products</h3>
            <p>{stats.products}</p>
          </div>
          <button className="btn btn-sec" onClick={() => navigate("/admin/products")}>
            Manage Products
          </button>
        </div>

        <div className="stat-card">
          <div className="dashboard-box">
            <h3>Add New Product</h3>
            <p>{stats.products}</p>
          </div>
          <button className="btn btn-sec" onClick={() => navigate("/admin/add")}>
            Add Product
          </button>
        </div>

        <div className="stat-card">
          <div className="dashboard-box">
            <h3>Total Orders</h3>
            <p>{totalOrders}</p>
          </div>
          <button className="btn btn-sec" onClick={() => navigate("/admin/orders")}>
            Manage Orders
          </button>
        </div>
      </div>
    </>
  );
}