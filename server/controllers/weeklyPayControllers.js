const WeeklyPay = require("../models/WeeklyPay");

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
  } = req.body;
  const { employeeId } = req.params;
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
    employeeId: record.employeeId._id,
    employeeName: record.employeeId.name,
    employeeEmail: record.employeeId.email,
    daysPresent: record.daysPresent,
    daysAbsent: record.daysAbsent,
    startDate: record.startDate,
    endDate: record.endDate,
    totalAmount: record.totalAmount,
    cash: record.cash,
    amountDeducted: record.amountDeducted,
    amountPaid: record.amountPaid,
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
