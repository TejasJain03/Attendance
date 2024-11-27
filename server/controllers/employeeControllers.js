// controllers/employeeController.js
const Employee = require("../models/employee");

// Create a new employee
exports.createEmployee = async (req, res) => {
  const { name, perDayRate, paymentDivision } = req.body;

  // Parse numbers to integers
  const perDayRateInt = parseInt(perDayRate, 10);
  const accountInt = parseInt(paymentDivision.account, 10);
  const cashInt = parseInt(paymentDivision.cash, 10);

  // Check if the account + cash in paymentDivision equals the perDayRate
  if (accountInt + cashInt !== perDayRateInt) {
    return res.status(400).json({
      message: "Account and cash amounts must add up to the perDayRate",
    });
  }

  // Create new employee
  const newEmployee = new Employee({
    name,
    perDayRate: perDayRateInt,
    paymentDivision: { account: accountInt, cash: cashInt },
  });
  
  await newEmployee.save();

  res.status(201).json({
    message: "Employee created successfully",
    employee: newEmployee,
  });
};


// Get employee details by ID
exports.getEmployeeById = async (req, res) => {
  const employee = await Employee.findById(req.params.employeeId);
  if (!employee) {
    return res.status(404).json({ message: "Employee not found" });
  }
  res.status(200).json({
    message: "Employee details fetched successfully",
    employee: employee,
  });
};

// Get all employees
exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find(); // Fetch all employees
    res.status(200).json({
      message: "All employees fetched successfully",
      employees: employees,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
