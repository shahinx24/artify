import { Navigate } from "react-router-dom";
import { ROUTES } from "../constants/routes";

export default function PublicOnlyRoute({ user, children }) {
  if (user) {
    return <Navigate to={ROUTES.HOME} replace />;
  }
  return children;
}
