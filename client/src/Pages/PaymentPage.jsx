import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "../axios";
import { calculateSalary } from "../Components/calculateSalary";
import { toast, ToastContainer } from "react-toastify";
import Navbar from "../Components/Navbar";

const PaymentPage = () => {
  const [totalAmount, setTotalAmount] = useState();
  const [remainingAmount, setRemainingAmount] = useState();
  const { month, weekNumber, employeeId } = useParams();
  const [loanDetails, setLoanDetails] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [currentLoanIndex, setCurrentLoanIndex] = useState(null);
  const [currentLoanId, setCurrentLoanId] = useState(null);
  const [deductionAmount, setDeductionAmount] = useState("");
  const [deductedLoans, setDeductedLoans] = useState([]);
  const { state } = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setRemainingAmount(totalAmount);
  }, [totalAmount]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [payCheckResponse, payResponse, loanResponse] = await Promise.all(
          [
            axios
              .get(
                `/employees/${employeeId}/get-weeklyPay/${month}/${weekNumber}`
              )
              .catch((error) => {
                console.error("Error in weekly pay check API:", error);
                toast.error("Error in weekly pay check API.");
                return null; // Return null or a fallback value
              }),
            axios
              .get(`/employees/${employeeId}/get-weeklyPay/${month}`)
              .catch((error) => {
                console.error("Error in monthly pay API:", error);
                toast.error("Error in monthly pay API.");
                return null; // Return null or a fallback value
              }),
            axios.get(`/employees/${employeeId}`).catch((error) => {
              console.error("Error in employee details API:", error);
              toast.error("Error in employee details API.");
              return null; // Return null or a fallback value
            }),
          ]
        );

        if (payCheckResponse.data.paid) {
          console.log(payCheckResponse.data.paid);
          toast.info("Payment has already been processed for this week.");
          setRemainingAmount();
          setTotalAmount();
          return;
        }
        const result = calculateSalary(
          state.employeeSummary,
          payResponse.data.totalDaysPresent,
          state.weekStartDate,
          state.weekEndDate
        );
        setTotalAmount(result);
        setLoanDetails(loanResponse.data.employee.loan || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Error fetching data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [employeeId, month, state, weekNumber]);

  const handleDeductionChange = (e) => {
    const sanitizedValue = e.target.value.replace(/^0+(?!$)/, "");
    setDeductionAmount(sanitizedValue);
  };

  const handleDeduct = () => {
    if (currentLoanIndex !== null && currentLoanId) {
      const updatedLoanDetails = [...loanDetails];
      const loan = updatedLoanDetails[currentLoanIndex];
      if (loan.amount >= deductionAmount) {
        loan.amount -= deductionAmount;
        setLoanDetails(updatedLoanDetails);
        setRemainingAmount(remainingAmount - deductionAmount);
        setDeductedLoans((prevLoans) => [
          ...prevLoans,
          { loanId: currentLoanId, deductedAmount: deductionAmount },
        ]);
        toast.success("Loan deduction updated successfully!");
        closePopup();
      } else {
        toast.error("Deduction amount exceeds the loan amount!");
      }
    }
  };

  const openPopup = (index, loanId) => {
    setCurrentLoanIndex(index);
    setCurrentLoanId(loanId);
    setDeductionAmount("");
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setCurrentLoanIndex(null);
    setCurrentLoanId(null);
  };

  const handlePay = async () => {
    setLoading(true);
    try {
      if (deductedLoans.length > 0) {
        await Promise.all(
          deductedLoans.map((loan) =>
            axios.put(`/employees/${employeeId}/${loan.loanId}/deduct-loan`, {
              amount: loan.deductedAmount,
            })
          )
        );
      }

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
        fullDaysWithExtraWork:
          state?.employeeSummary?.fullDaysWithExtraWork || [],
        fullDaysWithoutExtraWork:
          state?.employeeSummary?.fullDaysWithoutExtraWork || 0,
        halfDays: state?.employeeSummary?.halfDays || 0,
        paid: state?.employeeSummary?.paid || false,
      };

      await axios.post(`/employees/${employeeId}/weeklyPay`, paymentDetails);

      toast.success("Payment processed successfully!", {
        onClose: () => {
          setDeductedLoans([]);
          navigate("/admin/weekly-report"); // Navigate to the report page after the toast closes
        },
      });
    } catch (error) {
      console.error("Error processing payment:", error);
      toast.error(
        "An error occurred while processing the payment. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <ToastContainer autoClose={500} />
      <Navbar />
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 bg-indigo-600">
            <h3 className="text-2xl leading-6 font-bold text-white">
              Payment Summary for Week {weekNumber} - {month}
            </h3>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            <div className="space-y-6">
              <div>
                <h4 className="text-lg leading-6 font-medium text-gray-900">
                  Loan Details
                </h4>
                {loanDetails.length === 0 ? (
                  <p className="mt-1 text-sm text-gray-500">
                    No loan details available.
                  </p>
                ) : (
                  <ul className="mt-3 grid grid-cols-1 gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {loanDetails.map((loan, index) => (
                      <li
                        key={loan._id}
                        className="col-span-1 bg-white rounded-lg shadow divide-y divide-gray-200"
                      >
                        <div className="w-full flex items-center justify-between p-6 space-x-6">
                          <div className="flex-1 truncate">
                            <div className="flex items-center space-x-3">
                              <h3 className="text-gray-900 text-sm font-medium truncate">
                                Loan {index + 1}
                              </h3>
                            </div>
                            <p className="mt-1 text-gray-500 text-sm truncate">
                              ₹{loan.amount.toFixed(2)}
                            </p>
                          </div>
                          <button
                            onClick={() => openPopup(index, loan._id)}
                            className="flex-shrink-0 bg-red-500 text-white text-sm font-medium px-3 py-1 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          >
                            Deduct
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:rounded-lg sm:p-6">
                <h4 className="text-lg leading-6 font-medium text-gray-900">
                  Payment Details
                </h4>
                <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">
                      Total Amount
                    </dt>
                    <dd className="mt-1 text-3xl font-semibold text-indigo-600">
                      {totalAmount != null
                        ? `₹ ${totalAmount.toFixed(2)}`
                        : " - "}
                    </dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">
                      Remaining Amount (After Loan Deduction)
                    </dt>
                    <dd className="mt-1 text-3xl font-semibold text-green-600">
                      {remainingAmount != null
                        ? `₹ ${remainingAmount.toFixed(2)}`
                        : " -  "}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
          <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
            {totalAmount === -1 ? (
              <p className="text-lg font-semibold text-gray-600">
                Payment already processed for this week.
              </p>
            ) : (
              <button
                onClick={handlePay}
                disabled={loading || totalAmount === -1}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {loading ? "Processing..." : "Process Payment"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Deduction Popup */}
      {isPopupOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl p-6">
            <h3 className="text-xl font-bold text-gray-900">Deduct Loan</h3>
            <input
              type="number"
              className="mt-4 border border-gray-300 p-2 rounded-md"
              value={deductionAmount}
              onChange={handleDeductionChange}
              placeholder="Enter amount to deduct"
            />
            <div className="mt-4 flex justify-end space-x-4">
              <button
                onClick={closePopup}
                className="px-4 py-2 text-sm font-medium text-gray-900 bg-gray-200 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleDeduct}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md"
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
