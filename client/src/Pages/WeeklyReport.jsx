import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../axios"; // Importing axios
import Navbar from "../Components/Navbar"; // Import Navbar

const WeeklyReportPage = () => {
  const [month, setMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
      2,
      "0"
    )}`;
  });
  const navigate = useNavigate();
  const [weekNumber, setWeekNumber] = useState(1);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeeklyReport = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `/employees/weekly-report/${month}/${weekNumber}`
        );

        console.log(response.data);
        setData(response.data); // Set the fetched data
        setError(null); // Clear any previous errors
      } catch (err) {
        console.error("Error fetching weekly report:", err);
        setError("Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchWeeklyReport();
  }, [month, weekNumber]);

  const handleMonthChange = (event) => {
    setMonth(event.target.value);
  };

  const handleWeekNumberChange = (event) => {
    setWeekNumber(parseInt(event.target.value));
  };

  const handlePay = (employeeId, employeeSummary) => {
    const { weekStartDate, weekEndDate, week } = data; // Assuming these are part of the fetched weekly report data
    console.log(`Paying for employee ID: ${employeeId}`);
    navigate(`/admin/${employeeId}/${month}/${weekNumber}`, {
      state: {
        employeeSummary,
        weekStartDate,
        weekEndDate,
        week,
      },
    });
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-extrabold text-center mb-10 text-indigo-900">
            Weekly Attendance Report
          </h1>

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 flex flex-wrap justify-between items-center">
              <div className="flex flex-wrap items-center space-x-4">
                <div>
                  <label
                    htmlFor="month"
                    className="block text-sm font-medium text-indigo-100"
                  >
                    Month
                  </label>
                  <input
                    type="month"
                    id="month"
                    value={month}
                    onChange={handleMonthChange}
                    className="mt-1 block w-full rounded-md bg-indigo-400 border-transparent focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-white placeholder-indigo-200"
                  />
                </div>
                <div>
                  <label
                    htmlFor="weekNumber"
                    className="block text-sm font-medium text-indigo-100"
                  >
                    Week
                  </label>
                  <input
                    type="number"
                    id="weekNumber"
                    min="1"
                    max="5"
                    value={weekNumber}
                    onChange={handleWeekNumberChange}
                    className="mt-1 block w-full rounded-md bg-indigo-400 border-transparent focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-white placeholder-indigo-200"
                  />
                </div>
              </div>
              {data && (
                <div className="text-white text-sm mt-4 sm:mt-0">
                  <span className="font-medium">Week Dates:</span>{" "}
                  {data.weekStartDate} - {data.weekEndDate}
                </div>
              )}
            </div>

            <div className="p-6">
              {loading && (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
                  <p className="mt-4 text-lg text-indigo-600">
                    Loading Weekly Report...
                  </p>
                </div>
              )}

              {error && (
                <div className="text-center py-8">
                  <svg
                    className="mx-auto h-12 w-12 text-red-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="mt-4 text-lg text-red-600">Error: {error}</p>
                </div>
              )}

              {!loading && !error && !data && (
                <div className="text-center py-8">
                  <svg
                    className="mx-auto h-12 w-12 text-indigo-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 000-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                    />
                  </svg>
                  <p className="mt-4 text-lg text-indigo-600">
                    No data available for the selected week.
                  </p>
                </div>
              )}

              {!loading && !error && data && (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {data.attendanceSummary.map((employee) => (
                    <div
                      key={employee.employeeId}
                      className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 shadow-md transition-all duration-300 hover:shadow-lg"
                    >
                      <h3 className="text-xl font-bold mb-4 text-indigo-900 truncate">
                        {employee.employee.name}
                      </h3>
                      <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                        {[
                          { label: "Present", value: employee.daysPresent },
                          { label: "Absent", value: employee.daysAbsent },
                          {
                            label: "Extra Work",
                            value: employee.fullDaysWithExtraWork.length,
                          },

                          { label: "Half Days", value: employee.halfDays },
                          {
                            label: "Cash",
                            value: `₹${employee.employee.paymentDivision.cash}`,
                          },
                        ].map((item, index) => (
                          <div
                            key={index}
                            className="bg-white rounded-lg p-3 text-center shadow-sm"
                          >
                            <p className="font-medium text-indigo-600 mb-1">
                              {item.label}
                            </p>
                            <p className="font-bold text-2xl text-indigo-900">
                              {item.value}
                            </p>
                          </div>
                        ))}
                      </div>
                      <button
                        disabled={employee.paid}
                        onClick={() => {
                          if (employee.paid) return; // Prevent the onClick handler if employee is already paid
                          handlePay(employee.employeeId, employee);
                        }}
                        className={`w-full px-4 py-2 text-white text-lg font-semibold rounded-lg shadow-md transition-all duration-300 ${
                          employee.paid
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75"
                        }`}
                      >
                        {employee.paid ? "Paid" : "Pay"}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default WeeklyReportPage;
