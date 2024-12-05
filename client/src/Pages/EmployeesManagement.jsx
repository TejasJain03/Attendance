import { useEffect, useState } from "react";
import axios from "../axios";
import { useNavigate } from "react-router-dom";

const EmployeeList = () => {
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

  const handleViewDetails = (employeeId) => {
    navigate(`/employee/${employeeId}`);
  };

  const handleAddEmployee = () => {
    navigate("/admin/add-employee");
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-200 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
          <div className="px-6 py-8 sm:px-10 sm:py-12">
            <div className="flex justify-between items-center mb-10">
              <h1 className="text-4xl font-semibold text-gray-900">Employee List</h1>
              <button
                onClick={handleAddEmployee}
                className="bg-green-500 text-white px-6 py-3 rounded-full font-semibold shadow-xl hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105"
              >
                Add Employee
              </button>
            </div>

            <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {employees.map((employee) => (
                <div
                  key={employee._id}
                  className="bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105 transform"
                >
                  <div className="p-6 flex flex-col justify-between h-full">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800 mb-2">{employee.name}</h2>
                      <p className="text-gray-600 text-md mb-2">
                        <strong>Phone:</strong> 
                        <span className="font-semibold text-emerald-600 ml-2">
                          {employee.phoneNumber ? employee.phoneNumber : "Not Available"}
                        </span>
                      </p>
                      <p className="text-gray-600 text-md mb-4">
                        <strong>Role:</strong>
                        <span className="font-semibold text-emerald-600 ml-2">
                          {employee.role ? employee.role : "Not Available"}
                        </span>
                      </p>
                    </div>
                    <button
                      onClick={() => handleViewDetails(employee._id)}
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

export default EmployeeList;
