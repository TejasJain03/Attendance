import { useEffect, useState } from "react";
import axios from "../axios";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [employees, setEmployees] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get("/employees");
        setEmployees(response.data.employees);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };
    fetchEmployees();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("loggedIn");
    navigate("/login");
  };

  return (
    <div className="bg-gradient-to-br from-purple-100 to-indigo-200 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="px-6 py-8 sm:px-10 sm:py-12">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-10">
              <h1 className="text-4xl font-extrabold text-gray-900 mb-6 sm:mb-0">Employee List</h1>
              <div className="flex space-x-4">
                <button
                  onClick={() => navigate("/admin/add-employee")}
                  className="bg-emerald-500 text-white px-6 py-3 rounded-full font-semibold shadow-lg transition-all duration-300 hover:bg-emerald-600 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50"
                >
                  Add Employee
                </button>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-6 py-3 rounded-full font-semibold shadow-lg transition-all duration-300 hover:bg-red-600 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                >
                  Logout
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {employees.map((employee) => (
                <div
                  key={employee._id}
                  className="bg-gradient-to-br from-white to-gray-100 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105"
                >
                  <div className="p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">{employee.name}</h2>
                    <p className="text-gray-600 text-lg mb-4">Per Day Salary: 
                      <span className="font-semibold text-emerald-600 ml-2">${employee.perDayRate}</span>
                    </p>
                    <button
                      onClick={() => navigate(`/employee/${employee._id}`)}
                      className="w-full bg-indigo-600 text-white px-4 py-3 rounded-lg text-lg font-medium shadow-md transition-all duration-300 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

