import React, { useEffect, useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';

import { WEEK_DAYS, HOURS } from '../constants';
import Day from './Day';

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html, body {
    min-height: 100%;
  }

  body {
    background: #FCFCFC;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 16px;
  }

  #root {
    height: 100%;
    padding: 40px;
  }
`;

const Wrapper = styled.div`
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  background: #fff;
  border-radius: 5px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.04);

  display: flex;
  flex-direction: column;
`;

const Week = styled.section`
  display: flex;
  flex: 1;
`;

const Main = styled.main`
  display: flex;
`;

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

const Footer = styled.footer`
  padding: 1rem;
  text-align: center;
`;

const cells = Array.from({ length: HOURS * 2 }, (_, i) => {
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

function getDatesFromDateToN(date, n) {
  const dates = Array.from({ length: n }, (_, i) => {
    const incremented = addDays(date.valueOf(), i + 1);
    return new Date(incremented);
  });

  return dates;
}

function addDays(initialDate, days) {
  const date = new Date(initialDate.valueOf());
  date.setDate(date.getDate() + days);
  return date;
}

function getDates(startDate, endDate) {
  const dates = [];

  while (startDate <= endDate) {
    dates.push(new Date(startDate));
    startDate = addDays(startDate, 1);
  }

  return dates;
}

function getWeekFromDate(date) {
  const day = date.getDay();
  const difference = date.getDate() - day + (day === 0 ? -6 : 1);

  const initialDay = new Date(date.setDate(difference));
  const restOfWeek = getDatesFromDateToN(initialDay, 6);

  return [initialDay, ...restOfWeek];
}

const App = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [week, setWeek] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch(process.env.REACT_APP_API_URL);
      const json = await res.json();

      const data = json
        .map(event => ({
          ...event,
          startDate: new Date(event.startDate),
          endDate: new Date(event.endDate),
        }))
        .sort((a, b) => {
          return a.startDate - b.startDate;
        });

      const firstEventDate = data[0].startDate;
      const initialWeek = getWeekFromDate(firstEventDate);
      setWeek(initialWeek);
      setEvents(data);

      setLoading(false);
    }
    fetchData();
  }, []);

  useEffect(() => {
    const daysWithEvents = events.map(event => {
      const duration = getDates(event.startDate, event.endDate);
      console.log(duration);
    });
  });

  if (loading) {
    return <h1>Laddar...</h1>;
  }

  return (
    <Wrapper>
      <Main>
        <Labels>
          {cells.map(cell => (cell.position * 2) % 2 === 0 && <Label key={cell.position}>{cell.hour}:00</Label>)}
        </Labels>
        <Week>
          {week.map((date, i) => (
            <Day key={date.getDate()} cells={cells} date={date} day={WEEK_DAYS[i]} />
          ))}
        </Week>
      </Main>
      <Footer>-</Footer>
      <GlobalStyle />
    </Wrapper>
  );
};

export default App;
