export function calculateSalary(employeeSummaryWeek, totalDaysPresentTillNow) {
  let totalSalary = 0;
  let totalDaysPresent = totalDaysPresentTillNow; // This is the total number of days present till now.
  let exceedingDaysCount = 0; // To track how many days exceed the 22-day threshold.

  // Full days with extra work hours
  const fullDaysWithExtraWork =
    employeeSummaryWeek?.fullDaysWithExtraWork || [];
  const fullDaysWithoutExtraWork =
    employeeSummaryWeek?.fullDaysWithoutExtraWork || 0;
  const halfDays = employeeSummaryWeek?.halfDays || 0;

  const cashPayment = employeeSummaryWeek?.employee?.paymentDivision?.cash || 0;
  const accountPayment =
    employeeSummaryWeek?.employee?.paymentDivision?.account || 0;

  let isFirstDay = totalDaysPresent === 21.5;

  // Iterate through the full days with extra work
  fullDaysWithExtraWork.forEach((day) => {
    let dailySalary = 0;

    if (isFirstDay) {
      // Special case handling for the first day if totalDaysPresent was 21.5
      dailySalary = 0.5 * cashPayment + 0.5 * (cashPayment + accountPayment);
      isFirstDay = false; // Reset after first calculation
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
  });

  // For full days without extra work
  for (let i = 0; i < fullDaysWithoutExtraWork; i++) {
    let dailySalary = 0;

    if (isFirstDay) {
      // Special case handling for the first day if totalDaysPresent was 21.5
      dailySalary = 0.5 * cashPayment + 0.5 * (cashPayment + accountPayment);
      isFirstDay = false; // Reset after first calculation
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
  }

  // For half days
  for (let i = 0; i < halfDays; i++) {
    totalDaysPresent += 0.5;
    let dailySalary = cashPayment / 2;

    totalSalary += dailySalary;
  }

  return totalSalary;
}

// calculateSalary(
//   {
//     fullDaysWithExtraWork: [],
//     fullDaysWithoutExtraWork: 5,
//     halfDays: 0,
//     employee: {
//       paymentDivision: {
//         account: 364, // Example values
//         cash: 736,
//       },
//     },
//   },
//   21.5
// );
