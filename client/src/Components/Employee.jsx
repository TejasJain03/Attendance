import  { useState, useEffect } from "react";
import axios from "../axios";
import { useParams } from "react-router-dom";

const EmployeeDetails = () => {
  const [employee, setEmployee] = useState();
  const [loading, setLoading] = useState(true);
  const { employeeId } = useParams();

  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/employees/${employeeId}`);
        setEmployee(response.data.employee);
      } catch (error) {
        console.error("Error fetching employee details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeDetails();
  }, [employeeId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-50 to-indigo-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-100 p-6 rounded-xl shadow-lg max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-indigo-800 mb-6 text-center">
        Employee Details
      </h2>

      {employee && (
        <div className="bg-white rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:shadow-xl">
          <div className="md:flex">
            <div className="md:w-1/2 p-6 bg-gradient-to-br from-indigo-500 to-blue-500">
              <h3 className="text-xl font-semibold text-white mb-4">
                Personal Information
              </h3>
              <div className="space-y-3 ">
                <p className="text-white text-lg">
                  <span className="font-medium">Name:</span>
                  <span className="ml-2">{employee.name}</span>
                </p>
                <p className="text-white">
                  <span className="font-medium">Per Day Salary:</span>
                  <span className="ml-2">
                    ₹{employee.perDayRate.toFixed(2)}
                  </span>
                </p>
              </div>
            </div>

            <div className="md:w-1/2 p-6">
              <h3 className="text-xl font-semibold text-indigo-800 mb-4">
                Payment Division
              </h3>
              <div className="space-y-4">
                <div className="bg-indigo-50 p-4 rounded-lg transition-all duration-300 hover:bg-indigo-100">
                  <p className="text-sm font-medium text-indigo-600">Account</p>
                  <p className="text-2xl font-bold text-indigo-800">
                    ₹{employee.paymentDivision.account.toFixed(2)}
                  </p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg transition-all duration-300 hover:bg-blue-100">
                  <p className="text-sm font-medium text-blue-600">Cash</p>
                  <p className="text-2xl font-bold text-blue-800">
                    ₹{employee.paymentDivision.cash.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeDetails;
