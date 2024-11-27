// routes/attendanceRoutes.js
const express = require("express");
const router = express.Router();
const attendanceController = require("../controllers/attendanceControllers");
const catchAsync = require("../utils/catchAsync");


// Route to get monthly attendance for an employee
router.get(
  "/employees/:employeeId/attendance/:month",
  catchAsync(attendanceController.getMonthlyAttendance)
);

// Route to calculate monthly salary for an employee
router.get(
  "/employees/:employeeId/salary/:month",
  catchAsync(attendanceController.calculateSalary)
);

// Route to update attendance status for a specific date
router.put(
  "/employees/:employeeId/attendance/:date",
  catchAsync(attendanceController.updateDailyAttendance)
);

// Route to remove attendance status for a specific date
router.delete(
  "/employees/:employeeId/attendance/:date",
  catchAsync(attendanceController.removeAttendance)
);

module.exports = router;
