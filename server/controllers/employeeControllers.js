// controllers/employeeController.js
const Employee = require("../models/employee");

// Create a new employee
exports.createEmployee = async (req, res) => {
  const { name, perDayRate, paymentDivision, role, phoneNumber } = req.body;

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
    phoneNumber,
    role,
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

exports.addLoan = async (req, res) => {
  const { employeeId } = req.params;
  const { amount, dateTaken } = req.body;

  const employee = await Employee.findById(employeeId);

  if (!employee) {
    return res.status(404).json({ message: "Employee not found" });
  }

  // Add new loan to employee's loan array
  employee.loan.push({ amount, dateTaken });
  employee.save();

  res.status(200).json({ message: "Loan added successfully", employee });
};

exports.deductLoan = async (req, res) => {
  const { loanId, employeeId } = req.params; // Extract loanId and employeeId from request parameters
  const { amount } = req.body; // Extract the deduction amount from request body

  // Find the employee by ID
  const employee = await Employee.findById(employeeId);

  if (!employee) {
    return res.status(404).json({ message: "Employee not found" });
  }

  // Find the loan in the employee's loan array
  const loan = employee.loan.id(loanId);

  if (!loan) {
    return res.status(404).json({ message: "Loan not found" });
  }

  // Check if the deduction amount is valid
  if (amount > loan.amount) {
    return res
      .status(400)
      .json({ message: "Deduction amount exceeds loan balance" });
  }

  // Deduct the amount from the loan
  loan.amount -= amount;

  // Save the updated employee document
  await employee.save();

  res.status(200).json({
    message: "Loan amount deducted successfully",
    loan: employee.loan,
  });
};

exports.updateEmployee = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const updateData = req.body;

    // Find the employee by ID and update their details
    const updatedEmployee = await Employee.findByIdAndUpdate(employeeId, updateData, {
      new: true, // Return the updated document
      runValidators: true, // Validate the data before updating
    });

    if (!updatedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json({
      message: "Employee updated successfully",
      data: updatedEmployee,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating employee", error: error.message });
  }
};

// Controller to delete an employee
exports.deleteEmployee = async (req, res) => {
  try {
    const { employeeId } = req.params;

    // Find the employee by ID and delete
    const deletedEmployee = await Employee.findByIdAndDelete(employeeId);

    if (!deletedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json({
      message: "Employee deleted successfully",
      data: deletedEmployee,
    });
  } catch (error) {
    res.status(500).json({ message: "Error deleting employee", error: error.message });
  }
};