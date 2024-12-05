import { useState, useEffect } from "react";
import axios from "../axios";

const AttendancePage = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [attendanceDetails, setAttendanceDetails] = useState({
    status: "Present",
    attendanceType: "Full Day",
    extraWorkHours: 0, // Added extraWorkHours property
  });
  const [attendanceDate, setAttendanceDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [showPopup, setShowPopup] = useState(false);

  // Fetch employees from API
  useEffect(() => {
    axios
      .get("/employees")
      .then((response) => {
        setEmployees(response.data.employees);
      })
      .catch((error) => {
        console.error("Error fetching employees:", error);
      });
  }, []);

  // Handle employee card selection
  const handleEmployeeSelect = (employeeId) => {
    setSelectedEmployees((prev) =>
      prev.includes(employeeId)
        ? prev.filter((id) => id !== employeeId)
        : [...prev, employeeId]
    );
  };

  // Handle attendance details change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAttendanceDetails((prev) => ({ ...prev, [name]: value }));
  };

  // Handle date change
  const handleDateChange = (e) => {
    setAttendanceDate(e.target.value);
  };

  // Submit attendance data
  const handleSubmitAttendance = () => {
    const attendanceData = {
      employeeIds: selectedEmployees,
      date: attendanceDate,
      ...attendanceDetails,
    };
    axios
      .put(`/employees/multiple-attendance/${attendanceDate}`, attendanceData)
      .then((response) => {
        console.log("Attendance submitted successfully:", response.data);
        setSelectedEmployees([]);
        setAttendanceDetails({
          status: "Present",
          attendanceType: "Full Day",
          extraWorkHours: 0, // Reset extraWorkHours
        });
        setAttendanceDate(new Date().toISOString().split("T")[0]);
        setShowPopup(false);
      })
      .catch((error) => {
        console.error("Error submitting attendance:", error);
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600 p-6">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-white text-center mb-8">
          Employee Attendance
        </h2>

        {/* Separate Date Picker */}
        <div className="mb-6 flex justify-center">
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Date
            </label>
            <input
              type="date"
              value={attendanceDate}
              onChange={handleDateChange}
              className="w-48 border border-gray-300 rounded-md shadow-sm px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            />
          </div>
        </div>

        {/* Employee Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {employees.map((employee) => (
            <div
              key={employee._id}
              className={`p-6 rounded-lg shadow-lg bg-white cursor-pointer border ${
                selectedEmployees.includes(employee._id)
                  ? "border-indigo-500"
                  : "border-gray-300"
              }`}
            >
              <div className="flex items-center space-x-4">
                <input
                  type="checkbox"
                  checked={selectedEmployees.includes(employee._id)}
                  onChange={() => handleEmployeeSelect(employee._id)}
                  className="w-5 h-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <div>
                  <h3 className="text-lg font-bold text-gray-800">
                    {employee.name}
                  </h3>
                  <p className="text-sm text-gray-600">{employee.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => setShowPopup(true)}
            className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-md shadow-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-500 focus:outline-none transition"
            disabled={selectedEmployees.length === 0}
          >
            Submit Attendance
          </button>
        </div>

        {/* Popup for Attendance Details */}
        {showPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-6">
            <div className="bg-white rounded-lg p-8 max-w-sm w-full">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                Attendance Details
              </h3>

              {/* Status Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600">
                  Status
                </label>
                <select
                  name="status"
                  value={attendanceDetails.status}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md shadow-sm px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                >
                  <option value="Present">Present</option>
                  <option value="Absent">Absent</option>
                </select>
              </div>

              {/* Attendance Type Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600">
                  Attendance Type
                </label>
                <select
                  name="attendanceType"
                  value={attendanceDetails.attendanceType}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md shadow-sm px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                >
                  <option value="Full Day">Full Day</option>
                  <option value="Half Day">Half Day</option>
                </select>
              </div>

              {/* Extra Hours Input */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600">
                  Extra Hours (Max 4)
                </label>
                <input
                  type="number"
                  name="extraWorkHours"
                  value={attendanceDetails.extraWorkHours}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md shadow-sm px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  min="0"
                  max="4"
                />
              </div>

              {/* Submit Button in Popup */}
              <div className="mt-6">
                <button
                  onClick={handleSubmitAttendance}
                  className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-md shadow-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-500 focus:outline-none transition transform hover:scale-105"
                >
                  Submit Attendance
                </button>
              </div>

              {/* Close Popup Button */}
              <div className="mt-4 text-center">
                <button
                  onClick={() => setShowPopup(false)}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendancePage;
