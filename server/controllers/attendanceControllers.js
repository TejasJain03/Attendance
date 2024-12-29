// controllers/attendanceController.js
const DailyAttendance = require("../models/dailyAttendence");
const Employee = require("../models/employee");
const moment = require("moment"); // Assuming you use moment.js for date manipulation
const WeeklyPay = require("../models/weeklyPay");

// Get monthly attendance for an employee
exports.getWeeklyAttendanceForEmployee = async (req, res) => {
  let { employeeId, month, weekNumber } = req.params;

  try {
    // Parse month and calculate start and end dates for the requested week
    const parsedMonth = moment(month, "YYYY-MM"); // e.g., "2024-12"
    const startOfMonth = parsedMonth.startOf("month");

    const startOfWeek = startOfMonth.clone().add((weekNumber - 1) * 7, "days");
    const endOfWeek = startOfWeek.clone().add(6, "days");

    // Fetch attendance records only for the specific employee and month
    const dailyAttendanceRecords = await DailyAttendance.find({
      employeeId: employeeId, // Filter by the specific employee ID
      month: { $eq: month }, // Filter by the specified month
    });

    // Filter records to include only those within the requested week
    const weekRecords = dailyAttendanceRecords.filter((record) => {
      const momentDate = moment(record.date);
      const calculatedWeekNumber =
        Math.floor(momentDate.diff(startOfMonth, "days") / 7) + 1;
      return calculatedWeekNumber === parseInt(weekNumber);
    });

    // Calculate attendance summary
    const totalDays = weekRecords.length;

    const daysPresent = weekRecords.filter(
      (record) => record.status === "Present"
    ).length;

    const daysAbsent = weekRecords.filter(
      (record) => record.status === "Absent"
    ).length;

    const fullDaysWithoutExtraWork = weekRecords.filter(
      (record) =>
        record.attendanceType === "Full Day" &&
        record.status === "Present" &&
        (!record.extraWorkHours || record.extraWorkHours <= 0)
    ).length;

    const fullDaysWithExtraWork = weekRecords
      .filter(
        (record) =>
          record.attendanceType === "Full Day" &&
          record.status === "Present" &&
          record.extraWorkHours &&
          record.extraWorkHours > 0
      )
      .map((record) => ({
        date: record.date,
        extraWorkHours: record.extraWorkHours,
      }));

    const halfDays = weekRecords.filter(
      (record) => record.attendanceType === "Half Day"
    ).length;

    // Build the summary object
    const attendanceSummary = {
      employeeId,
      totalDays,
      daysPresent,
      daysAbsent,
      fullDaysWithoutExtraWork,
      fullDaysWithExtraWork,
      halfDays,
    };

    // Response object
    res.status(200).json({
      month,
      week: weekNumber,
      attendanceSummary,
    });
  } catch (error) {
    console.error("Error fetching weekly attendance for the employee:", error);
    res.status(500).json({ message: "Error fetching weekly attendance" });
  }
};

exports.getWeeklyAttendanceForAllEmployees = async (req, res) => {
  let { month, weekNumber } = req.params;

  try {
    const parsedMonth = moment(month, "YYYY-MM"); // e.g., "2024-12"
    const startOfMonth = parsedMonth.startOf("month");

    // Calculate start and end dates for the week
    const startOfWeek = startOfMonth.clone().add((weekNumber - 1) * 7, "days");
    const endOfWeek = startOfWeek.clone().add(6, "days");

    // Fetch all daily attendance records for the given month
    const dailyAttendanceRecords = await DailyAttendance.find({
      month: { $eq: month },
    });

    // Fetch weekly pay records for the specified month and week
    const weekPaidRecords = await WeeklyPay.find({month,weekNumber});
    // Group records by employeeId and week number
    const groupedByEmployee = dailyAttendanceRecords.reduce((acc, record) => {
      const { employeeId, date, status, attendanceType, extraWorkHours } =
        record;
      const momentDate = moment(date);
      const calculatedWeekNumber =
        Math.floor(momentDate.diff(startOfMonth, "days") / 7) + 1;

      if (calculatedWeekNumber !== parseInt(weekNumber)) return acc;

      if (!acc[employeeId]) acc[employeeId] = [];
      acc[employeeId].push({ status, attendanceType, extraWorkHours, date });
      return acc;
    }, {});

    // Fetch all employees
    const employees = await Employee.find();

    // Build the attendance summary
    const attendanceSummary = employees.map((employee) => {
      const weekRecords = groupedByEmployee[employee._id] || [];
      const totalDays = weekRecords.length;

      // Check if employee has been paid for the week
      const isPaid = weekPaidRecords.some((record) => {
        return record.employeeId.toString() === employee._id.toString();
      });

      // Count attendance types
      const daysPresent = weekRecords.filter(
        (record) => record.status === "Present"
      ).length;
      const daysAbsent = weekRecords.filter(
        (record) => record.status === "Absent"
      ).length;

      // Separate Full and Half Days
      const fullDaysWithoutExtraWork = weekRecords.filter(
        (record) =>
          record.attendanceType === "Full Day" &&
          record.status === "Present" &&
          (!record.extraWorkHours || record.extraWorkHours <= 0)
      ).length;

      const fullDaysWithExtraWork = weekRecords
        .filter(
          (record) =>
            record.attendanceType === "Full Day" &&
            record.status === "Present" &&
            record.extraWorkHours &&
            record.extraWorkHours > 0
        )
        .map((record) => ({
          date: record.date,
          extraWorkHours: record.extraWorkHours,
        }));

      const halfDays = weekRecords.filter(
        (record) => record.attendanceType === "Half Day"
      ).length;

      return {
        employeeId: employee._id,
        employee,
        week: weekNumber,
        totalDays,
        fullDaysWithoutExtraWork,
        fullDaysWithExtraWork,
        halfDays,
        daysPresent,
        daysAbsent,
        paid: isPaid,
      };
    });

    res.status(200).json({
      month,
      week: weekNumber,
      weekStartDate: startOfWeek.format("YYYY-MM-DD"),
      weekEndDate: endOfWeek.format("YYYY-MM-DD"),
      attendanceSummary,
    });
  } catch (error) {
    console.error("Error fetching weekly attendance for all employees:", error);
    res.status(500).json({ message: "Error fetching weekly attendance" });
  }
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

exports.updateDailyAttendanceForMultipleEmployees = async (req, res) => {
  const { date } = req.params; // Date is passed as a parameter
  const { employeeIds, status, attendanceType, extraWorkHours } = req.body; // Array of employee IDs, status, and attendanceType
  // Validate inputs
  if (!date || !moment(date, "YYYY-MM-DD", true).isValid()) {
    return res
      .status(400)
      .json({ message: "Invalid or missing date parameter" });
  }
  if (!employeeIds || !Array.isArray(employeeIds) || employeeIds.length === 0) {
    return res
      .status(400)
      .json({ message: "Employee IDs must be an array and cannot be empty" });
  }
  const month = date.slice(0, 7); // Extract the month in "YYYY-MM" format
  try {
    // Build bulk operations for MongoDB
    const bulkOperations = employeeIds.map((employeeId) => ({
      updateOne: {
        filter: { employeeId, date }, // Ensure `date` and `employeeId` match correctly
        update: {
          $set: { status, attendanceType, month, extraWorkHours },
        },
        upsert: true, // Insert a new record if no match is found
      },
    }));
    // Execute bulkWrite operation
    const result = await DailyAttendance.bulkWrite(bulkOperations);

    // Respond with success message and operation result
    return res.status(200).json({
      message: "Attendance updated successfully for multiple employees",
      result,
    });
  } catch (error) {
    console.error("Error updating attendance for multiple employees:", error);
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

exports.getAttendanceForMonth = async (req, res) => {
  const { employeeId, month } = req.params;

  // Query database for attendance records within the specified month
  const attendanceRecords = await DailyAttendance.find({
    employeeId,
    month,
  });

  // Return the results
  return res.status(200).json({
    success: true,
    data: attendanceRecords,
  });
};
