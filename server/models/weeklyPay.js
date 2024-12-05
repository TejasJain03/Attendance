const mongoose = require("mongoose");

const WeeklyPaySchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },
  month: {
    type: String,
    required: true,
  },
  weekNumber: {
    type: Number,
    required: true,
  },
  daysPresent: {
    type: Number,
    required: true,
  },
  daysAbsent: {
    type: Number,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  cash: {
    type: Number,
    required: true,
  },
  amountDeducted: {
    type: Number,
    required: true,
  },
  amountPaid: {
    type: Number,
    required: true,
  },
});
WeeklyPaySchema.index(
  { employeeId: 1, month: 1, weekNumber: 1 },
  { unique: true }
);

module.exports = mongoose.model("WeeklyPay", WeeklyPaySchema);
