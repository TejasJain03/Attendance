const mongoose = require("mongoose");
const moment = require("moment");
const WeeklyPay = require("../models/weeklyPay");

const MONGO_URL =
  "mongodb+srv://TejasJain03:vownP7Xp7j2NLO9C@cluster0.0ldxy2n.mongodb.net/attendence?retryWrites=true&w=majority";

async function connectDB() {
  try {
    await mongoose.connect(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
  }
}

// Function to get weeks in a given month
async function getWeeksInMonth(month) {
  const weeks = [];
  const startOfMonth = moment(month, "YYYY-MM").startOf("month");
  const endOfMonth = moment(month, "YYYY-MM").endOf("month");

  let startOfWeek = startOfMonth.clone().startOf("isoWeek"); // Start from the first Monday
  let weekNumber = 1;

  while (startOfWeek.isBefore(endOfMonth) || startOfWeek.isSame(endOfMonth, "day")) {
    let endOfWeek = startOfWeek.clone().endOf("isoWeek");

    weeks.push({
      week: weekNumber,
      start: startOfWeek.format("YYYY-MM-DD"),
      end: endOfWeek.format("YYYY-MM-DD"),
    });

    startOfWeek.add(1, "week");
    weekNumber++;

    // Stop if the start of the new week is beyond the month's last date
    if (startOfWeek.date() > 1 && startOfWeek.month() > endOfMonth.month()) {
      break;
    }
  }

  return weeks;
}

// Function to fetch Weekly Pay based on month and week number
async function fetchWeeklyPayByWeekNumber(employeeId, month, weekNumber) {
  try {
    await connectDB();

    const weeks = await getWeeksInMonth(month);

    // Find the requested week
    const selectedWeek = weeks.find((week) => week.week === weekNumber);
    if (!selectedWeek) {
      console.log("❌ Invalid week number for the given month.");
      return;
    }

    const { start, end } = selectedWeek;
    console.log(`📆 Fetching records from ${start} to ${end}...`);

    const results = await WeeklyPay.find({
      employeeId: employeeId,
      $or: [
        { startDate: { $gt: start, $lt: end } },
        { endDate: { $gt: start, $lt: end } },
      ],
    });

    console.log("📌 Weekly Pay Data List:", results);

    if (results.length === 0) {
      console.log("❌ No weekly pay records found for the given week.");
    } else {
      console.log(`✅ Found ${results.length} weekly pay records.`);
      results.forEach((record, index) => {
        console.log(
          `🔹 Record ${index + 1}: Start Date: ${moment(record.startDate).format(
            "YYYY-MM-DD"
          )}, End Date: ${moment(record.endDate).format(
            "YYYY-MM-DD"
          )}, Amount Paid: ₹${record.amountPaid}`
        );
      });
    }
  } catch (error) {
    console.error("❌ Error fetching data:", error);
  } finally {
    await mongoose.connection.close();
    console.log("🔌 Disconnected from MongoDB");
  }
}

// Example usage:
const employeeId = "677fb58067cb815f6031ed7d"; // Employee ID
const month = "2025-01"; // Month in YYYY-MM format
const weekNumber = 1; // Week number

fetchWeeklyPayByWeekNumber(employeeId, month, weekNumber);
