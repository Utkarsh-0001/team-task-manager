import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingSkeleton from "./LoadingSkeleton";

const ProtectedRoute = ({ children }) => {
  const { user, booting } = useAuth();
  const location = useLocation();

  if (booting) {
    return <LoadingSkeleton fullScreen />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;

