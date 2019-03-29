import React from 'react';
import styled, { createGlobalStyle, ThemeProvider } from 'styled-components';

import { theme } from '../theme';

import { CalendarEventsProvider } from '../context/CalendarEventContext';

import Calendar from './Calendar';

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css?family=Rubik:400,500,700');

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html, body {
    min-height: 100%;
  }

  body {
    background: #FCFCFC;
    font-family: 'Rubik',-apple-system, 'Helvetica Neue', sans-serif;
    font-size: 16px;
  }

  #root {
    height: 100%;
    padding: 40px;
  }
`;

const Wrapper = styled.div`
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  background: #fff;
  border-radius: 5px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.04);

  display: flex;
  flex-direction: column;
`;

const Footer = styled.footer`
  padding: 1rem;
  text-align: center;
`;

const App = () => {
  return (
    <CalendarEventsProvider>
      <ThemeProvider theme={theme}>
        <Wrapper>
          <Calendar />
          <Footer />
          <GlobalStyle />
        </Wrapper>
      </ThemeProvider>
    </CalendarEventsProvider>
  );
};

export default App;
