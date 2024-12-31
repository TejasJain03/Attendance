import { useEffect, useState } from "react";
import axios from "../axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get("/employees");
        setEmployees(response.data.employees);
      } catch (error) {
        console.error("Error fetching employees:", error);
      } finally {
        setLoading(false); // Set loading to false once the data is fetched
      }
    };
    fetchEmployees();
  }, []);

  const handleViewDetails = (employeeId) => {
    navigate(`/employee/${employeeId}`);
  };

  const handleAddEmployee = () => {
    navigate("/admin/add-employee");
  };

  return (
    <div className="bg-gradient-to-br from-blue-100 to-purple-100 min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Employee Directory</h1>
          <button
            onClick={handleAddEmployee}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
          >
            Add Employee
          </button>
        </div>

        {/* Show loading spinner when data is being fetched */}
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <div className="border-t-4 border-blue-500 border-solid w-16 h-16 rounded-full animate-spin"></div> {/* Spinner */}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {employees.map((employee) => (
              <div
                key={employee._id}
                className="bg-white rounded-xl shadow-md overflow-hidden transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl"
              >
                <div className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center text-2xl font-bold text-white">
                      {employee.name.charAt(0)}
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800">{employee.name}</h2>
                      <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full uppercase font-semibold tracking-wide">
                        {employee.role || "Not Available"}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2 mb-4">
                    <p className="text-gray-600 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                      {employee.phoneNumber || "Not Available"}
                    </p>
                  </div>
                  <button
                    onClick={() => handleViewDetails(employee._id)}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeList;
