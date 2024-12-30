import { useEffect, useState } from "react";
import axios from "../axios"; // Make sure this is your axios instance
import * as XLSX from "xlsx";
import Navbar from "../Components/Navbar"; // Import Navbar

const MonthlyReportPage = () => {
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7)); // Default to current month in yyyy-mm format
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false); // State to manage loading
  const [error, setError] = useState(false); // State to track errors

  // Fetch employee monthly report
  const fetchMonthlyReport = () => {
    setLoading(true); // Show loader while fetching data
    setError(false); // Reset error state before the request
    axios
      .get(`/employees/monthly-report/${month}`)
      .then((response) => {
        const { reports } = response.data; // Assuming your API returns the data in 'reports' key
        console.log(reports);
        setEmployees(reports || []);
        setLoading(false); // Hide loader after fetching data
      })
      .catch((error) => {
        console.error("Error fetching monthly report:", error);
        setEmployees([]); // Ensure no previous data is shown
        setError(true); // Set error state to true
        setLoading(false); // Hide loader in case of error
      });
  };

  useEffect(() => {
    fetchMonthlyReport();
  }, [month]);

  const handleDownloadExcel = () => {
    const formattedData = employees.map((emp, index) => ({
      "Sr. No.": index + 1,
      "Employee Name": emp.employeeName,
      "Days Present": emp.totalDaysPresent,
      "Days Absent": emp.totalDaysAbsent,
      "Total Amount Paid": emp.totalAmountPaid,
      "Extra Work Days": emp.totalExtraWorkDays,
      "Full Days Without Extra Work": emp.totalFullDaysWithoutExtraWork,
      "Half Days": emp.totalHalfDays,
    }));

    // Custom headers
    const customHeader = [
      [`Monthly Report`], // Main title
      [`Month: ${month}`], // Month
      [], // Empty row
    ];

    // Convert data to worksheet
    const worksheet = XLSX.utils.json_to_sheet(formattedData, { origin: "A4" });

    // Add custom headers at the top
    XLSX.utils.sheet_add_aoa(worksheet, customHeader, { origin: "A1" });

    // Adjust column widths
    const columnWidths = [
      { wch: 20 },
      { wch: 20 },
      { wch: 15 },
      { wch: 15 },
      { wch: 20 },
      { wch: 15 },
      { wch: 25 },
      { wch: 15 },
    ];
    worksheet["!cols"] = columnWidths;

    // Merge cells for main title
    worksheet["!merges"] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 7 } }, // Merge A1:H1 for "Monthly Report"
    ];

    // Create workbook and append worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Monthly Report");

    // Write to file
    XLSX.writeFile(workbook, `Monthly_Report_${month}.xlsx`);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-indigo-600 px-6 py-4">
            <h2 className="text-2xl font-bold text-white text-center">
              Monthly Report of Employees
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
                  className="mt-1 block w-auto rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Loader */}
            {loading && (
              <div className="flex justify-center items-center py-6">
                <div className="w-16 h-16 border-t-4 border-indigo-600 border-solid rounded-full animate-spin"></div>
              </div>
            )}

            {/* Error / No Reports */}
            {error && !loading && (
              <div className="text-center text-gray-500 py-6">
                <p>No reports available for this month.</p>
              </div>
            )}

            {/* No Reports / Table */}
            {!loading && employees.length === 0 && !error && (
              <div className="text-center text-gray-500 py-6">
                <p>No reports available for this month.</p>
              </div>
            )}

            {!loading && employees.length > 0 && !error && (
              <div className="overflow-x-auto">
                <table className="table-auto w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-indigo-100 text-indigo-700">
                      <th className="border border-gray-300 px-4 py-2">#</th>
                      <th className="border border-gray-300 px-4 py-2">
                        Employee Name
                      </th>
                      <th className="border border-gray-300 px-4 py-2">
                        Days Present
                      </th>
                      <th className="border border-gray-300 px-4 py-2">
                        Days Absent
                      </th>
                      <th className="border border-gray-300 px-4 py-2">
                        Total Amount Paid
                      </th>
                      <th className="border border-gray-300 px-4 py-2">
                        Extra Work Days
                      </th>
                    
                      <th className="border border-gray-300 px-4 py-2">
                        Half Days
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {employees.map((emp, index) => (
                      <tr key={emp.employeeId} className="text-gray-700">
                        <td className="border border-gray-300 px-4 py-2 text-center">
                          {index + 1}
                        </td>
                        <td className="border border-gray-300 px-4 py-2 text-left">
                          {emp.employeeName}
                        </td>
                        <td className="border border-gray-300 px-4 py-2 text-center">
                          {emp.totalDaysPresent}
                        </td>
                        <td className="border border-gray-300 px-4 py-2 text-center">
                          {emp.totalDaysAbsent}
                        </td>
                        <td className="border border-gray-300 px-4 py-2 text-center">
                          ${emp.totalAmountPaid.toFixed(2)}
                        </td>
                        <td className="border border-gray-300 px-4 py-2 text-center">
                          {emp.totalExtraWorkDays}
                        </td>
                       
                        <td className="border border-gray-300 px-4 py-2 text-center">
                          {emp.totalHalfDays}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Download Button */}
            {!loading && employees.length > 0 && !error && (
              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleDownloadExcel}
                  className="bg-green-500 text-white px-6 py-3 rounded-lg shadow hover:bg-green-600 transition duration-300 ease-in-out"
                >
                  Download Excel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MonthlyReportPage;
