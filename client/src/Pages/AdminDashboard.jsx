import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar"; // Import Navbar

const AdminDashboard = () => {
  const navigate = useNavigate();
  return (
    <>
    <Navbar/>
      <div className="bg-gradient-to-br from-purple-100 to-indigo-200 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="px-6 py-8 sm:px-10 sm:py-12">
              <div className="flex flex-col sm:flex-row justify-between items-center mb-10">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-6 sm:mb-0">
                  Admin Dashboard
                </h1>
              </div>

              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
                <div className="bg-gradient-to-br from-white to-gray-100 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105">
                  <div className="p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                      Employee Management
                    </h2>
                    <p className="text-gray-600 text-lg mb-4">
                      Manage employees with ease
                    </p>
                    <button
                      onClick={() => navigate("/admin/employee-management")}
                      className="w-full bg-indigo-600 text-white px-4 py-3 rounded-lg text-lg font-medium shadow-md transition-all duration-300 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
                    >
                      Go to Employee Management
                    </button>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-white to-gray-100 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105">
                  <div className="p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                      Multiple Attendance
                    </h2>
                    <p className="text-gray-600 text-lg mb-4">
                      Update attendance for multiple employees at once
                    </p>
                    <button
                      onClick={() => navigate("/admin/multiple-attendance")}
                      className="w-full bg-indigo-600 text-white px-4 py-3 rounded-lg text-lg font-medium shadow-md transition-all duration-300 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
                    >
                      Update Multiple Attendance
                    </button>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-white to-gray-100 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105">
                  <div className="p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                      Weekly Attendance Report
                    </h2>
                    <p className="text-gray-600 text-lg mb-4">
                      View and manage weekly attendance reports
                    </p>
                    <button
                      onClick={() => navigate("/admin/weekly-report")}
                      className="w-full bg-indigo-600 text-white px-4 py-3 rounded-lg text-lg font-medium shadow-md transition-all duration-300 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
                    >
                      View Weekly Report
                    </button>
                  </div>
                </div>

                {/* New Option: Weekly Paid Report */}
                <div className="bg-gradient-to-br from-white to-gray-100 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105">
                  <div className="p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                      Weekly Paid Report
                    </h2>
                    <p className="text-gray-600 text-lg mb-4">
                      View and manage weekly paid reports
                    </p>
                    <button
                      onClick={() => navigate("/admin/weekly-paid-report")}
                      className="w-full bg-indigo-600 text-white px-4 py-3 rounded-lg text-lg font-medium shadow-md transition-all duration-300 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
                    >
                      View Weekly Paid Report
                    </button>
                  </div>
                </div>

                {/* New Option: Monthly Report */}
                <div className="bg-gradient-to-br from-white to-gray-100 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105">
                  <div className="p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                      Monthly Report
                    </h2>
                    <p className="text-gray-600 text-lg mb-4">
                      View and manage monthly reports
                    </p>
                    <button
                      onClick={() => navigate("/admin/monthly-paid-report")}
                      className="w-full bg-indigo-600 text-white px-4 py-3 rounded-lg text-lg font-medium shadow-md transition-all duration-300 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
                    >
                      View Monthly Report
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
