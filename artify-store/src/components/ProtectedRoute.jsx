import { Navigate, useLocation } from "react-router-dom";
import { ROUTES } from "../constants/routes";

export default function ProtectedRoute({ user, children }) {
  const location = useLocation();

  if (!user) {
    return (
      <Navigate
        to={ROUTES.LOGIN}
        replace
        state={{ from: location }}
      />
    );
  }

  if (user.isActive === false) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return children;
}