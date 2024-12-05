import { useEffect, useState } from "react";
import axios from "../axios";
import * as XLSX from "xlsx";

const WeeklyReportPage = () => {
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7)); // Default to current month in yyyy-mm format
  const [weekNumber, setWeekNumber] = useState(1); // Default to week 1
  const [employees, setEmployees] = useState([]);
  const [reportDates, setReportDates] = useState({
    startDate: "",
    endDate: "",
  });

  // Fetch employee weekly report
  const fetchWeeklyReport = () => {
    axios
      .get(`/employees/get-weeklyPay/${month}/${weekNumber}`)
      .then((response) => {
        const { records } = response.data;
        setEmployees(records || []);

        if (records && records.length > 0) {
          setReportDates({
            startDate: records[0].startDate,
            endDate: records[0].endDate,
          });
        } else {
          setReportDates({ startDate: "", endDate: "" });
        }
      })
      .catch((error) => {
        console.error("Error fetching weekly report:", error);
      });
  };

  useEffect(() => {
    fetchWeeklyReport();
  }, [month, weekNumber]);

  // Handle Excel Download
  const handleDownloadExcel = () => {
    const formattedData = employees.map((emp, index) => ({
      "#": index + 1,
      "Employee ID": emp.employeeId,
      "Employee Name": emp.employeeName,
      "Days Present": emp.daysPresent,
      "Days Absent": emp.daysAbsent,
      "Amount Paid": emp.amountPaid,
      "Amount Deducted": emp.amountDeducted,
      "Total Amount": emp.totalAmount,
      Cash: emp.cash,
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Weekly Report");
    XLSX.writeFile(workbook, `Weekly_Report_${month}_Week${weekNumber}.xlsx`);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Header */}
        <div className="bg-indigo-600 px-6 py-4">
          <h2 className="text-2xl font-bold text-white text-center">
            Weekly Report of Employees
          </h2>
        </div>

        <div className="p-6">
          {/* Input Form */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-grow">
              <label className="block text-sm font-medium text-gray-700">
                Select Month
              </label>
              <input
                type="month"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div className="flex-grow">
              <label className="block text-sm font-medium text-gray-700">
                Select Week Number
              </label>
              <select
                value={weekNumber}
                onChange={(e) => setWeekNumber(Number(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              >
                {[1, 2, 3, 4, 5].map((week) => (
                  <option key={week} value={week}>
                    Week {week}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Report Dates */}
          {reportDates.startDate && reportDates.endDate && (
            <div className="mb-4 text-center text-gray-700">
              <p>
                <strong>Report Duration:</strong>{" "}
                {new Date(reportDates.startDate).toLocaleDateString()} -{" "}
                {new Date(reportDates.endDate).toLocaleDateString()}
              </p>
            </div>
          )}

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="table-auto w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-indigo-100 text-indigo-700">
                  <th className="border border-gray-300 px-4 py-2">#</th>
                  <th className="border border-gray-300 px-4 py-2">Name</th>
                  <th className="border border-gray-300 px-4 py-2">Cash</th>
                  <th className="border border-gray-300 px-4 py-2">
                    Days Present
                  </th>
                  <th className="border border-gray-300 px-4 py-2">
                    Days Absent
                  </th>
                  <th className="border border-gray-300 px-4 py-2">
                    Total Amount
                  </th>
                  <th className="border border-gray-300 px-4 py-2">
                    Amount Deducted
                  </th>
                  <th className="border border-gray-300 px-4 py-2">
                    Amount Paid
                  </th>
                </tr>
              </thead>
              <tbody>
                {employees.length > 0 ? (
                  employees.map((emp, index) => (
                    <tr key={emp.employeeId} className="text-gray-700">
                      <td className="border border-gray-300 px-4 py-2 text-center">
                        {index + 1}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-left">
                        {emp.employeeName}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-center">
                        ${emp.cash.toFixed(2)}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-center">
                        {emp.daysPresent}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-center">
                        {emp.daysAbsent}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-center">
                        ${emp.totalAmount.toFixed(2)}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-center">
                        ${emp.amountDeducted.toFixed(2)}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-center">
                        ${emp.amountPaid.toFixed(2)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="8"
                      className="border border-gray-300 px-4 py-2 text-center text-gray-500"
                    >
                      No data available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Download Button */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleDownloadExcel}
              className="bg-green-500 text-white px-6 py-3 rounded-lg shadow hover:bg-green-600 transition duration-300 ease-in-out"
            >
              Download Excel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeeklyReportPage;
