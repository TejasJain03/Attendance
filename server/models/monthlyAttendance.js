const mongoose = require("mongoose");

const monthlyAttendanceSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },
  month: {
    type: String,
    required: true, // Format: YYYY-MM
  },
  totalDays: {
    type: Number,
    required: true,
  },
  daysPresent: {
    type: Number,
    required: true,
  },
  daysAbsent: {
    type: Number,
    required: true,
  },
  
});

monthlyAttendanceSchema.index({ employeeId: 1, month: 1 }, { unique: true });

module.exports = mongoose.model("MonthlyAttendance", monthlyAttendanceSchema);
