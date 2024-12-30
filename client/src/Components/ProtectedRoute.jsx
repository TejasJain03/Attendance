/* eslint-disable react/prop-types */
import { Navigate } from "react-router-dom";

// ProtectedRoute will check if the user is logged in before rendering the component
const ProtectedRoute = ({ element }) => {
  const isLoggedIn = localStorage.getItem("loggedIn") === "true";
  return isLoggedIn ? element : <Navigate to="/login" />;
};

export default ProtectedRoute;
