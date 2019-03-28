import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const Wrapper = styled.article`
  flex: 1;

  &:not(:last-child) {
    border-right: 1px solid #eee;
  }
`;

const Name = styled.h1`
  text-align: center;
  font-weight: normal;
  height: 3rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Timeline = styled.ul`
  list-style: none;
`;

const Cell = styled.li`
  width: 100%;
  height: 1.5rem;
  border-bottom: 1px solid #fcfcfc;

  &:nth-child(even) {
    border-color: #eee;
  }

  &:hover {
    background: #eee;
  }
`;

const Date = styled.span`
  text-align: center;
`;

const Header = styled.header`
  display: flex;
  flex-direction: column;
  height: 5rem;
  border-bottom: 1px solid #eee;
`;

const Day = ({ day, date, cells }) => {
  return (
    <Wrapper>
      <Header>
        <Name>{day.name}</Name>
        <Date>
          {date.getDate()}/{date.getMonth()}
        </Date>
      </Header>
      <Timeline>
        {cells.map(cell => (
          <Cell key={cell.position} title={cell.formatted} />
        ))}
      </Timeline>
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
