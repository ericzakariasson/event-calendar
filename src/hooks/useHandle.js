import { useState, useEffect } from 'react';
import { theme } from '../theme';

function useHandle(id, initialPositions, handleDrag) {
  const [startPosition, setStartPosition] = useState(0);
  const [endPosition, setEndPosition] = useState(0);

  const [activeHandle, setActiveHandle] = useState('');

  const setPosition = {
    start: setStartPosition,
    end: setEndPosition,
  };

  const position = {
    start: startPosition,
    end: endPosition,
  };

  function handleMouseDown(handle) {
    console.log('MOUSE DOWN');
    handleDrag.onMouseDown(id, handle);
    setActiveHandle(handle);
  }

  function handleMouseUp() {
    console.log('MOUSE UP');
    handleDrag.onMouseUp(id, position);
    setActiveHandle('');
  }

  function handleMouseMove(e) {
    console.log(e);
    const { pageY } = e;
    const exactPosition = (pageY - 120) / (theme.cellHeight * 2);
    const position = Math.round(exactPosition * 2);
    setPosition[activeHandle](position);
  }

  useEffect(() => {
    setStartPosition(initialPositions.start);
    setEndPosition(initialPositions.end);
  }, []);

  useEffect(() => {
    if (activeHandle) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  });

  const positions = endPosition - startPosition;

  const height = theme.cellHeight * positions;
  const top = theme.cellHeight * startPosition;

  const style = {
    height,
    top,
  };

  const hasStart = startPosition !== 0;
  const hasEnd = endPosition !== 48;

  const isSmall = height < 3 * theme.cellHeight;

  const isDragging = activeHandle !== '';

  return {
    style,
    startPosition,
    endPosition,
    handleMouseDown,
    hasStart,
    hasEnd,
    isSmall,
    isDragging,
  };
}

export default useHandle;
