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
});

dailyAttendanceSchema.index({ employeeId: 1, date: 1 }, { unique: true }); // Prevent duplicate entries for the same day

module.exports = mongoose.model("DailyAttendance", dailyAttendanceSchema);
