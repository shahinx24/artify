import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { getDashboardStats } from "../../services/admin/dashboardService";
import "../style/adminLayout.css";
import "../style/dashboard.css";
import "../style/buttons.css";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    products: 0,
    totalOrders: 0,
    totalRevenue: 0
  });

  const navigate = useNavigate();

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (err) {
        console.error("Failed to load dashboard stats", err);
      }
    };

    loadDashboard();
  }, []);

  return (
    <>
      <PageHeader
        title="Dashboard"
        subtitle="Overview of your store"
      />

      <div className="admin-grid">
        <div className="stat-card">
          <div className="dashboard-box">
            <h3>Total Users</h3>
            <p>{stats.users}</p>
          </div>
          <button
            className="btn btn-sec"
            onClick={() => navigate("/admin/users")}
          >
            Manage Users
          </button>
        </div>

        <div className="stat-card">
          <div className="dashboard-box">
            <p>Create a new product</p>
            <p>{stats.products}</p>
          </div>
          <button
            className="btn btn-sec"
            onClick={() => navigate("/admin/products")}
          >
            Manage Products
          </button>
        </div>

        <div className="stat-card">
          <div className="dashboard-box">
            <h3>Add New Product</h3>
            <p>{stats.products}</p>
          </div>
          <button
            className="btn btn-sec"
            onClick={() => navigate("/admin/add")}
          >
            Add Product
          </button>
        </div>

        <div className="stat-card">
          <div className="dashboard-box">
            <h3>Total Orders</h3>
            <p>{stats.totalOrders}</p>
          </div>
          <button
            className="btn btn-sec"
            onClick={() => navigate("/admin/orders")}
          >
            Manage Orders
          </button>
        </div>

        {/* Total Revenue */}
        <div className="stat-card">
          <div className="dashboard-box">
            <h3>Total Revenue</h3>
            <p>
              ₹{stats.totalRevenue.toLocaleString("en-IN")}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
