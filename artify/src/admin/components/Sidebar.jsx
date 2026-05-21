import { NavLink } from "react-router-dom";
import "../style/sidebar.css";

export default function Sidebar() {
  return (
    <aside className="sidebar">

      <NavLink to="/admin" end>Dashboard</NavLink>
      <NavLink to="/admin/products">Products</NavLink>
      <NavLink to="/admin/orders">Orders</NavLink>
      <NavLink to="/admin/users">Users</NavLink>
    </aside>
  );
}