export function setTime(date, { hours, minutes, seconds = 0, milliseconds = 0 }) {
  return new Date(new Date(date).setHours(hours, minutes, seconds, milliseconds));
}

export function resetDate(date) {
  return setTime(date, { hours: 0, minutes: 0 });
}

export function setMidnight(date) {
  return setTime(date, { hours: 24, minutes: 0 });
}

export function sameDay(d1, d2) {
  const isSameDay =
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  const day = isSameDay ? resetDate(d1) : null;

  return { isSameDay, day };
}

function differenceInDays(d1, d2) {
  const timeDifference = Math.abs(d2.getTime() - d1.getTime());
  const dayDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));

  return dayDifference;
}

export function getWeekFromDate(date) {
  const day = date.getDay();
  const difference = date.getDate() - day + (day === 0 ? -6 : 1);

  const initialDay = resetDate(date.setDate(difference));
  const restOfWeek = getDatesFromDateToN(initialDay, 6);

  return [initialDay, ...restOfWeek];
}

export function getDatesBetween(startDate, endDate) {
  const resettedStartDate = resetDate(startDate);
  const resettedEndDate = resetDate(endDate);
  const dayDiff = differenceInDays(resettedStartDate, resettedEndDate);

  if (dayDiff === 0) {
    throw new Error('No difference in days');
  }

  if (dayDiff === 1) {
    return [resettedStartDate, resettedEndDate];
  }

  // Don't include end date
  const dates = getDatesFromDateToN(resettedStartDate, dayDiff - 1);

  return [resettedStartDate, ...dates, resettedEndDate];
}

export function getDatesFromDateToN(date, n) {
  const dates = Array.from({ length: n }, (_, i) => {
    const incremented = addDays(date.valueOf(), i + 1);
    return new Date(incremented);
  });

  return dates;
}

export function addDays(initialDate, days) {
  const date = new Date(initialDate.valueOf());
  date.setDate(date.getDate() + days);
  return date;
}

export function getNextWeek(week) {
  const lastDay = week[week.length - 1];
  const firstDayOfWeek = addDays(lastDay, 1);
  const nextWeek = getWeekFromDate(firstDayOfWeek);
  return nextWeek;
}

export function getPreviousWeek(week) {
  const lastDay = week[week.length - 1];
  const firstDayOfWeek = addDays(lastDay, -7);
  const previousWeek = getWeekFromDate(firstDayOfWeek);
  return previousWeek;
}

export function getWeekNumber(d) {
  const copy = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  // Set to nearest Thursday: current date + 4 - current day number
  // Make Sunday's day number 7
  const currentDay = copy.getDay();
  copy.setDate(copy.getDate() + 4 - (currentDay === 0 ? 7 : currentDay));
  // Get first day of year
  const yearStart = new Date(new Date(copy.getFullYear(), 0, 1));
  // Calculate full weeks to nearest Thursday
  const weekNumber = Math.ceil((copy - yearStart) / 86400000 / 7);
  return weekNumber;
}
