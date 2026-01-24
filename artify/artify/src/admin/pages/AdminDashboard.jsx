import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getOrderStats } from "../../services/orderService";
import { getUserCount } from "../../services/userService";
import { getProductCount } from "../../services/productService";
import PageHeader from "../components/PageHeader";
import "../style/adminLayout.css";
import "../style/dashboard.css";
import "../style/buttons.css";

export default function AdminDashboard() {
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [stats, setStats] = useState({ users: 0, products: 0 });

  const navigate = useNavigate();

  // Orders stats (count + revenue)
  useEffect(() => {
    const loadOrderStats = async () => {
      try {
        const { totalOrders, totalRevenue } = await getOrderStats();
        setTotalOrders(totalOrders);
        setTotalRevenue(totalRevenue);
      } catch (err) {
        console.error("Failed to load order stats", err);
      }
    };

    loadOrderStats();
  }, []);

  // Users & Products
  useEffect(() => {
    const loadCounts = async () => {
      try {
        const [users, products] = await Promise.all([
          getUserCount(),
          getProductCount()
        ]);

        setStats({
          users,
          products
        });
      } catch (err) {
        console.error("Failed to load dashboard stats", err);
      }
    };

    loadCounts();
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
            <h3>Total Products</h3>
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
            <p>{totalOrders}</p>
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
            <p>₹{totalRevenue}</p>
          </div>
        </div>
      </div>
    </>
  );
}