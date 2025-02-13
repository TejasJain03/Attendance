export function calculateSalary(employeeSummaryWeek, totalDaysPresentTillNow) {
  let totalSalary = 0;
  let totalDaysPresent = totalDaysPresentTillNow; // Total number of days present till now.
  let exceedingDaysCount = 0; // Tracks days exceeding the 22-day threshold.

  // let salaryHistory = []; // Stores daily salary logs

  const fullDaysWithExtraWork =
    employeeSummaryWeek?.fullDaysWithExtraWork || [];
  const fullDaysWithoutExtraWork =
    employeeSummaryWeek?.fullDaysWithoutExtraWork || 0;
  const halfDays = employeeSummaryWeek?.halfDays || 0;

  const cashPayment = employeeSummaryWeek?.employee?.paymentDivision?.cash || 0;
  const accountPayment =
    employeeSummaryWeek?.employee?.paymentDivision?.account || 0;

  // let i = 0
  // // Function to log daily salary with date
  // const logSalary = (dailySalary) => {
  //   i = i + 1
  //   salaryHistory.push({
  //     date: new Date().toLocaleDateString() + i,
  //     time: new Date().toLocaleTimeString(),
  //     salaryEarned: dailySalary,
  //     totalSalaryAccumulated: totalSalary,
  //   });
  // };

  // Full days with extra work hours
  fullDaysWithExtraWork.forEach((day) => {
    let dailySalary = 0;

    if (totalDaysPresent === 21.5) {
      dailySalary = 0.5 * cashPayment + 0.5 * (cashPayment + accountPayment);
      totalDaysPresent += 1;
    } else {
      totalDaysPresent += 1;

      if (totalDaysPresent > 22) {
        if (exceedingDaysCount < totalDaysPresent - 22) {
          exceedingDaysCount += 1;
          dailySalary = cashPayment + accountPayment;
        }
      } else {
        if (day.extraWorkHours == 0.5) {
          dailySalary = cashPayment + (cashPayment + accountPayment) / 2;
        } else if (day.extraWorkHours == 1) {
          dailySalary = cashPayment + accountPayment;
        }
      }
    }

    totalSalary += dailySalary;
    // logSalary(dailySalary);
  });

  // Full days without extra work
  for (let i = 0; i < fullDaysWithoutExtraWork; i++) {
    let dailySalary = 0;

    if (totalDaysPresent === 21.5) {
      dailySalary = 0.5 * cashPayment + 0.5 * (cashPayment + accountPayment);
      totalDaysPresent += 1;
    } else {
      totalDaysPresent += 1;

      if (totalDaysPresent > 22) {
        if (exceedingDaysCount < totalDaysPresent - 22) {
          exceedingDaysCount += 1;
          dailySalary = cashPayment + accountPayment;
        }
      } else {
        dailySalary = cashPayment;
      }
    }

    totalSalary += dailySalary;
    // logSalary(dailySalary);
  }

  // Half days calculation
  for (let i = 0; i < halfDays; i++) {
    let dailySalary = 0;

    if (totalDaysPresent === 21.5) {
      dailySalary = 0.5 * cashPayment + 0.5 * (cashPayment + accountPayment);
      totalDaysPresent += 1;
    } else {
      totalDaysPresent += 0.5;
      dailySalary = cashPayment / 2;
    }

    totalSalary += dailySalary;
    // logSalary(dailySalary);
  }

  return totalSalary;
}

// Example usage:
// const result = calculateSalary(
//   {
//     fullDaysWithExtraWork: [],
//     fullDaysWithoutExtraWork: 5,
//     halfDays: 0,
//     employee: {
//       paymentDivision: {
//         account: 364, // Example values
//         cash: 636,
//       },
//     },
//   },
//   20.5
// );

// console.log(result)
