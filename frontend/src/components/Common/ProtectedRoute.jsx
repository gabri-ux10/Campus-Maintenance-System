import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { LoadingSpinner } from "./LoadingSpinner.jsx";

export const ProtectedRoute = ({ children, roles = [] }) => {
  const { isAuthenticated, auth, initializing } = useAuth();
  const location = useLocation();

  if (initializing) {
    return <LoadingSpinner label="Restoring secure session..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  if (roles.length > 0 && !roles.includes(auth.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};
