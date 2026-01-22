import { Outlet } from "react-router-dom";
// import Navbar from "../components/AdminNavbar"
import "../style/adminLayout.css";

export default function AdminLayout() {
  return (
    <div className="admin-page">
      {/* <Navbar /> */}
      <Outlet />
    </div>
  );
}
