import { toast } from "react-toastify"; // Import toast
import { useEffect, useState } from "react";
import axios from "../axios";
import * as XLSX from "xlsx";
import Navbar from "../Components/Navbar"; // Import Navbar

const WeeklyReportPage = () => {
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7)); // Default to current month in yyyy-mm format
  const [weekNumber, setWeekNumber] = useState(1); // Default to week 1
  const [employees, setEmployees] = useState([]);
  const [reportDates, setReportDates] = useState({
    startDate: "",
    endDate: "",
  });
  const [loading, setLoading] = useState(false); // State to manage loading

  // Fetch employee weekly report
  const fetchWeeklyReport = () => {
    setLoading(true); // Show loader while fetching data
    axios
      .get(`/employees/get-weeklyPay/${month}/${weekNumber}`)
      .then((response) => {
        const { records } = response.data;
        console.log(records);
        setEmployees(records || []);
        setLoading(false); // Hide loader after fetching data

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
        setLoading(false); // Hide loader in case of error
      });
  };

  useEffect(() => {
    fetchWeeklyReport();
  }, [month, weekNumber]);

  const handleDownloadExcel = () => {
    const formattedData = employees.map((emp, index) => ({
      "Sr. No.": index + 1,
      "Employee Name": emp.employeeName,
      "Daily Cash": emp.cash,
      "Days Present": emp.daysPresent,
      "Total Amount": emp.totalAmount,
      "Amount Deducted": emp.amountDeducted,
      "Amount Paid": emp.amountPaid,
    }));

    // Custom headers
    const customHeader = [
      [`Weekly Report`], // Main title
      [`Month: ${month}`, `Week: ${weekNumber}`], // Month and week
      [
        `Week Start Date: ${reportDates.startDate.slice(0, 10)}`,
        `Week End Date: ${reportDates.endDate.slice(0, 10)}`,
      ], // Start and end dates
      [], // Empty row
    ];

    // Convert data to worksheet
    const worksheet = XLSX.utils.json_to_sheet(formattedData, { origin: "A5" }); // Data starts at A5

    // Add custom headers at the top
    XLSX.utils.sheet_add_aoa(worksheet, customHeader, { origin: "A1" });

    // Adjust column widths
    const columnWidths = [
      { wch: 20 }, // For "#"
      { wch: 20 }, // For "Employee Name"
      { wch: 15 }, // For "Daily Cash"
      { wch: 15 }, // For "Days Present"
      { wch: 15 }, // For "Total Amount"
      { wch: 15 }, // For "Amount Deducted"
      { wch: 15 }, // For "Amount Paid"
    ];
    worksheet["!cols"] = columnWidths;

    // Merge cells for main title (Weekly Report)
    worksheet["!merges"] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 7 } }, // Merge A1:H1 for "Weekly Report"
    ];

    // Create workbook and append worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Weekly Report");

    // Write to file
    XLSX.writeFile(workbook, `Weekly_Report_${month}_Week${weekNumber}.xlsx`);
  };

  // const [editingEmployee, setEditingEmployee] = useState(null);
  // const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // const handleEdit = (employee) => {
  //   setEditingEmployee({ ...employee });
  //   setIsEditModalOpen(true);
  // };

  const handleDelete = (weeklyPayIds) => {
    axios
      .delete(`/employees/delete-weeklyPay/${weeklyPayIds}`) // Ensure data is passed correctly
      .then((response) => {
        console.log("Employee deleted successfully:", response.data);
        toast.success("Record deleted successfully");
        fetchWeeklyReport();
      })
      .catch((error) => {
        console.error("Error deleting employee:", error);
        toast.error("Error deleting record");
      });
  };

  // const handleSaveEdit = () => {
  //   // Implement save logic here
  //   console.log("Saving edited employee:", editingEmployee);
  //   // After successful update, refetch the data
  //   fetchWeeklyReport();
  //   setIsEditModalOpen(false);
  // };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-8xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
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
                  {new Date(reportDates.startDate).toLocaleDateString("en-GB")}{" "}
                  - {new Date(reportDates.endDate).toLocaleDateString("en-GB")}
                </p>
              </div>
            )}

            {/* Loader */}
            {loading && (
              <div className="flex justify-center items-center py-6">
                <div className="w-16 h-16 border-t-4 border-indigo-600 border-solid rounded-full animate-spin"></div>
              </div>
            )}

            {/* Table */}
            {/* Table */}
            {!loading && (
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
                        Extra Work
                      </th>

                      <th className="border border-gray-300 px-4 py-2">
                        Half Days
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
                      <th className="border border-gray-300 px-4 py-2">
                        Actions
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
                            ₹{" "}
                            {new Intl.NumberFormat("en-IN", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }).format(emp.cash)}
                          </td>
                          <td className="border border-gray-300 px-4 py-2 text-center">
                            {emp.daysPresent}
                          </td>
                          <td className="border border-gray-300 px-4 py-2 text-center">
                            {emp.fullDaysWithExtraWork.length > 0
                              ? emp.fullDaysWithExtraWork.length
                              : "None"}
                          </td>

                          <td className="border border-gray-300 px-4 py-2 text-center">
                            {emp.halfDays || "None"}
                          </td>
                          <td className="border border-gray-300 px-4 py-2 text-center">
                            ₹{" "}
                            {new Intl.NumberFormat("en-IN", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }).format(emp.totalAmount)}
                          </td>
                          <td className="border border-gray-300 px-4 py-2 text-center">
                            ₹{" "}
                            {new Intl.NumberFormat("en-IN", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }).format(emp.amountDeducted)}
                          </td>
                          <td className="border border-gray-300 px-4 py-2 text-center">
                            ₹{" "}
                            {new Intl.NumberFormat("en-IN", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }).format(emp.amountPaid)}
                          </td>
                          <td className="border border-gray-300 px-4 py-2 text-center">
                            {/* <button
                              onClick={() => handleEdit(emp)}
                              className="bg-blue-500 text-white px-2 py-1 rounded mr-2 hover:bg-blue-600 transition duration-300"
                            >
                              Edit
                            </button> */}
                            <button
                              onClick={() => handleDelete(emp.weeklyPayIds)}
                              className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition duration-300"
                            >
                              <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAJRJREFUSEvtlcENgCAMRfs301GcRJ1MRnGTag8kSoBaAh6UHhvyX/uBFtQ40FifVAAzD0S0JQpZASy5IrMARVx0dyKaALgU5AZgZq5hGc62vM67gBrVhxrROyi16mpN1CKf/BbAtx12FcsXWdQB6jPtFv3AIssAtHw02WCyySzhAIxPp6mIzwZIcrOpO9nSQuxsc8ABQHeaGbkbfj0AAAAASUVORK5CYII=" />{" "}
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="10"
                          className="border border-gray-300 px-4 py-2 text-center text-gray-500"
                        >
                          No data available.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
            {/* {isEditModalOpen && editingEmployee && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
              <div className="bg-white p-6 rounded-lg w-96">
                <h2 className="text-xl font-bold mb-4">Edit Employee</h2>
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    handleSaveEdit()
                  }}
                >
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                      type="text"
                      value={editingEmployee.employeeName}
                      onChange={(e) => setEditingEmployee({ ...editingEmployee, employeeName: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Cash</label>
                    <input
                      type="number"
                      value={editingEmployee.cash}
                      onChange={(e) =>
                        setEditingEmployee({ ...editingEmployee, cash: Number.parseFloat(e.target.value) })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => setIsEditModalOpen(false)}
                      className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2 hover:bg-gray-400 transition duration-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
                    >
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )} */}

            {/* Download Button */}
            {!loading && (
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

export default WeeklyReportPage;
