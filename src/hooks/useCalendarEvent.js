import { useEffect } from 'react';
import { useCalendarEvents } from '../context/CalendarEventContext';

function useCalendarEvent(id) {
  const {
    events,
    hovered,
    selected,
    moving,
    handleMouseEnter,
    handleMouseLeave,
    handleSelect,
    handleDeselect,
    handleMouseDown,
    handleMouseUp,
  } = useCalendarEvents();

  const event = events[id];
  const isHovered = hovered === id;
  const isSelected = selected === id;
  const isMoving = moving.id === id;

  const bind = {
    onMouseEnter: () => handleMouseEnter(id),
    onMouseLeave: () => handleMouseLeave(id),
    onClick: () => (isSelected ? handleDeselect() : handleSelect(id)),
  };

  const handleDrag = {
    onMouseDown: (id, handle) => handleMouseDown(id, handle),
    onMouseUp: (id, handle) => handleMouseUp(id, handle),
  };

  return { event, isHovered, isSelected, isMoving, bind, handleDrag };
}

export default useCalendarEvent;
