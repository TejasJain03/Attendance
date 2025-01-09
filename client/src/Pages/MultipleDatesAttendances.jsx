/* eslint-disable no-unused-vars */
import { useState } from "react";
import Navbar from "../Components/Navbar";
import { useNavigationType, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "../axios";
import { useNavigate } from "react-router-dom";

const UpdateAttendance = () => {
  const { employeeId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [dates, setDates] = useState([]);
  const [status, setStatus] = useState("Present");
  const [attendanceType, setAttendanceType] = useState("Full Day");
  const [extraWorkHours, setExtraWorkHours] = useState("0");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (dates.length === 0) {
      toast.error("Please select at least one date.");
      return;
    }

    const payload = {
      dates,
      status,
      attendanceType,
      extraWorkHours: attendanceType === "Full Day" ? extraWorkHours : 0,
    };
    console.log(employeeId);

    setLoading(true); // Set loading to true when submitting

    try {
      await axios
        .put(`employees/${employeeId}/multiple-attendance`, payload)
        .then((response) => {
          console.log(response.data);
        });

      toast.success("Attendance updated successfully!", {
        onClose: () => console.log(navigate(`/employee/${employeeId}`)),
      });
    } catch (error) {
      toast.error("Failed to update attendance");
    } finally {
      setLoading(false); // Set loading to false once the update is done
    }
  };

  const generateDates = () => {
    const daysInMonth = new Date(year, month, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1;
      return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(
        2,
        "0"
      )}`;
    });
  };

  const handleDateChange = (date) => {
    setDates((prevDates) =>
      prevDates.includes(date)
        ? prevDates.filter((d) => d !== date)
        : [...prevDates, date]
    );
  };

  return (
    <>
      <Navbar />
      <ToastContainer autoClose={1000} />
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
            <div className="lg:flex">
              <div className="lg:w-1/3 bg-indigo-600 p-8 text-white">
                <h2 className="text-3xl font-extrabold mb-6">
                  Update Attendance
                </h2>
                <p className="text-indigo-200 mb-4">
                  Select dates and update attendance records.
                </p>
                <div className="mt-8">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-24 w-24 opacity-25"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              </div>
              <div className="lg:w-2/3 p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Month
                      </label>
                      <select
                        value={month}
                        onChange={(e) => setMonth(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        {Array.from({ length: 12 }, (_, i) => (
                          <option key={i + 1} value={i + 1}>
                            {new Date(0, i).toLocaleString("default", {
                              month: "long",
                            })}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Year
                      </label>
                      <select
                        value={year}
                        onChange={(e) => setYear(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        {Array.from({ length: 5 }, (_, i) => (
                          <option key={i} value={new Date().getFullYear() - i}>
                            {new Date().getFullYear() - i}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Dates
                    </label>
                    <div className="border border-gray-300 rounded-md shadow-sm overflow-hidden">
                      <div className="max-h-48 overflow-y-auto p-2 bg-gray-50 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2">
                        {generateDates().map((date) => (
                          <label
                            key={date}
                            className={`flex items-center space-x-2 p-2 rounded-md cursor-pointer transition-colors duration-200 ${
                              dates.includes(date)
                                ? "bg-indigo-100 border-indigo-300"
                                : "hover:bg-gray-100"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={dates.includes(date)}
                              onChange={() => handleDateChange(date)}
                              className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                            />
                            <span className="text-sm text-gray-700">
                              {new Date(date).getDate()}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="Present">Present</option>
                        <option value="Absent">Absent</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Attendance Type
                      </label>
                      <select
                        value={attendanceType}
                        onChange={(e) => setAttendanceType(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="Full Day">Full Day</option>
                        <option value="Half Day">Half Day</option>
                      </select>
                    </div>
                  </div>
                  {attendanceType === "Full Day" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Extra Work Hours
                      </label>
                      <select
                        value={extraWorkHours}
                        onChange={(e) => setExtraWorkHours(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="0">0</option>
                        <option value="0.5">0.5</option>
                        <option value="1">1</option>
                      </select>
                    </div>
                  )}
                  <div>
                    <button
                      type="submit"
                      disabled={loading} // Disable button while loading
                      className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300 ease-in-out transform hover:-translate-y-1"
                    >
                      {loading ? (
                        <div className="flex justify-center items-center space-x-2">
                          <svg
                            className="animate-spin h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 4V1m0 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18z"
                            />
                          </svg>
                          <span>Updating...</span>
                        </div>
                      ) : (
                        "Update Attendance"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UpdateAttendance;
