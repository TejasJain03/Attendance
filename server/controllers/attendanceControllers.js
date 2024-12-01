// controllers/attendanceController.js
const DailyAttendance = require("../models/dailyAttendence");
const Employee = require("../models/employee");
const moment = require("moment"); // Assuming you use moment.js for date manipulation

// Get monthly attendance for an employee
exports.getMonthlyAttendance = async (req, res) => {
  const { employeeId, month } = req.params;
  try {
    // Fetch all daily attendance records for the employee in the given month
    const dailyAttendanceRecords = await DailyAttendance.find({
      employeeId,
      month: { $eq: month }, // Filter by the specific month
    });

    if (dailyAttendanceRecords.length === 0) {
      return res
        .status(404)
        .json({ message: "No attendance records found for this month" });
    }

    // Group records by week number
    const weeks = dailyAttendanceRecords.reduce((acc, record) => {
      const date = moment(record.date);
      const startOfMonth = moment(date).startOf("month"); // Start of the current month
      const weekNumber = Math.floor(date.diff(startOfMonth, "days") / 7) + 1; // Calculate the week of the month

      if (!acc[weekNumber]) acc[weekNumber] = [];
      acc[weekNumber].push(record);
      return acc;
    }, {});

    // Prepare the weekly attendance summary
    const weeklyAttendanceSummary = Object.keys(weeks).map((weekNumber) => {
      const weekRecords = weeks[weekNumber];
      const totalDays = weekRecords.length;

      // Count attendance types
      const daysPresent = weekRecords.filter(
        (record) => record.status === "Present"
      ).length;
      const daysAbsent = weekRecords.filter(
        (record) => record.status === "Absent"
      ).length;

      // Count Half and Full Days
      const fullDays = weekRecords.filter(
        (record) => record.attendanceType === "Full Day"
      ).length;

      const halfDays = weekRecords.filter(
        (record) => record.attendanceType === "Half Day"
      ).length;

      return {
        week: weekNumber,
        totalDays,
        fullDays,
        halfDays,
        daysAbsent,

      };
    });

    res.status(200).json({
      employeeId,
      month,
      dailyAttendanceRecords,
      weeklyAttendanceSummary,
    });
  } catch (error) {
    console.error("Error fetching weekly attendance:", error);
    res.status(500).json({ message: "Error fetching weekly attendance" });
  }
};


// Calculate salary for an employee for the month
exports.calculateSalary = async (req, res) => {
  const { employeeId, month } = req.params;

  // Fetch the daily attendance records for the given employee and month
  const dailyAttendance = await DailyAttendance.find({
    employeeId,
    month: month,
  });
  const employee = await Employee.findById(employeeId);

  if (!dailyAttendance || !employee) {
    return res
      .status(404)
      .json({ message: "Employee or daily attendance record not found" });
  }

  // Calculate the number of present days
  const daysPresent = dailyAttendance.filter(
    (day) => day.status === "Present"
  ).length;

  const MIN_DAYS_PRESENT = 22;
  const cashPerDay = employee.paymentDivision.cash; // Cash amount per day
  const accPerDay = employee.paymentDivision.account; // Account amount per day

  let totalSalary = 0;
  let cashSalary = 0;
  let accountSalary = 0;

  if (daysPresent < MIN_DAYS_PRESENT) {
    // If less than 22 days present
    totalSalary = cashPerDay * daysPresent + accPerDay * MIN_DAYS_PRESENT;
    cashSalary = cashPerDay * daysPresent;
    accountSalary = accPerDay * MIN_DAYS_PRESENT;
  } else if (daysPresent === MIN_DAYS_PRESENT) {
    // If exactly 22 days present
    totalSalary = cashPerDay * MIN_DAYS_PRESENT + accPerDay * MIN_DAYS_PRESENT;
    cashSalary = cashPerDay * MIN_DAYS_PRESENT;
    accountSalary = accPerDay * MIN_DAYS_PRESENT;
  } else {
    // If more than 22 days present
    const extraDays = daysPresent - MIN_DAYS_PRESENT;
    totalSalary =
      cashPerDay * MIN_DAYS_PRESENT +
      accPerDay * MIN_DAYS_PRESENT +
      (cashPerDay + accPerDay) * extraDays;
    cashSalary = cashPerDay * MIN_DAYS_PRESENT + cashPerDay * extraDays;
    accountSalary = accPerDay * MIN_DAYS_PRESENT + accPerDay * extraDays;
  }

  // Return the calculated salary
  res.status(200).json({
    totalSalary,
    cashSalary,
    accountSalary,
    daysPresent,
  });
};

// Update or mark attendance for an employee on a specific date
exports.updateDailyAttendance = async (req, res) => {
  const { employeeId, date } = req.params;
  const { status, attendanceType } = req.body; // Make sure status is part of the body
  const month = date.slice(0, 7);
  if (!date) {
    return res.status(400).json({ message: "Date is required" });
  }

  try {
    // Check if the attendance date is provided and valid
    const existingAttendance = await DailyAttendance.findOne({
      employeeId,
      date,
    });

    if (existingAttendance) {
      // Update the existing attendance
      existingAttendance.status = status;
      await existingAttendance.save();
      return res.status(200).json(existingAttendance);
    }

    // Insert new attendance record
    const newAttendance = new DailyAttendance({
      employeeId,
      date,
      status,
      month,
      attendanceType,
    });

    await newAttendance.save();
    return res.status(201).json(newAttendance);
  } catch (error) {
    console.error("Error updating attendance:", error);
    return res.status(500).json({ message: "Error updating attendance" });
  }
};

// Remove attendance status for a specific date
exports.removeAttendance = async (req, res) => {
  const { employeeId, date } = req.params;

  // Find the daily attendance record
  const dailyRecord = await DailyAttendance.findOneAndDelete({
    employeeId,
    date,
  });

  if (!dailyRecord) {
    return res.status(404).json({ message: "Attendance record not found" });
  }

  // After removing, we need to update the monthly attendance summary
  const month = date.slice(0, 7); // Extract month in YYYY-MM format

  res.status(200).json({
    message: "Attendance removed successfully",
    dailyAttendance: dailyRecord,
  });
};
