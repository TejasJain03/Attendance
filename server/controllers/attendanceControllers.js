// controllers/attendanceController.js
const DailyAttendance = require("../models/dailyAttendence");
const MonthlyAttendance = require("../models/monthlyAttendance");
const Employee = require("../models/employee");

// Get monthly attendance for an employee
exports.getMonthlyAttendance = async (req, res) => {
  const { employeeId, month } = req.params;
  try {
    // Fetch all daily attendance records for the employee in the given month
    const dailyAttendanceRecords = await DailyAttendance.find({
      employeeId,
      month: { $eq: month }, // Filter by the specific month
    });

    // If no attendance records are found, return a summary with default values
    const totalDays = dailyAttendanceRecords.length;
    const daysPresent = dailyAttendanceRecords.filter(
      (record) => record.status === "Present"
    ).length;
    const daysAbsent = totalDays - daysPresent;

    // Create the monthly attendance summary
    const monthlyAttendanceSummary = {
      employeeId,
      dailyAttendanceRecords,
      month,
      totalDays,
      daysPresent,
      daysAbsent,
      statusSummary: daysPresent > daysAbsent ? "Good" : "Needs Improvement",
    };

    res.status(200).json(monthlyAttendanceSummary);
  } catch (error) {
    console.error("Error fetching monthly attendance:", error);
    res.status(500).json({ message: "Error fetching monthly attendance" });
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
  const { status } = req.body; // Make sure status is part of the body
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

  try {
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

    // Fetch all daily attendance records for the employee in the given month
    const dailyAttendanceRecords = await DailyAttendance.find({
      employeeId,
      month,
    });

    if (dailyAttendanceRecords.length > 0) {
      // Calculate the number of present and absent days
      const totalDays = dailyAttendanceRecords.length;
      const daysPresent = dailyAttendanceRecords.filter(
        (record) => record.status === "Present"
      ).length;
      const daysAbsent = totalDays - daysPresent;

      // Create the updated monthly attendance summary
      const monthlyAttendanceSummary = {
        employeeId,
        month,
        totalDays,
        daysPresent,
        daysAbsent,
        statusSummary: daysPresent > daysAbsent ? "Good" : "Needs Improvement",
      };

      // Check if a monthly record already exists, and update or insert accordingly
      let monthlyRecord = await MonthlyAttendance.findOne({
        employeeId,
        month,
      });

      if (monthlyRecord) {
        // Update existing record
        monthlyRecord.totalDays = totalDays;
        monthlyRecord.daysPresent = daysPresent;
        monthlyRecord.daysAbsent = daysAbsent;
        monthlyRecord.statusSummary = monthlyAttendanceSummary.statusSummary;
        await monthlyRecord.save();
      } else {
        // Create a new monthly record if it doesn't exist
        monthlyRecord = new MonthlyAttendance(monthlyAttendanceSummary);
        await monthlyRecord.save();
      }
    } else {
      // If no daily attendance records left for this month, delete the monthly record
      await MonthlyAttendance.findOneAndDelete({
        employeeId,
        month,
      });
    }

    res.status(200).json({
      message: "Attendance removed successfully",
      dailyAttendance: dailyRecord,
    });
  } catch (error) {
    console.error("Error removing attendance:", error);
    res.status(500).json({ message: "Error removing attendance" });
  }
};
