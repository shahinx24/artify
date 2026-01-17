import { Navigate } from "react-router-dom";
import { ROUTES } from "../constants/routes";
import { getUser } from "../utils/userHelpers";

export default function ProtectedRoute({ children }) {
  const user = getUser();

  if (!user) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  if (!user.isActive) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return children;
}