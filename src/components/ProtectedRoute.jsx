import { useContext, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { toast } from "react-toastify";

/**
 * Wraps a route so only authenticated users can access it.
 * If not logged in, redirects to /login and saves the intended
 * destination so the user can be sent back after logging in.
 */
const ProtectedRoute = ({ children }) => {
  const { token } = useContext(CartContext);
  const location = useLocation();

  useEffect(() => {
    if (!token) {
      toast.info("Please log in to access this page.", { toastId: "auth-required" });
    }
  }, [token]);

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
