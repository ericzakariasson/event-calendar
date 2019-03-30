import React, { useState, useEffect, createContext, useContext } from 'react';
import { createEventMap, setTime } from '../helpers';
import { theme } from '../theme';

export const CalendarEventsContext = createContext();

export const CalendarEventsProvider = ({ children }) => {
  const [events, setEvents] = useState({});
  const [eventMap, setEventMap] = useState({});
  const [hovered, setHovered] = useState('');
  const [selected, setSelected] = useState('');
  const [moving, setMoving] = useState({ id: '', handle: '' });

  const eventArray = Object.keys(events).map(key => events[key]);

  useEffect(() => {
    const createdEventMap = createEventMap(events);
    setEventMap(createdEventMap);
  }, [events]);

  function handleMouseEnter(id) {
    setHovered(id);
  }

  function handleMouseLeave() {
    setHovered('');
  }

  function handleSelect(id) {
    setSelected(id);
  }

  function handleDeselect() {
    setSelected('');
  }

  function handleMouseDown(id, handle, e) {
    setMoving({ id, handle });
  }

  function handleMouseUp(id, handle, e) {
    setMoving({ id: '', handle: '' });
  }

  function handleMouseMove(e) {
    const { offsetY } = e;

    const exactPosition = offsetY / (theme.cellHeight * 2);
    const position = Math.round(exactPosition * 2) / 2; // To half hour
    const hours = Math.trunc(position);
    const minutes = (position - hours) * 60;

    const event = events[moving.id];

    const handle = moving.handle + 'Date';
    const newDate = setTime(event[handle], { hours, minutes });

    const updatedEvent = {
      ...event,
      [handle]: newDate,
    };

    const updatedEvents = {
      ...events,
      [event.id]: updatedEvent,
    };

    setEvents(updatedEvents);
  }

  const state = {
    events,
    eventArray,
    eventMap,
    setEvents,
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
  };

  return <CalendarEventsContext.Provider value={state}>{children}</CalendarEventsContext.Provider>;
};

export const useCalendarEvents = () => useContext(CalendarEventsContext);
