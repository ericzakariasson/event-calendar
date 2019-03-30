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
    handleMouseMove,
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

  const bindHandle = handle => ({
    onMouseDown: () => handleMouseDown(id, handle),
    onMouseUp: () => handleMouseUp(id, handle),
    onMouseMove: e => (isMoving ? handleMouseMove(e) : undefined),
  });

  useEffect(() => {
    if (isMoving) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [moving]);

  return { event, isHovered, isSelected, bind, bindHandle };
}

export default useCalendarEvent;
