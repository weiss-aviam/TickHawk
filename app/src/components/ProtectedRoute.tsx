import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthProvider";

function ProtectedRoute() {
    const { token } = useAuth();
  
    if (!token) {
      return <Navigate to="/auth" />;
    }
  
    return <Outlet />;
  };

  export default ProtectedRoute;