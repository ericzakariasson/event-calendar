import React from 'react';
import styled, { css } from 'styled-components';

import { useCalendarEvent } from '../hooks';

import { MapPin } from 'react-feather';

const Wrapper = styled.article`
  position: absolute;
  top: ${p => p.theme.cellHeight * p.start}px;
  height: ${p => p.theme.cellHeight * p.height - 1}px;
  width: 95%;
  padding: 10px;
  z-index: 1;
  transform: translateY(${p => (p.active ? '-2px' : 0)});
  word-break: break-all;
  cursor: pointer;
`;

const Background = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: ${p => p.theme.colors.event[p.activity].background};
  z-index: -1;
  opacity: ${p => (p.active ? 0.95 : 0.5)};
  transition: ${p => p.theme.transition};
  box-shadow: ${p => p.active && '0 4px 8px rgba(0,0,0,0.1)'};
  border-radius: 4px;

  ${p =>
    p.isEnd &&
    css`
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
    `}
  ${p =>
    p.isStart &&
    css`
      border-top-left-radius: 0;
      border-top-right-radius: 0;
    `};
`;

const Activity = styled.h3`
  text-transform: capitalize;
  font-weight: 500;
  color: ${p => p.theme.colors.event[p.activity].text};
  margin-bottom: 5px;
`;

const Location = styled.div`
  display: flex;
  align-items: center;

  svg {
    opacity: 0.5;
  }
`;

const LocationText = styled.h4`
  font-size: 0.8rem;
  font-weight: 400;
  margin-left: 5px;
`;

const Starts = styled.p`
  font-size: 0.8rem;
  margin-top: 10px;
`;

const Ends = styled(Starts)`
  position: absolute;
  left: 10px;
  bottom: 10px;
  font-size: 0.8rem;
`;

const formatOptions = {
  hour: '2-digit',
  minute: '2-digit',
};

const Event = ({ id, start, end }) => {
  const { event, isHovered, isSelected, bind, handleDeselect } = useCalendarEvent(id);

  const height = end.position - start.position;
  const tooSmall = height < 3;

  const isEnd = end.position === 48;
  const isStart = start.position === 0;

  const isActive = isHovered || isSelected;

  return (
    <Wrapper active={isActive} start={start.position} height={height} {...bind}>
      <Activity activity={event.activity}>{event.activity}</Activity>
      <Location>
        <MapPin size={14} />
        <LocationText>{event.location}</LocationText>
      </Location>
      {!isStart && !tooSmall && <Starts>Starts {start.time.toLocaleTimeString('sv-se', formatOptions)}</Starts>}
      {!isEnd && !tooSmall && <Ends>Ends {end.time.toLocaleTimeString('sv-se', formatOptions)}</Ends>}
      <Background isEnd={isEnd} isStart={isStart} activity={event.activity} active={isActive} />
    </Wrapper>
  );
};

export default Event;
