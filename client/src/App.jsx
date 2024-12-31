import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify"; // Import ToastContainer
import "react-toastify/dist/ReactToastify.css"; // Import the CSS for toasts
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
import ProtectedRoute from "./Components/ProtectedRoute";
import UpdateEmployee from "./Pages/UpdateEmployee";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Navigate
              to={
                localStorage.getItem("loggedIn") === "true"
                  ? "/dashboard"
                  : "/login"
              }
            />
          }
        />
        <Route path="/login" element={<LoginPage />} />
        {/* Protected routes */}
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
          path="/admin/update-employee/:employeeId"
          element={<ProtectedRoute element={<UpdateEmployee />} />}
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
          element={
            <ProtectedRoute element={<WeeklyPaidReportAllEmployees />} />
          }
        />
        <Route
          path="/admin/monthly-paid-report"
          element={<ProtectedRoute element={<MonthlyReportPage />} />}
        />
      </Routes>

      {/* ToastContainer for global toast notifications */}
      <ToastContainer
        position="top-right"
        autoClose={1000} // Auto close after 3 seconds
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Router>
  );
};

export default App;
