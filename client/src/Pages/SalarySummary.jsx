import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../axios";
import { useNavigate } from "react-router-dom";

const SalarySummary = () => {
  const { employeeId } = useParams();
  const [employeeDetails, setEmployeeDetails] = useState(null);
  const [attendanceDetails, setAttendanceDetails] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [years, setYears] = useState([]);
  const [months, setMonths] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const years = Array.from({ length: 10 }, (_, i) => 2022 + i);
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    setYears(years);
    setMonths(months);
  }, []);

  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      try {
        const response = await axios.get(`/employees/${employeeId}`);
        setEmployeeDetails(response.data.employee);
      } catch (error) {
        console.error("Error fetching employee details:", error);
      }
    };

    fetchEmployeeDetails();
  }, [employeeId]);

  useEffect(() => {
    if (selectedMonth && selectedYear) {
      const fetchAttendanceData = async () => {
        try {
          const selectedMonthYear = `${selectedYear}-${String(
            months.indexOf(selectedMonth) + 1
          ).padStart(2, "0")}`;
          const response = await axios.get(
            `/employees/${employeeId}/attendance/${selectedMonthYear}`
          );

          const data = response.data.weeklyAttendanceSummary;
          setAttendanceDetails(data);
          console.log(data);
        } catch (error) {
          setAttendanceDetails("");
          console.error("Error fetching attendance data:", error);
        }
      };

      fetchAttendanceData();
    }
  }, [selectedMonth, selectedYear, employeeId, months]);

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
  };

  return (
    <div className="min-h-screen bg-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-slate-900 mb-10">
          Salary Summary
        </h1>

        {employeeDetails && (
          <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-8">
            <div className="bg-emerald-600 text-white py-4 px-6">
              <h4 className="text-2xl font-semibold">Employee Details</h4>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-lg">
                <span className="font-semibold text-slate-700">
                  Employee Name:
                </span>{" "}
                <span className="text-slate-900">{employeeDetails.name}</span>
              </p>
              <p className="text-lg">
                <span className="font-semibold text-slate-700">
                  Account Salary:
                </span>{" "}
                <span className="text-slate-900">
                  ${employeeDetails.paymentDivision.account}
                </span>
              </p>
              <p className="text-lg">
                <span className="font-semibold text-slate-700">
                  Cash Salary:
                </span>{" "}
                <span className="text-slate-900">
                  ${employeeDetails.paymentDivision.cash}
                </span>
              </p>
              <p className="text-lg">
                <span className="font-semibold text-slate-700">
                  Per Day Salary:
                </span>{" "}
                <span className="text-slate-900">
                  ${employeeDetails.perDayRate}
                </span>
              </p>
            </div>
          </div>
        )}

        <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-8">
          <div className="bg-amber-600 text-white py-4 px-6">
            <h4 className="text-2xl font-semibold">Select Period</h4>
          </div>
          <div className="p-6 flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <select
              value={selectedYear}
              onChange={handleYearChange}
              className="w-full sm:w-auto px-4 py-2 text-slate-700 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
            >
              <option value="">Select Year</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            <select
              value={selectedMonth}
              onChange={handleMonthChange}
              className="w-full sm:w-auto px-4 py-2 text-slate-700 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
            >
              <option value="">Select Month</option>
              {months.map((month, index) => (
                <option key={index} value={month}>
                  {month}
                </option>
              ))}
            </select>
          </div>
        </div>

        {attendanceDetails.length > 0 && selectedYear && selectedMonth && (
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="bg-indigo-600 text-white py-4 px-6">
              <h4 className="text-2xl font-semibold">
                Attendance Summary for {selectedMonth} {selectedYear}
              </h4>
            </div>
            <div className="p-6 overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-indigo-100">
                    <th className="border border-indigo-200 px-4 py-2 text-left text-indigo-800">
                      Week
                    </th>
                    <th className="border border-indigo-200 px-4 py-2 text-left text-indigo-800">
                      Full Days
                    </th>
                    <th className="border border-indigo-200 px-4 py-2 text-left text-indigo-800">
                      Half Days
                    </th>
                    <th className="border border-indigo-200 px-4 py-2 text-left text-indigo-800">
                      Days Absent
                    </th>
                    <th className="border border-indigo-200 px-4 py-2 text-left text-indigo-800">
                      Amount Earned
                    </th>
                    <th className="border border-indigo-200 px-4 py-2 text-left text-indigo-800">
                      Cash Earned
                    </th>
                    <th className="border border-indigo-200 px-4 py-2 text-left text-indigo-800">
                      Total Earned
                    </th>
                    <th className="border border-indigo-200 px-4 py-2 text-left text-indigo-800">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceDetails.map((weekData, index) => {
                    const perDayRate = employeeDetails?.perDayRate || 0;
                    const accountRate =
                      employeeDetails?.paymentDivision?.account || 0;
                    const cashRate =
                      employeeDetails?.paymentDivision?.cash || 0;

                    const fullDays = weekData.fullDays;
                    const halfDays = weekData.halfDays;
                    const daysAbsent = weekData.daysAbsent;

                    // Calculate earnings based on full days, half days, and absent days
                    const fullDayEarnings = fullDays * perDayRate;
                    const halfDayEarnings = halfDays * (perDayRate / 2); // Assuming half day earns half the per day rate

                    // Calculate the amount earned
                    const amountEarned =
                      fullDayEarnings +
                      halfDayEarnings +
                      fullDays *
                        (accountRate / (accountRate + cashRate)) *
                        perDayRate;

                    // Calculate the cash earned
                    const cashEarned =
                      fullDayEarnings +
                      halfDayEarnings +
                      fullDays *
                        (cashRate / (accountRate + cashRate)) *
                        perDayRate;

                    const totalEarned = fullDayEarnings + halfDayEarnings;

                    // Pay button handler
                    const handlePay = () => {
                      const data = {
                        week: weekData.week,
                        month: selectedMonth,
                        amount: totalEarned,
                      };
                      console.log("Paying for", data);
                      navigate(
                        `/admin/${employeeId}/${selectedYear}/${selectedMonth}/${weekData.week}`,
                        { state: { totalAmount: totalEarned } }
                      ); // Example of passing data
                    };

                    return (
                      <tr
                        key={index}
                        className={
                          index % 2 === 0 ? "bg-indigo-50" : "bg-white"
                        }
                      >
                        <td className="border border-indigo-200 px-4 py-2">
                          {weekData.week}
                        </td>
                        <td className="border border-indigo-200 px-4 py-2">
                          {fullDays}
                        </td>
                        <td className="border border-indigo-200 px-4 py-2">
                          {halfDays}
                        </td>
                        <td className="border border-indigo-200 px-4 py-2">
                          {daysAbsent}
                        </td>
                        <td className="border border-indigo-200 px-4 py-2">
                          ${amountEarned.toFixed(2)}
                        </td>
                        <td className="border border-indigo-200 px-4 py-2">
                          ${cashEarned.toFixed(2)}
                        </td>
                        <td className="border border-indigo-200 px-4 py-2">
                          ${totalEarned.toFixed(2)}
                        </td>
                        <td className="border border-indigo-200 px-4 py-2">
                          <button
                            onClick={handlePay}
                            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                          >
                            Pay
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SalarySummary;
