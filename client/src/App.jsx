import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from 'react-toastify'; // Import ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS for toasts
import LoginPage from "./Pages/LoginPage";
import AdminDashboard from "./Pages/AdminDashboard";
import EmployeeDetailsPage from "./Pages/EmployeeDetails";
import AddEmployee from "./Pages/AddEmployee";
import LoanSummary from "./Pages/LoanSummary";
import PaymentPage from "./Pages/PaymentPage";
import EmployeesManagement from "./Pages/EmployeesManagement";
import WeeklyReportPage from "./Pages/WeeklyReport";
import MultipleAttendance from "./Pages/MultipleAttendance";
import WeeklyPaidReportAllEmployees from "./Pages/WeeklyPaidReportAllEmployees";
import MonthlyReportPage from "./Pages/MonthlyReportPage";
import ProtectedRoute from "./Components/ProtectedRoute"; // Import the ProtectedRoute component

const App = () => {
  return (
    <Router>
      {/* Render Navbar for all routes except the login page */}
      <Routes>
        <Route
          path="/"
          element={<Navigate to={localStorage.getItem("loggedIn") === "true" ? "/dashboard" : "/login"} />}
        />
        <Route path="/login" element={<LoginPage />} />
        
        {/* Use ProtectedRoute for all protected routes */}
        <Route
          path="/dashboard"
          element={<ProtectedRoute element={<AdminDashboard />} />}
        />
        <Route
          path="/employee/:employeeId"
          element={<ProtectedRoute element={<EmployeeDetailsPage />} />}
        />
        <Route
          path="/employee/loan-details/:employeeId"
          element={<ProtectedRoute element={<LoanSummary />} />}
        />
        <Route
          path="/admin/:employeeId/:month/:weekNumber"
          element={<ProtectedRoute element={<PaymentPage />} />}
        />
        <Route
          path="/admin/add-employee"
          element={<ProtectedRoute element={<AddEmployee />} />}
        />
        <Route
          path="/admin/employee-management"
          element={<ProtectedRoute element={<EmployeesManagement />} />}
        />
        <Route
          path="/admin/multiple-attendance"
          element={<ProtectedRoute element={<MultipleAttendance />} />}
        />
        <Route
          path="/admin/weekly-report"
          element={<ProtectedRoute element={<WeeklyReportPage />} />}
        />
        <Route
          path="/admin/weekly-paid-report"
          element={<ProtectedRoute element={<WeeklyPaidReportAllEmployees />} />}
        />
        <Route
          path="/admin/monthly-paid-report"
          element={<ProtectedRoute element={<MonthlyReportPage />} />}
        />
      </Routes>

      {/* Add ToastContainer to show toasts */}
      <ToastContainer 
        position="top-right" // Customize position
        autoClose={1000} // Auto close after 1 seconds
        hideProgressBar={false} // Show progress bar
        newestOnTop={false} // Keep toasts in order of appearance
        closeOnClick // Close on click
        rtl={false} // Set false for left-to-right direction
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Router>
  );
};

export default App;
