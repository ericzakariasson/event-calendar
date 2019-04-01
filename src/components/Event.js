import React from 'react';
import styled, { css } from 'styled-components';

import { useCalendarEvent, useHandle } from '../hooks';

import { MapPin } from 'react-feather';

const Wrapper = styled.article`
  position: absolute;
  top: ${p => p.theme.cellHeight * p.start}px;
  width: 95%;
  padding: 10px 10px;
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
  opacity: ${p => (p.active ? 0.75 : 0.5)};
  transition: ${p => p.theme.transition};
  box-shadow: ${p => p.active && '0 4px 8px rgba(0,0,0,0.1)'};
  border-radius: 4px;

  ${p =>
    p.hasStart &&
    css`
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
    `};

  ${p =>
    p.hasEnd &&
    css`
      border-top-left-radius: 0;
      border-top-right-radius: 0;
    `}
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

const DragHandle = styled.div`
  height: 4px;
  background: ${p => p.theme.colors.event[p.activity].handle};
  position: absolute;
  left: 0;
  right: 0;
  border-radius: 100px;
  opacity: ${p => (p.visible ? 1 : 0)};
  transition: 0.3s ease-in-out;
  cursor: row-resize;
`;

const StartHandle = styled(DragHandle)`
  top: 0;
`;

const EndHandle = styled(DragHandle)`
  bottom: 0;
`;

const formatOptions = {
  hour: '2-digit',
  minute: '2-digit',
};

const Event = ({ id, start: initialStart, end: initialEnd }) => {
  const { event, isHovered, isSelected, bind, handleDrag } = useCalendarEvent(id);

  const initialPositions = {
    start: initialStart.position,
    end: initialEnd.position,
  };

  const { style, start, end, hasStart, hasEnd, isSmall, isDragging, handleMouseDown } = useHandle(
    id,
    initialPositions,
    handleDrag
  );

  const isActive = isHovered || isSelected || isDragging;

  const bindHandle = handle => ({
    onMouseDown: () => handleMouseDown(handle),
  });

  return (
    <Wrapper style={style} active={isActive} {...bind}>
      {hasStart && (
        <StartHandle visible={isActive} activity={event.activity} {...bindHandle('start')} />
      )}
      {hasStart && !isSmall && <Starts>Starts {start.time}</Starts>}

      <Activity activity={event.activity}>{event.activity}</Activity>
      <Location>
        <MapPin size={14} />
        <LocationText>{event.location}</LocationText>
      </Location>

      {hasEnd && !isSmall && <Ends>Ends {end.time}</Ends>}
      {hasEnd && <EndHandle visible={isActive} activity={event.activity} {...bindHandle('end')} />}

      <Background hasEnd={hasEnd} hasStart={hasStart} activity={event.activity} active={isActive} />
    </Wrapper>
  );
};

export default Event;
