const mongoose = require("mongoose");

const dailyAttendanceSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },
  date: {
    type: String,
    required: true,
    match: /^\d{4}-\d{2}-\d{2}$/, // Ensure the date format is YYYY-MM-DD
  },
  month: {
    type: String,
    required: true, // Store month in YYYY-MM format
  },
  status: {
    type: String,
    enum: ["Present", "Absent"],
    required: true,
  },
  attendanceType: {
    type: String,
    enum: ["Full Day", "Half Day", "Absent"], // Single field to store the type of attendance
    required: function () {
      return this.status === "Present"; // Only required if the status is "Present"
    },
    default: "Absent", // Default to "Absent" if status is not "Present"
  },
});

dailyAttendanceSchema.index({ employeeId: 1, date: 1 }, { unique: true }); // Prevent duplicate entries for the same day

module.exports = mongoose.model("DailyAttendance", dailyAttendanceSchema);
