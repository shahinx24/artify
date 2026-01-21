import { Navigate } from "react-router-dom";
import { ROUTES } from "../constants/routes";

export default function AdminRoute({ children, user }) {

  if (!user || user.role !== "admin") {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return children;
}