import { useCalendarEvents } from '../context/CalendarEventContext';

function useCalendarEvent(id) {
  const {
    events,
    hovered,
    selected,
    handleMouseEnter,
    handleMouseLeave,
    handleSelect,
    handleDeselect,
  } = useCalendarEvents();
  const event = events.find(event => event.id === id);

  const isHovered = hovered === id;
  const isSelected = selected === id;

  const bind = {
    onMouseEnter: () => handleMouseEnter(id),
    onMouseLeave: () => handleMouseLeave(id),
    onClick: () => (isSelected ? handleDeselect() : handleSelect(id)),
  };

  return { event, isHovered, isSelected, handleDeselect, bind };
}

export default useCalendarEvent;
