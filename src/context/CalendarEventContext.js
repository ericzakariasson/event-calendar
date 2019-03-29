import React, { useState, useEffect, createContext, useContext } from 'react';
import { createEventMap } from '../helpers';

export const CalendarEventsContext = createContext();

export const CalendarEventsProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [eventMap, setEventMap] = useState({});
  const [hovered, setHovered] = useState('');
  const [selected, setSelected] = useState('');

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

  const state = {
    events,
    eventMap,
    setEvents,
    hovered,
    selected,
    handleMouseEnter,
    handleMouseLeave,
    handleSelect,
    handleDeselect,
  };

  return <CalendarEventsContext.Provider value={state}>{children}</CalendarEventsContext.Provider>;
};

export const useCalendarEvents = () => useContext(CalendarEventsContext);
