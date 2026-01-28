import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ProtectedRoute({ children, role }) {
  const { auth, loading } = useAuth();

  if (loading) return null;

  if (!auth) return <Navigate to="/login" />;

  if (role && auth.role !== role) {
    return <Navigate to="/" />;
  }

  return children;
}