// routes/attendanceRoutes.js
const express = require("express");
const router = express.Router();
const attendanceController = require("../controllers/attendanceControllers");
const catchAsync = require("../utils/catchAsync");

router.get(
  "/employees/:employeeId/attendance/:month",
  catchAsync(attendanceController.getAttendanceForMonth)
);

// Route to get monthly attendance for an employee
router.get(
  "/employees/:employeeId/attendance/:month/:weekNumber",
  catchAsync(attendanceController.getWeeklyAttendanceForEmployee)
);

// Route to update attendance status for a specific date
router.put(
  "/employees/:employeeId/attendance/:date",
  catchAsync(attendanceController.updateDailyAttendance)
);

router.put(
  "/employees/multiple-attendance/:date",
  catchAsync(attendanceController.updateDailyAttendanceForMultipleEmployees)
);

router.get(
  "/employees/weekly-report/:month/:weekNumber",
  catchAsync(attendanceController.getWeeklyAttendanceForAllEmployees)
);

router.get(
  "/employees/pay-weekly/:month/:weekNumber",
  catchAsync(attendanceController.getWeeklyAttendanceForAllEmployees)
);

// Route to remove attendance status for a specific date
router.delete(
  "/employees/:employeeId/attendance/:date",
  catchAsync(attendanceController.removeAttendance)
);

module.exports = router;
