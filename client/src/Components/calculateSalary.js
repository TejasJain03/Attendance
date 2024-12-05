export function calculateSalary(employeeSummaryWeek, totalDaysPresentTillNow) {
  let totalSalary = 0;
  let totalDaysPresent = totalDaysPresentTillNow;
  let daysExceeding = false;

  const fullDaysWithExtraWork =
    employeeSummaryWeek?.fullDaysWithExtraWork || [];
  const fullDaysWithoutExtraWork =
    employeeSummaryWeek?.fullDaysWithoutExtraWork || 0;
  const halfDays = employeeSummaryWeek?.halfDays || 0;
  fullDaysWithExtraWork.forEach((day) => {
    totalDaysPresent += 1;

    let dailySalary = 0;
    if (totalDaysPresent > 22 && !daysExceeding) {
      daysExceeding = true;
      dailySalary =
        employeeSummaryWeek?.employee?.paymentDivision?.account +
        employeeSummaryWeek?.employee?.paymentDivision?.cash;
    } else {
      if (day.extraWorkHours >= 1 && day.extraWorkHours <= 2) {
        dailySalary =
          (employeeSummaryWeek?.employee?.paymentDivision?.account +
            employeeSummaryWeek?.employee?.paymentDivision?.cash) /
          2;
      } else if (day.extraWorkHours >= 3 && day.extraWorkHours <= 4) {
        dailySalary =
          employeeSummaryWeek?.employee?.paymentDivision?.account +
          employeeSummaryWeek?.employee?.paymentDivision?.cash;
      }
    }

    totalSalary += dailySalary;
  });

  for (let i = 0; i < fullDaysWithoutExtraWork; i++) {
    totalDaysPresent += 1;
    let dailySalary = employeeSummaryWeek?.employee?.paymentDivision?.cash || 0;
    totalSalary += dailySalary;
  }

  for (let i = 0; i < halfDays; i++) {
    totalDaysPresent += 1;
    let dailySalary =
      (employeeSummaryWeek?.employee?.paymentDivision?.cash || 0) / 2;
    totalSalary += dailySalary;
  }

  return totalSalary;
}
