import { useCalendarEvents } from '../context/CalendarEventContext';

function useCalendarEvent(id) {
  const { events, hovered, handleMouseEnter, handleMouseLeave } = useCalendarEvents();
  const event = events.find(event => event.id === id);

  const bind = {
    onMouseEnter: () => handleMouseEnter(id),
    onMouseLeave: () => handleMouseLeave(id),
  };

  const isHovered = hovered === id;

  return { event, isHovered, bind };
}

export default useCalendarEvent;
