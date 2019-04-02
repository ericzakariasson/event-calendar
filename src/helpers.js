import { HOURS } from './constants';
import { sameDay, getDatesBetween, resetDate, setMidnight } from './date-helpers';

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

    const affectedDays = getDatesBetween(startDate, endDate);

    const firstAffectedDate = 0;
    const lastAffectedDate = affectedDays.length - 1;

    affectedDays.forEach((day, i) => {
      const dayId = resetDate(day).getTime();

      if (!eventMap[dayId]) {
        eventMap[dayId] = [];
      }

      // Reset all dates by default
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

export function generateCells() {
  // Half hour precision
  return Array.from({ length: HOURS * 2 }, (_, i) => {
    const position = i / 2;
    const hour = Math.trunc(position);
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

export function positionToTimeString(position) {
  const timePosition = position / 2;

  const hours = Math.trunc(timePosition);
  const minutes = (timePosition - hours) * 60;
  const formatted = `${hours.toString().padStart(2, 0)}:${minutes.toString().padStart(2, 0)}`;

  return formatted;
}

export const sortByDate = (a, b) => a.startDate - b.startDate;
export const isWholeHour = cell => (cell.position * 2) % 2 === 0;

function parseEvent(event) {
  return {
    ...event,
    startDate: new Date(event.startDate),
    endDate: new Date(event.endDate),
  };
}

function normalize(obj, item) {
  obj[item.id] = item;
  return obj;
}

export function parseEventData(json) {
  return json
    .map(parseEvent)
    .sort(sortByDate)
    .reduce(normalize, {});
}
