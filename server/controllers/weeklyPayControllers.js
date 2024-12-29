const WeeklyPay = require("../models/weeklyPay");
const Employee = require("../models/employee");
const mongoose = require("mongoose");

exports.createWeeklyPay = async (req, res) => {
  const {
    month,
    weekNumber,
    daysPresent,
    daysAbsent,
    startDate,
    endDate,
    totalAmount,
    cash,
    amountDeducted,
    amountPaid,
    fullDaysWithExtraWork,
    fullDaysWithoutExtraWork,
    halfDays,
  } = req.body;
  const { employeeId } = req.params;

  // Check if a record already exists for the given employee, month, and weekNumber
  const existingRecord = await WeeklyPay.findOne({
    employeeId,
    month,
    weekNumber,
  });

  if (existingRecord) {
    return res.status(400).json({
      message:
        "Weekly pay record for this employee, month, and week already exists.",
      data: existingRecord,
    });
  }

  // Create a new WeeklyPay record if none exists
  const weeklyPay = new WeeklyPay({
    employeeId,
    month,
    weekNumber,
    daysPresent,
    daysAbsent,
    startDate,
    endDate,
    totalAmount,
    cash,
    amountDeducted,
    amountPaid,
    fullDaysWithExtraWork: fullDaysWithExtraWork || [],
    fullDaysWithoutExtraWork: fullDaysWithoutExtraWork || 0,
    halfDays: halfDays || 0,
  });

  await weeklyPay.save();

  res.status(201).json({
    message: "Weekly pay record created successfully.",
    data: weeklyPay,
  });
};

exports.getWeeklyPayForAllEmployees = async (req, res) => {
  const { month, weekNumber } = req.params;

  // Find all records for the given month and weekNumber
  const weeklyPays = await WeeklyPay.find({
    month,
    weekNumber,
  }).populate("employeeId", "name"); // Populate employee details
  if (weeklyPays.length === 0) {
    return res.status(200).json({
      message:
        "No weekly pay records found for the specified month and week number.",
      records: [], // Send an empty array
    });
  }

  // Structure response
  const response = weeklyPays.map((record) => ({
    employeeId: record.employeeId?._id || record.employeeId,
    employeeName: record.employeeId?.name, // Handle ObjectId or direct string
    month: record.month, // Include the month
    weekNumber: record.weekNumber, // Include the week number
    daysPresent: record.daysPresent || 0, // Default to 0 if undefined
    daysAbsent: record.daysAbsent || 0, // Default to 0 if undefined
    fullDaysWithExtraWork: record.fullDaysWithExtraWork || [], // Default to empty array if undefined
    fullDaysWithoutExtraWork: record.fullDaysWithoutExtraWork || 0, // Default to 0
    halfDays: record.halfDays || 0, // Default to 0
    startDate: record.startDate || "N/A", // Default to "N/A" if undefined
    endDate: record.endDate || "N/A", // Default to "N/A" if undefined
    totalAmount: record.totalAmount || 0, // Default to 0
    cash: record.cash || 0, // Default to 0
    amountDeducted: record.amountDeducted || 0, // Default to 0
    amountPaid: record.amountPaid || 0, // Default to 0
  }));

  res.status(200).json({
    month,
    weekNumber,
    records: response,
  });
};

exports.getWeeklyPayForEmployee = async (req, res) => {
  const { employeeId, month } = req.params;

  // Find all records for the specific employee and month
  const weeklyPays = await WeeklyPay.find({
    employeeId,
    month,
  }).populate("employeeId", "name email"); // Populate employee details

  if (weeklyPays.length === 0) {
    return res.status(200).json({
      totalDaysPresent: 0,
    });
  }

  // Structure response and calculate total days present
  const response = weeklyPays.map((record) => ({
    weekNumber: record.weekNumber,
    daysPresent: record.daysPresent,
    daysAbsent: record.daysAbsent,
    startDate: record.startDate,
    endDate: record.endDate,
    totalAmount: record.totalAmount,
    cash: record.cash,
    amountDeducted: record.amountDeducted,
    amountPaid: record.amountPaid,
  }));

  // Calculate total days present
  const totalDaysPresent = weeklyPays.reduce(
    (sum, record) => sum + record.daysPresent,
    0
  );

  res.status(200).json({
    employeeId: weeklyPays[0].employeeId._id,
    employeeName: weeklyPays[0].employeeId.name,
    employeeEmail: weeklyPays[0].employeeId.email,
    month,
    totalDaysPresent,
    records: response,
  });
};

exports.getMonthlyPayReportForAllEmployees = async (req, res) => {
  const { month } = req.params;

  if (!month) {
    return res.status(400).json({ message: "Month is required." });
  }

  try {
    // Fetch all employees
    const employees = await Employee.find();

    if (!employees || employees.length === 0) {
      return res.status(404).json({ message: "No employees found." });
    }

    // Initialize an empty array for reports
    const reports = [];

    // Loop through each employee and calculate their monthly report
    for (const employee of employees) {
      // Fetch weekly pay data for the specific month for each employee
      const weeklyPays = await WeeklyPay.find({ employeeId: employee._id, month });

      if (weeklyPays.length === 0) continue;

      // Calculate the totals for the employee's report
      let totalDaysPresent = 0;
      let totalDaysAbsent = 0;
      let totalAmountPaid = 0;
      let totalExtraWorkDays = 0;
      let totalFullDaysWithoutExtraWork = 0;
      let totalHalfDays = 0;

      // Loop through weekly pay data to accumulate totals
      for (const record of weeklyPays) {
        totalDaysPresent += record.daysPresent;
        totalDaysAbsent += record.daysAbsent;
        totalAmountPaid += record.amountPaid;
        totalExtraWorkDays += record.fullDaysWithExtraWork.length;
        totalFullDaysWithoutExtraWork += record.fullDaysWithoutExtraWork;
        totalHalfDays += record.halfDays;
      }

      // Push the calculated report for this employee into the reports array
      reports.push({
        employeeId: employee._id,
        employeeName: employee.name,
        month,
        totalDaysPresent,
        totalDaysAbsent,
        totalAmountPaid,
        totalExtraWorkDays,
        totalFullDaysWithoutExtraWork,
        totalHalfDays,
      });
    }

    // Return the final reports
    if (reports.length > 0) {
      return res.status(200).json({ reports });
    } else {
      return res.status(404).json({ message: "No reports found for the given month." });
    }
  } catch (error) {
    console.error('Error generating monthly pay report:', error);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};