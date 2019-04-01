import React from 'react';
import styled from 'styled-components';

import { isWholeHour } from '../helpers';

const Labels = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 5rem;
  border-right: 1px solid #f5f5f5;
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

const TimeLabels = ({ cells }) => (
  <Labels>
    {cells.map(cell => isWholeHour(cell) && <Label key={cell.position}>{cell.hour}:00</Label>)}
  </Labels>
);

export default TimeLabels;
