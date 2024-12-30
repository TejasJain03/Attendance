import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import axios from "../axios";
import EmployeeDetails from "../Components/Employee";
import Navbar from "../Components/Navbar"; // Import Navbar

const BasicCalendarExample = () => {
  const [date, setDate] = useState(new Date());
  const { employeeId } = useParams();
  const [attendanceData, setAttendanceData] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [attendanceType, setAttendanceType] = useState("");
  const [extraWorkHours, setExtraWorkHours] = useState(0); // Track extra hours input
  const navigate = useNavigate(); // For navigation

  const years = Array.from({ length: 50 }, (_, i) => 2021 + i);
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

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        const formattedDate = `${date.getFullYear()}-${String(
          date.getMonth() + 1
        ).padStart(2, "0")}`;
        const response = await axios.get(
          `/employees/${employeeId}/attendance/${formattedDate}`
        );
        console.log(response.data);
        setAttendanceData(response.data.data);
      } catch (error) {
        console.error("Error fetching attendance data:", error);
      }
    };
    fetchAttendanceData();
  }, [date, employeeId]);

  const handleDropdownChange = (e) => {
    const { name, value } = e.target;
    const newDate = new Date(date);

    if (name === "year") {
      newDate.setFullYear(value);
    } else if (name === "month") {
      newDate.setMonth(months.indexOf(value));
    }

    setDate(newDate);
  };

  const handleDayClick = (value) => {
    const dateObject = new Date(value);
    dateObject.setDate(dateObject.getDate() + 1);
    const formattedDate = dateObject.toISOString().split("T")[0];
    setSelectedDate(new Date(formattedDate));
    setIsPopupOpen(true);
  };

  const handleAttendanceUpdate = async (status, attendanceType) => {
    const formattedDate = selectedDate.toISOString().split("T")[0];
    try {
      if (status === "Remove") {
        await axios.delete(
          `/employees/${employeeId}/attendance/${formattedDate}`
        );
      } else {
        const payload = { status, attendanceType, extraWorkHours }; // Add extraHours to payload
        await axios.put(
          `/employees/${employeeId}/attendance/${formattedDate}`,
          payload
        );
        console.log(payload);
      }

      const response = await axios.get(
        `/employees/${employeeId}/attendance/${formattedDate
          .split("-")
          .slice(0, 2)
          .join("-")}`
      );
      setAttendanceData(response.data.data);
    } catch (error) {
      console.error("Error updating/removing attendance:", error);
    }
    setIsPopupOpen(false);
  };

  const getTileContent = ({ date }) => {
    const previousDate = new Date(date);
    previousDate.setDate(previousDate.getDate() + 1);
    const formattedDate = previousDate.toISOString().split("T")[0];
    const attendanceRecord = attendanceData.find(
      (att) => att.date === formattedDate
    );

    return (
      <div className="flex justify-center items-center">
        {attendanceRecord ? (
          <div
            className={`w-3 h-3 rounded-full ${
              attendanceRecord.status === "Present"
                ? "bg-green-500"
                : "bg-red-500"
            }`}
          ></div>
        ) : (
          <div className="w-3 h-3 rounded-full bg-gray-300"></div>
        )}
      </div>
    );
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex items-center justify-center p-6">
        <div className="w-full max-w-7xl bg-white shadow-2xl rounded-3xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Employee Details */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-6 shadow-lg border border-indigo-200">
              <EmployeeDetails />
              <h2 className="text-2xl font-bold text-indigo-800 mt-6">
                Attendance
              </h2>
              <div className="flex space-x-4 mt-4">
                <div className="flex flex-col w-1/2">
                  <label className="font-medium text-sm mb-1 text-indigo-700">
                    Year
                  </label>
                  <select
                    name="year"
                    onChange={handleDropdownChange}
                    value={date.getFullYear()}
                    className="p-2 border border-indigo-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-indigo-800"
                  >
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col w-1/2">
                  <label className="font-medium text-sm mb-1 text-indigo-700">
                    Month
                  </label>
                  <select
                    name="month"
                    onChange={handleDropdownChange}
                    value={months[date.getMonth()]}
                    className="p-2 border border-indigo-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-indigo-800"
                  >
                    {months.map((month) => (
                      <option key={month} value={month}>
                        {month}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {/* Redirect Buttons */}
              <div className="mt-8 space-y-4">
                <button
                  onClick={() =>
                    navigate(`/employee/loan-details/${employeeId}`)
                  }
                  className="bg-yellow-500 text-white px-4 py-2 rounded-full shadow-md hover:bg-yellow-600 transition duration-300 ease-in-out focus:outline-none"
                >
                  View Loan Details
                </button>
              </div>
            </div>

            {/* Calendar */}
            <div className="flex flex-col items-center bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <h2 className="text-2xl font-bold text-indigo-800 mb-4">
                Attendance Calendar
              </h2>
              <Calendar
                onChange={(newDate) => setDate(newDate)}
                value={date}
                tileContent={getTileContent}
                onClickDay={handleDayClick}
                className="w-full border-none shadow-none"
                showNavigation={false}
              />
            </div>
          </div>
        </div>

        {/* Popup */}
        {isPopupOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
            {/* Popup Content */}
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-96 text-center">
              <h2 className="text-2xl font-bold mb-4 text-indigo-800">
                {selectedDate && selectedDate.toDateString()}
              </h2>
              <p className="text-gray-600 mb-6">Update Attendance Status:</p>

              {/* Attendance Type Dropdown */}
              <div className="mb-6">
                <label
                  htmlFor="attendanceType"
                  className="block text-sm font-medium text-indigo-700 mb-2"
                >
                  Attendance Type
                </label>
                <select
                  id="attendanceType"
                  className="w-full p-2 border border-indigo-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={attendanceType}
                  onChange={(e) => setAttendanceType(e.target.value)}
                >
                  <option value="select">Select</option>
                  <option value="Full Day">Full Day</option>
                  <option value="Half Day">Half Day</option>
                </select>
              </div>

              {/* Extra Hours Field */}
              {attendanceType === "Full Day" && (
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
                    value={extraWorkHours}
                    onChange={(e) => setExtraWorkHours(e.target.value)} // Update state on change
                  >
                    <option value="0">0</option>
                    <option value="0.5">0.5</option>
                    <option value="1">1</option>
                  </select>
                </div>
              )}

              <div className="flex justify-center space-x-4">
                <button
                  onClick={() =>
                    handleAttendanceUpdate("Present", attendanceType)
                  }
                  className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-600 transition duration-300 ease-in-out focus:outline-none"
                >
                  Present
                </button>
                <button
                  onClick={() => handleAttendanceUpdate("Absent")}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600 transition duration-300 ease-in-out focus:outline-none"
                >
                  Absent
                </button>
                <button
                  onClick={() => handleAttendanceUpdate("Remove")}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-gray-600 transition duration-300 ease-in-out focus:outline-none"
                >
                  Remove
                </button>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setIsPopupOpen(false)}
                className="mt-4 bg-red-500 text-white px-4 py-2 rounded-full shadow-md hover:bg-red-600 transition duration-300 ease-in-out focus:outline-none"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default BasicCalendarExample;
