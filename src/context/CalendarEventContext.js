import React, { useState, useEffect, createContext, useContext } from 'react';
import { createEventMap } from '../helpers';

export const CalendarEventsContext = createContext();

export const CalendarEventsProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [eventMap, setEventMap] = useState({});
  const [hovered, setHovered] = useState('');

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

  const state = {
    events,
    eventMap,
    setEvents,
    hovered,
    handleMouseEnter,
    handleMouseLeave,
  };

  return <CalendarEventsContext.Provider value={state}>{children}</CalendarEventsContext.Provider>;
};

export const useCalendarEvents = () => useContext(CalendarEventsContext);
