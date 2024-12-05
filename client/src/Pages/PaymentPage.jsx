import { useLocation, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "../axios";
import { calculateSalary } from "../Components/calculateSalary";

const PaymentPage = () => {
  const [totalAmount, setTotalAmount] = useState(0);
  const [remainingAmount, setRemainingAmount] = useState(0); // Dynamically updates based on totalAmount
  const { month, weekNumber, employeeId } = useParams();
  const [loanDetails, setLoanDetails] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [currentLoanIndex, setCurrentLoanIndex] = useState(null);
  const [currentLoanId, setCurrentLoanId] = useState(null);
  const [deductionAmount, setDeductionAmount] = useState("");
  const { state } = useLocation();

  // Update remainingAmount when totalAmount changes
  useEffect(() => {
    setRemainingAmount(totalAmount);
  }, [totalAmount]);

  useEffect(() => {
    console.log(state);
    axios
      .get(`/employees/${employeeId}/get-weeklyPay/${month}`)
      .then((response) => {
        const result = calculateSalary(
          state.employeeSummary,
          response.data.totalDaysPresent
        );
        setTotalAmount(result); // Update totalAmount
      })
      .catch((err) => {
        console.log(err);
      });

    axios
      .get(`/employees/${employeeId}`)
      .then((response) => {
        setLoanDetails(response.data.employee.loan || []);
      })
      .catch((error) => {
        console.error("Error fetching loan details:", error);
      });
  }, [employeeId, month, state]);

  const handleDeductionChange = (e) => {
    const value = e.target.value;
    const sanitizedValue = value.replace(/^0+(?!$)/, ""); // Remove leading zeros
    setDeductionAmount(sanitizedValue);
  };

  const handleDeduct = () => {
    if (currentLoanIndex !== null && currentLoanId) {
      const updatedLoanDetails = [...loanDetails];
      const loan = updatedLoanDetails[currentLoanIndex];
      if (loan.amount >= deductionAmount) {
        loan.amount -= deductionAmount; // Update loan details
        setLoanDetails(updatedLoanDetails);
        setRemainingAmount(remainingAmount - deductionAmount); // Deduct from remainingAmount
        closePopup();
      } else {
        alert("Deduction amount exceeds the loan amount!");
      }
    }
  };

  const openPopup = (index, loanId) => {
    setCurrentLoanIndex(index);
    setCurrentLoanId(loanId);
    setDeductionAmount(0);
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setCurrentLoanIndex(null);
    setCurrentLoanId(null);
  };

  const handlePay = () => {
    const paymentDetails = {
      totalDays: state?.employeeSummary?.totalDays || 0,
      daysPresent: state?.employeeSummary?.daysPresent || 0,
      daysAbsent: state?.employeeSummary?.daysAbsent || 0,
      startDate: state?.weekStartDate || "N/A",
      endDate: state?.weekEndDate || "N/A",
      cash: state?.employeeSummary?.employee?.paymentDivision?.cash || 0,
      totalAmount: totalAmount.toFixed(2),
      amountDeducted: (totalAmount - remainingAmount).toFixed(2),
      remainingAmount: remainingAmount.toFixed(2),
      amountPaid: remainingAmount.toFixed(2),
      month: month,
      weekNumber: state?.week,
    };

    axios
      .post(`/employees/${employeeId}/weeklyPay`, paymentDetails)
      .then((response) => {
        console.log("Response:", response.data);
      })
      .catch((error) => {
        console.error("Error processing payment:", error);
      });
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden">
        <div className="bg-indigo-600 px-6 py-4">
          <h3 className="text-2xl font-bold text-white">
            Payment Summary for Week {weekNumber} - {month}
          </h3>
        </div>

        <div className="p-6 space-y-8">
          {/* Loan Details */}
          <div>
            <h4 className="text-xl font-semibold mb-4 text-indigo-700">
              Loan Details
            </h4>
            {loanDetails.length === 0 ? (
              <p className="text-gray-600 italic">No loan details available.</p>
            ) : (
              <ul className="space-y-3">
                {loanDetails.map((loan, index) => (
                  <li
                    key={loan._id}
                    className="flex justify-between items-center bg-gray-50 p-4 rounded-lg shadow"
                  >
                    <div>
                      <span className="text-gray-700 font-medium">
                        Loan {index + 1}:
                      </span>
                      <span className="text-lg font-semibold text-indigo-600 ml-2">
                        ${loan.amount.toFixed(2)}
                      </span>
                    </div>
                    <button
                      onClick={() => openPopup(index, loan._id)}
                      className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
                    >
                      Deduct
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Payment Summary */}
          <div className="bg-indigo-50 p-6 rounded-lg shadow">
            <h4 className="text-xl font-semibold mb-4 text-indigo-700">
              Payment Details
            </h4>
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-700 font-medium">Total Amount:</span>
              <span className="text-2xl font-bold text-indigo-600">
                ${totalAmount.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700 font-medium">
                Remaining Amount (After Loan Deduction):
              </span>
              <span className="text-2xl font-bold text-green-600">
                ${remainingAmount.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end">
            <button
              onClick={handlePay}
              className="bg-green-500 text-white px-8 py-3 rounded-md shadow-md hover:bg-green-600 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
            >
              Process Payment
            </button>
          </div>
        </div>
      </div>

      {/* Deduction Popup */}
      {isPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-2xl max-w-md w-full">
            <h4 className="text-2xl font-bold mb-6 text-center text-indigo-700">
              Deduct Loan
            </h4>
            <label className="block text-lg mb-2 text-gray-700">
              Enter Deduction Amount:
            </label>
            <input
              type="number"
              min="0"
              value={deductionAmount}
              onChange={handleDeductionChange}
              className="w-full border border-gray-300 p-3 rounded-md mb-6 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <div className="flex justify-end gap-4">
              <button
                onClick={closePopup}
                className="bg-gray-300 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-400 transition duration-300 ease-in-out"
              >
                Cancel
              </button>
              <button
                onClick={handleDeduct}
                className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600 transition duration-300 ease-in-out"
              >
                Deduct
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentPage;
