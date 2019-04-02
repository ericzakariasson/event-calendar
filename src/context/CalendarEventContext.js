import React, { useState, useEffect, createContext, useContext } from 'react';
import { setTime } from '../date-helpers';
import { createEventMap, sortByDate } from '../helpers';

export const CalendarEventsContext = createContext();

export const CalendarEventsProvider = ({ children }) => {
  const [events, setEvents] = useState({});
  const [eventMap, setEventMap] = useState({});
  const [hovered, setHovered] = useState('');
  const [selected, setSelected] = useState('');
  const [moving, setMoving] = useState({ id: '', handle: '' });

  const eventArray = Object.keys(events)
    .map(key => events[key])
    .sort(sortByDate);

  useEffect(() => {
    const createdEventMap = createEventMap(events);
    setEventMap(createdEventMap);
  }, [events]);

  function handleMouseEnter(id) {
    // If not moving
    if (!moving.id) {
      setHovered(id);
    }
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

  function handleMouseDown(id, handle) {
    console.log('CONTEXT MOUSE DOWN');
    setMoving({ id, handle });
  }

  function handleMouseUp(id, position) {
    console.log('CONTEXT MOUSE UP');

    updateEvent(position);
    setMoving({ id: '', handle: '' });
  }

  function updateEvent(position) {
    const handle = moving.handle + 'Date';
    const affectedPosition = position[moving.handle];

    const timePosition = affectedPosition / 2;

    const hours = Math.trunc(timePosition);
    const minutes = (timePosition - hours) * 60;
    const event = events[moving.id];

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
  };

  return <CalendarEventsContext.Provider value={state}>{children}</CalendarEventsContext.Provider>;
};

export const useCalendarEvents = () => useContext(CalendarEventsContext);
