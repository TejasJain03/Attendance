import { useLocation, useParams } from "react-router-dom"; // to access route params and state
import { useState, useEffect } from "react";
import axios from "../axios";

const PaymentPage = () => {
  const { totalAmount } = useLocation().state || 0; // Get the total amount passed in state
  const { month, year, weekNumber, employeeId } = useParams(); // Get the month, year, and week from the URL
  const [loanDetails, setLoanDetails] = useState([]);
  const [remainingAmount, setRemainingAmount] = useState(totalAmount);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [currentLoanIndex, setCurrentLoanIndex] = useState(null);
  const [currentLoanId, setCurrentLoanId] = useState(null); // New state for loanId
  const [deductionAmount, setDeductionAmount] = useState(0);

  useEffect(() => {
    // Fetch loan details when the page loads
    axios
      .get(`/employees/${employeeId}`) // Adjust the endpoint as necessary
      .then((response) => {
        setLoanDetails(response.data.employee.loan || []); // Assuming response.data.employee.loan contains the loan details
      })
      .catch((error) => {
        console.error("Error fetching loan details:", error);
      });
  }, [employeeId]);

  const handleDeductionChange = (e) => {
    setDeductionAmount(parseFloat(e.target.value) || 0);
  };


  const handlePay = () => {
    console.log("Final payment amount:", remainingAmount);
    alert(`Payment of $${remainingAmount.toFixed(2)} processed successfully!`);
  };

  const openPopup = (index, loanId) => {
    setCurrentLoanIndex(index);
    setCurrentLoanId(loanId); // Store the loanId
    setDeductionAmount(0); // Reset deduction amount
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setCurrentLoanIndex(null);
    setCurrentLoanId(null); // Reset loanId when closing the popup
  };

  const handleDeduct = () => {
    if (currentLoanIndex !== null && currentLoanId) {
      const updatedLoanDetails = [...loanDetails];
      const loan = updatedLoanDetails[currentLoanIndex];
      if (loan.amount >= deductionAmount) {
        loan.amount -= deductionAmount;
        axios
          .put(`/employees/${employeeId}/${currentLoanId}/deduct-loan`, { amount: deductionAmount })
          .then((response) => {
            setLoanDetails(response.data.loan); // Update loan details
          })
          .catch((err) => {
            alert("Error:", err);
          });
        setRemainingAmount(remainingAmount - deductionAmount);
        closePopup();
      } else {
        alert("Deduction amount exceeds the loan amount!");
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8">
      <h3 className="text-3xl font-bold mb-6 text-center">
        Payment Summary for Week {weekNumber} - {month} {year}
      </h3>

      {/* Loan Details */}
      <div className="mb-6">
        <h4 className="text-2xl font-semibold mb-4 text-indigo-600">
          Loan Details
        </h4>
        {loanDetails.length === 0 ? (
          <p className="text-gray-600">No loan details available.</p>
        ) : (
          <ul className="bg-gray-100 p-4 rounded-md shadow-md">
            {loanDetails.map((loan, index) => (
              <li
                key={loan._id} // Use loan._id as the key
                className="flex justify-between items-center py-2 px-4 bg-white rounded-md shadow-sm mb-2"
              >
                <div>
                  <span className="font-medium text-gray-700">
                    Loan {index + 1}:
                  </span>
                  <span className="text-lg font-semibold text-gray-800 ml-2">
                    ${loan.amount.toFixed(2)}
                  </span>
                </div>
                <button
                  onClick={() => openPopup(index, loan._id)} // Pass loan._id
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                >
                  Deduct
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Payment Summary */}
      <div className="bg-gray-50 p-6 rounded-md shadow-md mb-6">
        <h4 className="text-xl font-semibold mb-4 text-gray-800">
          Payment Details
        </h4>
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-700 font-medium">Total Amount:</span>
          <span className="text-lg font-bold text-gray-800">
            ${totalAmount.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-700 font-medium">
            Remaining Amount (After Loan Deduction):
          </span>
          <span className="text-lg font-bold text-green-600">
            ${remainingAmount.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center">
        
        <button
          onClick={handlePay}
          className="bg-blue-500 text-white px-6 py-3 rounded-md shadow-md hover:bg-blue-600"
        >
          Pay
        </button>
      </div>

      {/* Deduction Popup */}
      {isPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h4 className="text-xl font-bold mb-4 text-center">Deduct Loan</h4>
            <label className="block text-lg mb-2">
              Enter Deduction Amount:
            </label>
            <input
              type="number"
              value={deductionAmount}
              onChange={handleDeductionChange}
              className="w-full border border-gray-300 p-3 rounded-md mb-4"
            />
            <div className="flex justify-end gap-4">
              <button
                onClick={closePopup}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleDeduct}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
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
