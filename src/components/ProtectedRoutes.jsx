import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ role, children }) => {
  const { userRole } = useAuth();

  return userRole === role ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
