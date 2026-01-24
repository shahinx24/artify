import { Routes, Route , Navigate, Outlet } from "react-router-dom";

export default function AdminRoutes() {
  const auth = JSON.parse(localStorage.getItem("auth"));

  if (!auth || auth.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}