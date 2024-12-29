/* eslint-disable no-undef */
import { useState, useEffect } from "react";
import axios from "../axios";
import LoanForm from "../Components/LoanForm";
import { useParams } from "react-router-dom";

const LoanSummaryPage = () => {
  const { employeeId } = useParams();
  const [employee, setEmployee] = useState(null);
  const [showAddLoanModal, setShowAddLoanModal] = useState(false);
  const [showRepayModal, setShowRepayModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  useEffect(() => {
    axios
      .get(`/employees/${employeeId}`)
      .then((response) => {
        setEmployee(response.data.employee);
      })
      .catch((error) => {
        console.error("Error fetching employee data:", error);
      });
  }, [employeeId]);

  const totalLoanAmount = employee?.loan?.reduce((total, loan) => total + loan.amount, 0) || 0;

  const handleAddLoanClick = () => {
    setSelectedEmployee(employee);
    setShowAddLoanModal(true);
  };


  const closeAddLoanModal = () => setShowAddLoanModal(false);
  const closeRepayModal = () => setShowRepayModal(false);

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-10">Loan Summary</h1>

        {employee ? (
          <>
            <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-8">
              <div className="bg-indigo-600 text-white py-4 px-6">
                <h2 className="text-2xl font-semibold">Employee Details</h2>
              </div>
              <div className="p-6 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Name</p>
                  <p className="mt-1 text-lg font-semibold text-gray-900">{employee.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Loan Amount</p>
                  <p className="mt-1 text-lg font-semibold text-gray-900">
                    {totalLoanAmount > 0 ? `$${totalLoanAmount.toFixed(2)}` : "No loan taken"}
                  </p>
                </div>
              </div>
            </div>

            {employee.loan && employee.loan.length > 0 ? (
              <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-8">
                <div className="bg-green-600 text-white py-4 px-6">
                  <h2 className="text-2xl font-semibold">Loan History</h2>
                </div>
                <div className="p-6 overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Loan Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date Taken
                        </th>
                        
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {employee.loan.map((loan, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            ${loan.amount.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(loan.dateTaken).toLocaleDateString()}
                          </td>
                          
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-8">
                <div className="p-6">
                  <p className="text-center text-gray-500">No loan history available.</p>
                </div>
              </div>
            )}

            <div className="text-center mt-8">
              <button
                onClick={handleAddLoanClick}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
              >
                Add Loan
              </button>
            </div>
          </>
        ) : (
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="p-6">
              <p className="text-center text-gray-500">Loading employee data...</p>
            </div>
          </div>
        )}

        {/* Add Loan Modal */}
        {showAddLoanModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-gray-900">
                  Add Loan to {selectedEmployee?.name}
                </h2>
                <button
                  onClick={closeAddLoanModal}
                  className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                >
                  &times;
                </button>
              </div>
              <LoanForm employee={selectedEmployee} closeModal={closeAddLoanModal} />
            </div>
          </div>
        )}

        {/* Repay Loan Modal */}
        {showRepayModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-gray-900">
                  Repay Loan of ${selectedLoan?.amount.toFixed(2)}
                </h2>
                <button
                  onClick={closeRepayModal}
                  className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                >
                  &times;
                </button>
              </div>
              <form>
                <div className="mb-4">
                  <label
                    htmlFor="repaymentAmount"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Repayment Amount
                  </label>
                  <input
                    type="number"
                    id="repaymentAmount"
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={closeRepayModal}
                    className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded mr-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded"
                  >
                    Repay
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoanSummaryPage;
