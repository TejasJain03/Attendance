/* eslint-disable react/prop-types */
// ProtectedRoute.js
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ isLoggedIn, children }) => {
  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }
  return children; // Render the protected component
};

export default ProtectedRoute;
