import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { WEEK_DAYS } from '../constants';
import {
  generateCells,
  parseEvent,
  getWeekFromDate,
  sortEvent,
  getNextWeek,
  getPreviousWeek,
  getWeekNumber,
  sameDay,
} from '../helpers';
import { useCalendarEvents } from '../context/CalendarEventContext';

import Day from './Day';
import SelectWeek from './SelectWeek';
import TimeLabels from './TimeLabels';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const Header = styled.header``;

const Main = styled.main`
  display: flex;
`;

const Week = styled.section`
  display: flex;
  flex: 1;
`;

const cells = generateCells();

function normalizeEvent(obj, item) {
  obj[item.id] = item;
  return obj;
}

const parseEvents = json =>
  json
    .map(parseEvent)
    .sort(sortEvent)
    .reduce(normalizeEvent, {});

const Calendar = () => {
  const [week, setWeek] = useState([...WEEK_DAYS]);
  const { eventArray, eventMap, setEvents } = useCalendarEvents();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      const res = await fetch(process.env.REACT_APP_API_URL);
      const json = await res.json();
      const data = parseEvents(json);
      setEvents(data);
      setLoading(false);
    }
    fetchEvents();
  }, []);

  useEffect(() => {
    if (eventArray.length === 0) {
      return;
    }

    const firstEventDate = eventArray.sort(sortEvent)[0].startDate;
    const initialWeek = getWeekFromDate(firstEventDate);
    setWeek(initialWeek);
  }, [eventArray]);

  function goToNextWeek() {
    const nextWeek = getNextWeek(week);
    setWeek(nextWeek);
  }

  function goToPreviousWeek() {
    const nextWeek = getPreviousWeek(week);
    setWeek(nextWeek);
  }

  const weekNumber = loading ? '' : getWeekNumber(week[0]);
  const today = new Date();

  const isToday = date => {
    const { isSameDay } = sameDay(today, date);
    return isSameDay;
  };

  return (
    <Wrapper>
      <Header>
        <SelectWeek
          weekNumber={weekNumber}
          goToPreviousWeek={goToPreviousWeek}
          goToNextWeek={goToNextWeek}
        />
      </Header>
      <Main>
        <TimeLabels cells={cells} />
        <Week>
          {week.map((date, i) => (
            <Day
              key={loading ? i : date.getDate()}
              events={loading ? [] : eventMap[date.getTime()]}
              cells={cells}
              date={loading ? null : date}
              day={WEEK_DAYS[i]}
              isToday={loading ? false : isToday(date)}
            />
          ))}
        </Week>
      </Main>
    </Wrapper>
  );
};

export default Calendar;
