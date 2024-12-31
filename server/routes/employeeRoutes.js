// routes/employeeRoutes.js
const express = require("express");
const router = express.Router();
const employeeController = require("../controllers/employeeControllers");
const catchAsync = require("../utils/catchAsync");

// Route to create a new employee
router.post("/create-employee", catchAsync(employeeController.createEmployee));

router.get("/employees", catchAsync(employeeController.getAllEmployees)); // Get all employees

// Route to get employee details by ID
router.get(
  "/employees/:employeeId",
  catchAsync(employeeController.getEmployeeById)
);

router.put(
  "/employees/:employeeId/add-loan",
  catchAsync(employeeController.addLoan)
);
router.put(
  "/employees/:employeeId/:loanId/deduct-loan",
  catchAsync(employeeController.deductLoan)
);

router.put(
  "/employees/:employeeId",
  catchAsync(employeeController.updateEmployee)
);

router.delete(
  "/employees/:employeeId",
  catchAsync(employeeController.deleteEmployee)
);

module.exports = router;
