import React from 'react';
import styled from 'styled-components';

import { ChevronLeft, ChevronRight } from 'react-feather';

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 40px 20px;
  border-bottom: 1px solid #eee;
`;

const Goto = styled.button`
  background: none;
  height: 40px;
  width: 40px;
  cursor: pointer;
  border: none;
  border-radius: 3px;
  color: ${p => p.theme.colors.primary};
  background: ${p => p.theme.colors.rgba.primary(5)};
  transition: ${p => p.theme.transition};

  &:hover {
    background: ${p => p.theme.colors.rgba.primary(15)};
    transition: ${p => p.theme.transition};
  }

  &:active {
    background: ${p => p.theme.colors.rgba.primary(30)};
    transition: ${p => p.theme.transition};
  }
`;

const WeekNumber = styled.h4`
  font-size: 1.5rem;
  font-weight: 400;
`;

const SelectWeek = ({ weekNumber, goToPreviousWeek, goToNextWeek }) => {
  return (
    <Wrapper>
      <Goto onClick={goToPreviousWeek}>
        <ChevronLeft />
      </Goto>
      <WeekNumber>Week {weekNumber}</WeekNumber>
      <Goto onClick={goToNextWeek}>
        <ChevronRight />
      </Goto>
    </Wrapper>
  );
};

export default SelectWeek;
