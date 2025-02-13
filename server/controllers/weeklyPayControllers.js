const WeeklyPay = require("../models/weeklyPay");
const Employee = require("../models/employee");
const mongoose = require("mongoose");
const moment = require("moment");

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

exports.getWeeklyPayForAllEmployeeWeekAndMonth = async (req, res) => {
  const { employeeId, weekNumber, month } = req.params;
  const weeklyPaidRecord = await WeeklyPay.find({
    month,
    weekNumber,
    employeeId,
  });
  if (!weeklyPaidRecord || weeklyPaidRecord.length === 0) {
    return res.json({
      status: "success",
      message: "Weekly pay record not found for the specified parameters.",
      paid: false,
    });
  }

  res.json({
    status: "success",
    message: "Weekly pay record retrieved successfully.",
    paid: true,
    weeklyPaidRecord,
  });
};

// Function to get weeks in a given month
async function getWeeksInMonth(month) {
  const weeks = [];
  const startOfMonth = moment(month, "YYYY-MM").startOf("month");
  const endOfMonth = moment(month, "YYYY-MM").endOf("month");

  let startOfWeek = startOfMonth.clone().startOf("week"); // Start from Sunday
  let weekNumber = 1;

  while (
    startOfWeek.isBefore(endOfMonth) ||
    startOfWeek.isSame(endOfMonth, "day")
  ) {
    let endOfWeek = startOfWeek.clone().endOf("week"); // End on Saturday

    weeks.push({
      week: weekNumber,
      start: startOfWeek.format("YYYY-MM-DD"),
      end: endOfWeek.format("YYYY-MM-DD"),
    });

    startOfWeek.add(1, "week");
    weekNumber++;

    if (startOfWeek.date() > 1 && startOfWeek.month() > endOfMonth.month()) {
      break;
    }
  }

  return weeks;
}
exports.getWeeklyPayForAllEmployees = async (req, res) => {
  try {
    const { month, weekNumber } = req.params;
    const weekNum = parseInt(weekNumber, 10);
    // Get the weeks for the given month
    const weeks = await getWeeksInMonth(month);
    // Find the requested week
    const selectedWeek = weeks.find((week) => week.week === weekNum);
    if (!selectedWeek) {
      return res
        .status(400)
        .json({ message: "Invalid week number for the given month." });
    }
    const { start, end } = selectedWeek;
    console.log(`📆 Fetching weekly pay records from ${start} to ${end}...`);

    // Fetch weekly pay records for all employees in the given week
    const weeklyPays = await WeeklyPay.find({
      $or: [
        { startDate: { $gte: start, $lte: end } },
        { endDate: { $gte: start, $lte: end } },
      ],
    }).populate("employeeId", "name"); // Populate employee details with name

    if (weeklyPays.length === 0) {
      return res.status(200).json({
        message:
          "No weekly pay records found for the specified month and week number.",
        records: [],
      });
    }
    // Group records by employeeId
    const employeeRecords = {};

    weeklyPays.forEach((record) => {
      const empId = record.employeeId?._id.toString();

      if (!employeeRecords[empId]) {
        employeeRecords[empId] = {
          employeeId: empId,
          employeeName: record.employeeId?.name || "Unknown",
          month,
          weekNumber,
          startDate: start,
          endDate: end,
          daysPresent: 0,
          daysAbsent: 0,
          fullDaysWithExtraWork: 0,
          fullDaysWithoutExtraWork: 0,
          halfDays: 0,
          totalAmount: 0,
          cash: 0,
          amountDeducted: 0,
          amountPaid: 0,
          weeklyPayIds: [], // Initialize array to hold weekly pay IDs
        };
      }
      const daysPresent =
        (record.fullDaysWithExtraWork?.length || 0) +
        (record.fullDaysWithoutExtraWork || 0) +
        (record.halfDays || 0) * 0.5;

      employeeRecords[empId].daysPresent += daysPresent || 0;
      employeeRecords[empId].daysAbsent += record.daysAbsent || 0;
      employeeRecords[empId].fullDaysWithExtraWork +=
        record.fullDaysWithExtraWork?.length || 0;
      employeeRecords[empId].fullDaysWithoutExtraWork +=
        record.fullDaysWithoutExtraWork || 0;
      employeeRecords[empId].halfDays += record.halfDays || 0;
      employeeRecords[empId].totalAmount += record.totalAmount || 0;
      employeeRecords[empId].cash = record.cash || 0;
      employeeRecords[empId].amountDeducted += record.amountDeducted || 0;
      employeeRecords[empId].amountPaid += record.amountPaid || 0;
      employeeRecords[empId].weeklyPayIds.push(record._id); // Add weekly pay ID to the array
    });
    // Convert the grouped data into an array
    const response = Object.values(employeeRecords);
    // Send the response
    res.status(200).json({ month, weekNumber, records: response });
  } catch (error) {
    console.error(" Error fetching weekly pay records:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
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
    const weeklyPays = await WeeklyPay.find({
      employeeId: employee._id,
      month,
    });

    if (weeklyPays.length === 0) continue;

    // Calculate the totals for the employee's report
    let totalDaysPresent = 0;
    let totalDaysAbsent = 0;
    let totalAmountPaid = 0;
    let totalExtraWorkDays = 0;
    let totalFullDaysWithoutExtraWork = 0;
    let totalHalfDays = 0;
    let totalAmountDeducted = 0;

    // Loop through weekly pay data to accumulate totals
    for (const record of weeklyPays) {
      totalDaysAbsent += record.daysAbsent;
      totalAmountPaid += record.amountPaid;
      totalExtraWorkDays += record.fullDaysWithExtraWork.length;
      totalFullDaysWithoutExtraWork += record.fullDaysWithoutExtraWork;
      totalHalfDays += record.halfDays;
      totalAmountDeducted += record.amountDeducted || 0; // Accumulate deductions
    }

    // Adjust total days present by considering half days as 0.5
    totalDaysPresent =
      totalExtraWorkDays + totalFullDaysWithoutExtraWork + totalHalfDays * 0.5;

    // Calculate total loan amount and loan left
    const totalLoan = employee.loan.reduce((sum, loan) => sum + loan.amount, 0); // Sum all loan amounts
    const loanLeft = Math.max(0, totalLoan - totalAmountDeducted); // Ensure loanLeft is not negative

    // Push the calculated report for this employee into the reports array
    reports.push({
      employeeId: employee._id,
      employeeName: employee.name,
      phoneNumber: employee.phoneNumber, // Adding phone number to the report
      role: employee.role, // Adding role to the report
      month,
      totalDaysPresent, // Adjusted total days present
      totalDaysAbsent,
      totalAmountPaid,
      totalExtraWorkDays,
      totalFullDaysWithoutExtraWork,
      totalHalfDays, // Record half days as 1 in the report
      totalAmountDeducted, // Include amount deducted in the report
      totalLoan, // Include total loan in the report
      loanLeft, // Include loan left in the report
    });
  }

  // Return the final reports
  if (reports.length > 0) {
    return res.status(200).json({ reports });
  } else {
    return res
      .status(404)
      .json({ message: "No reports found for the given month." });
  }
};

exports.deleteWeeklyPayReports = async (req, res) => {
  const { weeklyPayIds } = req.params; // Get the array of weekly pay IDs from the request body
  const weeklyPayIdsArray = weeklyPayIds.split(","); // Split the comma-separated IDs into an array
  const deletedRecords = []; // Array to hold the records that would be deleted

  for (const id of weeklyPayIdsArray) {
    await WeeklyPay.deleteOne({ _id: id }); // Delete the record from the database
  }
  // Simulate a response without deleting records
  res.status(200).json({
    message: "Received weekly pay records for deletion.",
    receivedCount: data.length, // Return the count of received records
  });
};
