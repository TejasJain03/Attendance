import { useState, useEffect } from "react";
import axios from "../axios";
import Navbar from "../Components/Navbar";

const AttendancePage = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [attendanceDetails, setAttendanceDetails] = useState({
    status: "Present",
    attendanceType: "Full Day",
    extraWorkHours: 0,
  });
  const [attendanceDate, setAttendanceDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/employees")
      .then((response) => {
        setEmployees(response.data.employees);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching employees:", error);
        setLoading(false);
      });
  }, []);

  const handleEmployeeSelect = (employeeId) => {
    setSelectedEmployees((prev) =>
      prev.includes(employeeId)
        ? prev.filter((id) => id !== employeeId)
        : [...prev, employeeId]
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAttendanceDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (e) => {
    setAttendanceDate(e.target.value);
  };

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
          extraWorkHours: 0,
        });
        setAttendanceDate(new Date().toISOString().split("T")[0]);
        setShowPopup(false);
      })
      .catch((error) => {
        console.error("Error submitting attendance:", error);
      });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center">
          Employee Attendance
        </h2>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date
              </label>
              <input
                type="date"
                value={attendanceDate}
                onChange={handleDateChange}
                className="w-48 border border-gray-300 rounded-md shadow-sm px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              />
            </div>
            <button
              onClick={() => setShowPopup(true)}
              className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-md shadow-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-500 focus:outline-none transition transform hover:scale-105"
              disabled={selectedEmployees.length === 0}
            >
              Submit Attendance
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {employees.map((employee) => (
                <div
                  key={employee._id}
                  className={`p-4 rounded-lg shadow-md bg-white cursor-pointer border-2 transition-all duration-300 ${
                    selectedEmployees.includes(employee._id)
                      ? "border-indigo-500 bg-indigo-50"
                      : "border-gray-200 hover:border-indigo-300"
                  }`}
                  onClick={() => handleEmployeeSelect(employee._id)}
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                        <span className="text-xl font-semibold text-indigo-600">
                          {employee.name.charAt(0)}
                        </span>
                      </div>
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {employee.name}
                      </h3>
                      <p className="text-sm text-gray-600">{employee.role}</p>
                    </div>
                    <div className="flex-shrink-0">
                      <input
                        type="checkbox"
                        checked={selectedEmployees.includes(employee._id)}
                        onChange={() => {}}
                        className="w-5 h-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {showPopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-96 text-center">
              <h2 className="text-2xl font-bold mb-4 text-indigo-800">
                Attendance Details
              </h2>

              <p className="text-gray-600 mb-6">
                Update Attendance Information:
              </p>

              <div className="mb-6">
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-indigo-700 mb-2"
                >
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={attendanceDetails.status}
                  onChange={handleChange}
                  className="w-full p-2 border border-indigo-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Present">Present</option>
                  <option value="Absent">Absent</option>
                </select>
              </div>

              <div className="mb-6">
                <label
                  htmlFor="attendanceType"
                  className="block text-sm font-medium text-indigo-700 mb-2"
                >
                  Attendance Type
                </label>
                <select
                  id="attendanceType"
                  name="attendanceType"
                  value={attendanceDetails.attendanceType}
                  onChange={handleChange}
                  className="w-full p-2 border border-indigo-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Full Day">Full Day</option>
                  <option value="Half Day">Half Day</option>
                </select>
              </div>

              {/* Extra Hours Dropdown */}
              {attendanceDetails.attendanceType === "Full Day" && (
                <div className="mb-6">
                  <label
                    htmlFor="extraHours"
                    className="block text-sm font-medium text-indigo-700 mb-2"
                  >
                    Extra Hours (if any)
                  </label>
                  <select
                    id="extraHours"
                    className="w-full p-2 border border-indigo-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    name="extraWorkHours"
                    value={attendanceDetails.extraWorkHours}
                    onChange={handleChange}
                  >
                    <option value="0">0</option>
                    <option value="0.5">0.5</option>
                    <option value="1">1</option>
                  </select>
                </div>
              )}

              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setShowPopup(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-gray-600 transition duration-300 ease-in-out focus:outline-none"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitAttendance}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-indigo-700 transition duration-300 ease-in-out focus:outline-none"
                >
                  Submit
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
