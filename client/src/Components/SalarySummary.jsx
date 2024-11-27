/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../axios";

const MainComponent = ({ date }) => {
  const { employeeId } = useParams();

  // State to store fetched salary and attendance data
  const [salaryData, setSalaryData] = useState({
    totalSalary: 0,
    cashSalary: 0,
    accountSalary: 0,
    daysPresent: 0,
  });

  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false); // State to handle loading

  // Function to fetch salary and attendance data
  const fetchData = async () => {
    if (!date) return; // Ensure `date` is defined before making requests

    setLoading(true); // Start loading

    const formattedDate = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}`;

    try {
      // Fetch salary data
      const salaryResponse = await axios.get(
        `/employees/${employeeId}/salary/${formattedDate}`
      );
      setSalaryData(salaryResponse.data);

      // Fetch attendance data
      const attendanceResponse = await axios.get(
        `/employees/${employeeId}/attendance/${formattedDate}`
      );
      setAttendanceData(attendanceResponse); // Use attendance array from response
      setLoading(false); // Stop loading
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false); // Stop loading even if there was an error
    }
  };

  // Fetch data when component mounts or when date or employeeId changes
  useEffect(() => {
    fetchData();
  }, [date, employeeId]); // Dependencies on date and employeeId

  // Function to trigger re-fetching of the data when the button is clicked
  const refreshData = () => {
    fetchData();
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Attendance Management</h1>

      {/* Button to trigger salary summary calculation */}
      <button
        onClick={refreshData}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
        disabled={loading} // Disable the button while loading
      >
        {loading ? "Refreshing..." : "Refresh Salary Summary"}
      </button>

      {/* Display salary summary */}
      <div className="border p-4 rounded shadow-lg bg-white">
        <h2 className="text-lg font-semibold mb-2">Salary Summary</h2>
        <div className="flex flex-col">
          <span>
            Total Salary: <strong>{salaryData.totalSalary}</strong>
          </span>
          <span>
            Cash Amount: <strong>{salaryData.cashSalary}</strong>
          </span>
          <span>
            Account Amount: <strong>{salaryData.accountSalary}</strong>
          </span>
          <span>
            Days Present: <strong>{salaryData.daysPresent}</strong>
          </span>
        </div>
      </div>

      {/* Other components and logic for attendance, etc. */}
    </div>
  );
};

export default MainComponent;
