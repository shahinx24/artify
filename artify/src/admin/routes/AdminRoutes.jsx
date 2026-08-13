import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

export default function AdminRoutes() {
  const { auth, loading } = useAuth();

  if (loading) return null;

  if (!auth || auth.role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
