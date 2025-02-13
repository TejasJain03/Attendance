const moment = require('moment');

async function getWeeksInMonth(month) {
  const weeks = [];
  const startOfMonth = moment(month, "YYYY-MM").startOf("month");
  const endOfMonth = moment(month, "YYYY-MM").endOf("month");

  let startOfWeek = startOfMonth.clone().startOf("week"); // Start from Sunday
  let weekNumber = 1;

  while (
    startOfWeek.isBefore(endOfMonth) ||
    startOfWeek.isSame(endOfMonth, "day")
  ) {
    let endOfWeek = startOfWeek.clone().endOf("week"); // End on Saturday

    weeks.push({
      week: weekNumber,
      start: startOfWeek.format("YYYY-MM-DD"),
      end: endOfWeek.format("YYYY-MM-DD"),
    });

    startOfWeek.add(1, "week");
    weekNumber++;

    if (startOfWeek.date() > 1 && startOfWeek.month() > endOfMonth.month()) {
      break;
    }
  }

  return weeks;
}

console.log(getWeeksInMonth("2025-02"));
