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

  // Iterate through the full days with extra work
  fullDaysWithExtraWork.forEach((day) => {
    totalDaysPresent += 1; // Increase the total days present by 1 for each full day with extra work
    let dailySalary = 0;

    // If the total days present exceed 22, calculate salary for exceeding days
    if (totalDaysPresent > 22) {
      if (exceedingDaysCount < totalDaysPresent - 22) {
        exceedingDaysCount += 1; // Increment exceeding days count

        // Calculate salary for exceeding days (You can modify this as per your requirement)
        dailySalary =
          employeeSummaryWeek?.employee?.paymentDivision?.account +
          employeeSummaryWeek?.employee?.paymentDivision?.cash;
      }
    } else {
      // Regular salary calculation for full days with extra work
      if (day.extraWorkHours == 0.5) {
        dailySalary =
          employeeSummaryWeek?.employee?.paymentDivision?.cash +
          (employeeSummaryWeek?.employee?.paymentDivision?.account +
            employeeSummaryWeek?.employee?.paymentDivision?.cash) /
            2;
      } else if (day.extraWorkHours == 1) {
        dailySalary =
          employeeSummaryWeek?.employee?.paymentDivision?.account +
          employeeSummaryWeek?.employee?.paymentDivision?.cash;
      }
    }

    totalSalary += dailySalary; // Add the calculated daily salary to the total
  });

  // For full days without extra work
  for (let i = 0; i < fullDaysWithoutExtraWork; i++) {
    totalDaysPresent += 1;
    let dailySalary = 0;

    // If the total days present exceed 22, calculate salary for exceeding days
    if (totalDaysPresent > 22) {
      if (exceedingDaysCount < totalDaysPresent - 22) {
        exceedingDaysCount += 1; // Increment exceeding days count

        // Calculate salary for exceeding days (You can modify this as per your requirement)
        dailySalary =
          employeeSummaryWeek?.employee?.paymentDivision?.account +
          employeeSummaryWeek?.employee?.paymentDivision?.cash;
      }
    } else {
      // Regular salary calculation for full days without extra work
      dailySalary = employeeSummaryWeek?.employee?.paymentDivision?.cash || 0;
    }

    totalSalary += dailySalary; // Add daily salary for each full day without extra work
  }

  // For half days
  for (let i = 0; i < halfDays; i++) {
    totalDaysPresent += 1;
    let dailySalary =
      (employeeSummaryWeek?.employee?.paymentDivision?.cash || 0) / 2;
    totalSalary += dailySalary; // Add half of the daily salary for each half day
  }

  return totalSalary; // Return the calculated total salary
}
