import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
// import ProtectedRoute from "./Components/ProtectedRoute";
import LoginPage from "./Pages/LoginPage";
import AdminDashboard from "./Pages/AdminDashboard";
import EmployeeDetailsPage from "./Pages/EmployeeDetails";
import AddEmployee from "./Pages/AddEmployee";
import SalarySummary from "./Pages/SalarySummary";
import LoanSummary from "./Pages/LoanSummary";
import PaymentPage from "./Pages/PaymentPage";
import { useEffect, useState } from "react";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check login status when the app loads
    const loggedInStatus = localStorage.getItem("loggedIn") === "true";
    setIsLoggedIn(loggedInStatus);
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} />}
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<AdminDashboard />} />
        <Route path="/employee/:employeeId" element={<EmployeeDetailsPage />} />
        <Route
          path="/employee/salary-summary/:employeeId"
          element={<SalarySummary />}
        />
        <Route
          path="/employee/loan-details/:employeeId"
          element={<LoanSummary />}
        />
        <Route
          path="/admin/:employeeId/:year/:month/:weekNumber"
          element={<PaymentPage />}
        />
        <Route path="/admin/add-employee" element={<AddEmployee />} />
      </Routes>
    </Router>
  );
};

export default App;
