import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { WEEK_DAYS } from '../constants';
import {
  generateCells,
  isWholeHour,
  parseEvent,
  getWeekFromDate,
  sortEvent,
  getNextWeek,
  getPreviousWeek,
  getWeekNumber,
} from '../helpers';
import { useCalendarEvents } from '../context/CalendarEventContext';

import Day from './Day';

const Labels = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 5rem;
`;

const Label = styled.li`
  flex: 1;
  padding: 0 1rem;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.5;
  font-size: 0.8rem;

  &:hover {
    opacity: 1;
  }
`;

const Wrapper = styled.main`
  display: flex;
`;

const Week = styled.section`
  display: flex;
  flex: 1;
`;

const cells = generateCells();

const Calendar = () => {
  const [week, setWeek] = useState([]);
  const { events, eventMap, setEvents } = useCalendarEvents();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      const res = await fetch(process.env.REACT_APP_API_URL);
      const json = await res.json();

      const data = json.map(parseEvent).sort(sortEvent);

      setEvents(data);
      setLoading(false);
    }
    fetchEvents();
  }, []);

  useEffect(() => {
    if (events.length === 0) {
      return;
    }

    const firstEventDate = events[0].startDate;
    const initialWeek = getWeekFromDate(firstEventDate);
    setWeek(initialWeek);
  }, [events]);

  function goToNextWeek() {
    const nextWeek = getNextWeek(week);
    setWeek(nextWeek);
  }

  function goToPreviousWeek() {
    const nextWeek = getPreviousWeek(week);
    setWeek(nextWeek);
  }

  if (loading) {
    return <h1>Laddar...</h1>;
  }

  return (
    <Wrapper>
      <button onClick={goToPreviousWeek}>Förra vecka</button>
      <Labels>{cells.map(cell => isWholeHour(cell) && <Label key={cell.position}>{cell.hour}:00</Label>)}</Labels>
      <Week>
        {week.map((date, i) => (
          <Day key={date.getDate()} events={eventMap[date.getTime()]} cells={cells} date={date} day={WEEK_DAYS[i]} />
        ))}
      </Week>
      <button onClick={goToNextWeek}>Nästa vecka</button>
    </Wrapper>
  );
};

export default Calendar;
