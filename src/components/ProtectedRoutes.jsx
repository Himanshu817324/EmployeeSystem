import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ role, children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Show loading state if auth is still being determined
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  // If not logged in, redirect to login
  if (!user) {
    return <Navigate to="login" state={{ from: location }} replace />;
  }

  // If role is required but user doesn't have it, redirect to home
  if (role && user.role !== role) {
    return <Navigate to="" replace />;
  }

  // User is authenticated and has required role, render children
  return children;
};

export default ProtectedRoute;
