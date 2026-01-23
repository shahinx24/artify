import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";
import "../style/adminLayout.css";

export default function AdminLayout() {
  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-main">
        <Outlet />
      </div>
    </div>
  );
}