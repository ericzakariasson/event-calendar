import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Event from './Event';

const Wrapper = styled.article`
  flex: 1;

  &:hover {
    background: ${p => p.theme.colors.rgba.primary(3)};
  }

  &:not(:last-child) {
    border-right: 1px solid #eee;
  }
`;

const Name = styled.h1`
  text-align: center;
  font-weight: normal;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const Cells = styled.ul`
  list-style: none;
`;

const Cell = styled.li`
  width: 100%;
  height: ${p => p.theme.cellHeight}px;
  border-bottom: 1px solid #f5f5f5;

  &:nth-child(even) {
    border-color: #eee;
  }

  &:hover {
    background: red;
  }
`;

const Date = styled.span`
  text-align: center;
  color: ${p => p.theme.colors.rgba.primary(p.today ? 75 : 25)};
  font-weight: 500;
`;

const Header = styled.header`
  display: flex;
  flex-direction: column;
  height: 5rem;
  border-bottom: ${p => (p.today ? `3px solid ${p.theme.colors.primary}` : '1px solid #EEE')};
  justify-content: center;
  background: #fff;
  position: sticky;
  top: 0;
  z-index: 2;
`;

const TimelineWrapper = styled.div`
  position: relative;
`;

const Timeline = styled.section`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
`;

const Day = ({ day, date, cells, events, isToday }) => {
  const hasDate = date || false;

  return (
    <Wrapper>
      <Header today={isToday}>
        <Name>{day.name}</Name>
        {hasDate && (
          <Date today={isToday}>
            {date.getDate()}/{date.getMonth() + 1}
          </Date>
        )}
      </Header>
      <TimelineWrapper>
        <Timeline>{events && events.map(event => <Event key={event.id} {...event} />)}</Timeline>
        <Cells>
          {cells.map(cell => (
            <Cell key={cell.position} title={cell.formatted} />
          ))}
        </Cells>
      </TimelineWrapper>
    </Wrapper>
  );
};

Day.propTypes = {
  day: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }),
  // date: PropTypes.instanceOf(Date),
  cells: PropTypes.arrayOf(PropTypes.object),
};

export default Day;
