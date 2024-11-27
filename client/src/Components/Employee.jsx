import { useState, useEffect } from "react";
import axios from "../axios";
import { useParams } from "react-router-dom";

const EmployeeDetails = () => {
  const [employee, setEmployee] = useState(null);
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
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-indigo-100 to-purple-200 flex items-center justify-center p-4">
      <div className="bg-white shadow-2xl rounded-3xl w-full max-w-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6">
          <h2 className="text-3xl font-bold text-white text-center">
            Employee Details
          </h2>
        </div>

        {employee && (
          <div className="p-6 space-y-6">
            <div className="bg-gray-50 rounded-xl p-6 shadow-inner">
              <h3 className="text-xl font-semibold text-indigo-800 mb-4">Personal Information</h3>
              <div className="space-y-2">
                <p className="text-gray-700">
                  <span className="font-medium text-indigo-600">Name:</span> 
                  <span className="ml-2">{employee.name}</span>
                </p>
                <p className="text-gray-700">
                  <span className="font-medium text-indigo-600">Per Day Salary:</span> 
                  <span className="ml-2">${employee.perDayRate.toFixed(2)}</span>
                </p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 shadow-inner">
              <h3 className="text-xl font-semibold text-indigo-800 mb-4">Payment Division</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg shadow">
                  <p className="text-sm font-medium text-gray-500">Account</p>
                  <p className="text-lg font-bold text-indigo-600">
                    ${employee.paymentDivision.account.toFixed(2)}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                  <p className="text-sm font-medium text-gray-500">Cash</p>
                  <p className="text-lg font-bold text-indigo-600">
                    ${employee.paymentDivision.cash.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeDetails;

