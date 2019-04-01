import { HOURS } from './constants';

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

export function getDates(startDate, endDate) {
  const resettedStartDate = resetDate(startDate);
  const resettedEndDate = resetDate(endDate);
  const dayDiff = differenceInDays(resettedStartDate, resettedEndDate);

  if (dayDiff === 0) {
    throw new Error('No difference in days');
  }

  if (dayDiff === 1) {
    return [resettedStartDate, resettedEndDate];
  }

  const dates = getDatesFromDateToN(resettedStartDate, dayDiff - 1);

  return [resettedStartDate, ...dates, resettedEndDate];
}

export function getWeekFromDate(date) {
  const day = date.getDay();
  const difference = date.getDate() - day + (day === 0 ? -6 : 1);

  const initialDay = resetDate(date.setDate(difference));
  const restOfWeek = getDatesFromDateToN(initialDay, 6);

  return [initialDay, ...restOfWeek];
}

function differenceInDays(d1, d2) {
  const timeDifference = Math.abs(d2.getTime() - d1.getTime());
  const dayDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));

  return dayDifference;
}

export function sameDay(d1, d2) {
  const isSameDay =
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();
  const day = isSameDay ? resetDate(d1) : null;

  return { isSameDay, day };
}

export function resetDate(date) {
  return new Date(new Date(date).setHours(0, 0, 0, 0));
}

export function setMidnight(date) {
  return new Date(new Date(date).setHours(24, 0, 0, 0));
}

export function createEventMap(events) {
  const eventArray = Object.keys(events).map(key => events[key]);

  if (eventArray.length === 0) {
    return {};
  }

  return eventArray.reduce((eventMap, event) => {
    const { startDate, endDate } = event;
    const { isSameDay, day } = sameDay(startDate, endDate);

    if (isSameDay) {
      const dayId = day.getTime();

      if (!eventMap[dayId]) {
        eventMap[dayId] = [];
      }

      const oldEvents = eventMap[dayId];

      const newEvent = {
        id: event.id,
        start: {
          time: startDate,
          position: timeToPosition(startDate),
        },
        end: {
          time: endDate,
          position: timeToPosition(endDate),
        },
      };

      eventMap[dayId] = oldEvents.concat(newEvent);

      return eventMap;
    }

    const affectedDays = getDates(startDate, endDate);

    const firstAffectedDate = 0;
    const lastAffectedDate = affectedDays.length - 1;

    affectedDays.forEach((day, i) => {
      const dayId = resetDate(day).getTime();

      if (!eventMap[dayId]) {
        eventMap[dayId] = [];
      }

      const startTime = resetDate(day);
      const endTime = setMidnight(day);

      const newEvent = {
        id: event.id,
        start: {
          time: startTime,
          position: timeToPosition(startTime),
        },
        end: {
          time: endTime,
          position: timeToPosition(endTime, true),
        },
      };

      if (i === firstAffectedDate) {
        newEvent.start = {
          time: startDate,
          position: timeToPosition(startDate),
        };
      }

      if (i === lastAffectedDate) {
        newEvent.end = {
          time: endDate,
          position: timeToPosition(endDate),
        };
      }

      const oldEvents = eventMap[dayId];
      eventMap[dayId] = oldEvents.concat(newEvent);
    });

    return eventMap;
  }, {});
}

export function timeToPosition(date, midnight) {
  if (midnight) {
    return 2 * 24;
  }

  const hour = date.getHours();
  const minutes = date.getMinutes();
  const decimal = minutes / 60;
  return (hour + decimal) * 2;
}

export function parseEvent(event) {
  return {
    ...event,
    startDate: new Date(event.startDate),
    endDate: new Date(event.endDate),
  };
}

export const sortEvent = (a, b) => a.startDate - b.startDate;
export const isWholeHour = cell => (cell.position * 2) % 2 === 0;

export function generateCells() {
  return Array.from({ length: HOURS * 2 }, (_, i) => {
    const position = i / 2;
    const hour = parseInt(position);
    const minute = (position * 60) % 60;
    const formatted = `${hour.toString().padStart(2, 0)}:${minute.toString().padStart(2, 0)}`;
    return {
      position,
      hour,
      minute,
      formatted,
    };
  });
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

export function setTime(date, { hours, minutes }) {
  return new Date(new Date(date).setHours(hours, minutes));
}

export function getWeekNumber(d) {
  // Copy date so don't modify original
  const copy = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  // Set to nearest Thursday: current date + 4 - current day number
  // Make Sunday's day number 7
  const currentDay = copy.getDay();
  copy.setDate(copy.getDate() + 4 - (currentDay === 0 ? 7 : currentDay));
  // Get first day of year
  const yearStart = new Date(new Date(copy.getFullYear(), 0, 1));
  // Calculate full weeks to nearest Thursday
  const weekNo = Math.ceil((copy - yearStart) / 86400000 / 7);
  // Return array of year and week number

  return weekNo;
}

export function positionToTimeString(position) {
  const timePosition = position / 2;

  const hours = Math.trunc(timePosition);
  const minutes = (timePosition - hours) * 60;
  const formatted = `${hours.toString().padStart(2, 0)}:${minutes.toString().padStart(2, 0)}`;

  return formatted;
}
