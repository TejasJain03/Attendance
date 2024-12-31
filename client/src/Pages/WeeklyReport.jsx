/* eslint-disable react/no-unescaped-entities */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../axios";
import Navbar from "../Components/Navbar";

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
        setData(response.data);
        setError(null);
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
    const { weekStartDate, weekEndDate, week } = data;
    navigate(`/admin/${employeeId}/${month}/${weekNumber}`, {
      state: {
        employeeSummary,
        weekStartDate,
        weekEndDate,
        week,
      },
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0"); // Ensure 2 digits
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-6">
            Weekly Attendance Report
          </h1>

          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 bg-white border-b border-gray-200">
              <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                  <label
                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                    htmlFor="month"
                  >
                    Month
                  </label>
                  <input
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    id="month"
                    type="month"
                    value={month}
                    onChange={handleMonthChange}
                  />
                </div>
                <div className="w-full md:w-1/2 px-3">
                  <label
                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                    htmlFor="weekNumber"
                  >
                    Week
                  </label>
                  <input
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    id="weekNumber"
                    type="number"
                    min="1"
                    max="5"
                    value={weekNumber}
                    onChange={handleWeekNumberChange}
                  />
                </div>
              </div>

              {data && (
                <div className="mb-6 text-sm text-gray-600">
                  <span className="font-medium">Week Dates:</span>{" "}
                  {formatDate(data.weekStartDate)} -{" "}
                  {formatDate(data.weekEndDate)}
                </div>
              )}

              {loading && (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                </div>
              )}

              {error && (
                <div
                  className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6"
                  role="alert"
                >
                  <p className="font-bold">Error</p>
                  <p>{error}</p>
                </div>
              )}

              {!loading && !error && !data && (
                <div className="text-center py-12">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 01-.707-.293l-2.414-2.414a1 1 0 00-.707-.293h-3.172a1 1 0 00-.707.293l-2.414 2.414A1 1 0 016.586 13H4"
                    />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    No data available
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    There's no data available for the selected week.
                  </p>
                </div>
              )}

              {!loading && !error && data && (
                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  {data.attendanceSummary.map((employee) => (
                    <div
                      key={employee.employeeId}
                      className="bg-white overflow-hidden shadow rounded-lg"
                    >
                      <div className="px-4 py-5 sm:p-6">
                        <h3 className="text-2xl leading-6 font-medium text-gray-900 truncate">
                          {employee.employee.name}
                        </h3>
                        <div className="mt-5 grid grid-cols-2 gap-5">
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
                              className="bg-gray-50 px-4 py-5 sm:p-6"
                            >
                              <dt className="text-sm font-medium text-gray-500 truncate">
                                {item.label}
                              </dt>
                              <dd className="mt-1 text-3xl font-semibold text-gray-900">
                                {item.value}
                              </dd>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="bg-gray-50 px-4 py-4 sm:px-6">
                        <button
                          disabled={employee.paid}
                          onClick={() => {
                            if (!employee.paid)
                              handlePay(employee.employeeId, employee);
                          }}
                          className={`w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
                            employee.paid
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          }`}
                        >
                          {employee.paid ? "Paid" : "Pay"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeeklyReportPage;
