export function calculateSalary(employeeSummaryWeek, totalDaysPresentTillNow, startDate, endDate) {
  let totalSalary = 0;
  let totalDaysPresent = totalDaysPresentTillNow;
  let exceedingDaysCount = 0;
  let salaryHistory = [];

  const { fullDaysWithExtraWork = [], fullDaysWithoutExtraWork = 0, halfDays = 0, daysAbsent = 0, employee } = employeeSummaryWeek;
  const cashPayment = employee?.paymentDivision?.cash || 0;
  const accountPayment = employee?.paymentDivision?.account || 0;

  let currentDate = new Date(startDate);
  const end = new Date(endDate);

  // Helper Functions
  const addDays = (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };

  const isLastDayOfMonth = (date) => {
    const nextDay = addDays(date, 1);
    return nextDay.getDate() === 1;
  };

  const logSalary = (date, dailySalary, isAbsent = false) => {
    const dateString = date.toLocaleDateString();
    salaryHistory.push({
      date: dateString,
      salaryEarned: isAbsent ? 0 : dailySalary,
      totalSalaryAccumulated: totalSalary,
      totalDaysPresent
    });

    // Check if it’s the last day of the month and total days present are below the threshold
    if (isLastDayOfMonth(date) && totalDaysPresent < 22) {
      handleShortDays();
    }
  };

  const handleShortDays = () => {
    const daysShort = 22 - totalDaysPresent;
    const deduction = daysShort * accountPayment;
    console.log(`⚠️ Employee worked only ${totalDaysPresent} days this month. ${daysShort} day(s) short.`);
    console.log(`💸 Deducting ₹${deduction} from the total salary.`);
    totalSalary -= deduction;
  };

  const calculateDailySalary = (extraWorkHours = 0, isFullDay = true) => {
    if (totalDaysPresent === 21.5) {
      totalDaysPresent += 1;
      return 0.5 * cashPayment + 0.5 * (cashPayment + accountPayment);
    }

    totalDaysPresent += isFullDay ? 1 : 0.5;

    if (totalDaysPresent > 22) {
      exceedingDaysCount++;
      return cashPayment + accountPayment;
    }

    if (extraWorkHours === 0.5) {
      return cashPayment + (cashPayment + accountPayment) / 2;
    }

    return extraWorkHours === 1 ? cashPayment + accountPayment : (isFullDay ? cashPayment : cashPayment / 2);
  };

  // Processing Functions
  const processDays = (days, extraWorkHours = 0, isFullDay = true, isAbsent = false) => {
    for (let i = 0; i < days; i++) {
      const dailySalary = isAbsent ? 0 : calculateDailySalary(extraWorkHours, isFullDay);
      totalSalary += dailySalary;
      logSalary(currentDate, dailySalary, isAbsent);
      currentDate = addDays(currentDate, 1);
    }
  };

  // Processing all types of days
  fullDaysWithExtraWork.forEach(day => processDays(1, day.extraWorkHours));
  processDays(fullDaysWithoutExtraWork);
  processDays(halfDays, 0, false);
  processDays(daysAbsent, 0, true, true);

  console.log("📊 Salary Breakdown:");
  salaryHistory.forEach(entry => {
    console.log(`${entry.date}: ₹${entry.salaryEarned} | Total Salary: ₹${entry.totalSalaryAccumulated} | Total Days Present: ${entry.totalDaysPresent}`);
  });

  return totalSalary;
}

// // Example usage
// const totalSalary = calculateSalary(
//   {
//     totalDays: 6,
//     fullDaysWithExtraWork: [],
//     fullDaysWithoutExtraWork: 4,
//     halfDays: 0,
//     daysAbsent: 2,
//     employee: {
//       paymentDivision: {
//         account: 364,
//         cash: 636,
//       },
//     },
//   },
//   13.5,
//   "2025-02-23",
//   "2025-03-01"
// );

// console.log(`\n💰 Total Salary Earned: ₹${totalSalary}`);
