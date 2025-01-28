const express = require("express");
const router = express.Router();
const weeklyPayController = require("../controllers/weeklyPayControllers");
const catchAsync = require("../utils/catchAsync");

router.post(
  "/employees/:employeeId/weeklyPay",
  catchAsync(weeklyPayController.createWeeklyPay)
);

router.get(
  "/employees/:employeeId/get-weeklyPay/:month/:weekNumber",
  catchAsync(weeklyPayController.getWeeklyPayForAllEmployeeWeekAndMonth)
);

router.get(
  "/employees/get-weeklyPay/:month/:weekNumber",
  catchAsync(weeklyPayController.getWeeklyPayForAllEmployees)
);
router.get(
  "/employees/:employeeId/get-weeklyPay/:month",
  catchAsync(weeklyPayController.getWeeklyPayForEmployee)
);

router.get(
  "/employees/monthly-report/:month",
  catchAsync(weeklyPayController.getMonthlyPayReportForAllEmployees)
);

router.delete(
  "/employees/:employeeId/weeklyPay/:month/:weekNumber",
  catchAsync(weeklyPayController.deleteWeeklyPayReport)
);

module.exports = router;