import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";
import "../style/adminLayout.css";
import AdminNavbar from "../components/AdminNavbar";

export default function AdminLayout() {
  return (
    <div className="admin-layout">
      <AdminNavbar />
      <Sidebar />
      <div className="admin-main">
        <Outlet />
      </div>
    </div>
  );
}