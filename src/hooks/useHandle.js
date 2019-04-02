import { useState, useEffect } from 'react';
import { theme } from '../theme';
import { positionToTimeString } from '../helpers';

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
    handleDrag.onMouseDown(id, handle);
    setActiveHandle(handle);
  }

  function handleMouseUp() {
    handleDrag.onMouseUp(id, position);
    setActiveHandle('');
  }

  function handleMouseMove(e) {
    const { offsetY } = e;
    console.log(e);
    const exactPosition = offsetY / (theme.cellHeight * 2);
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

  const isSmall = height <= 4 * theme.cellHeight;

  const isDragging = activeHandle !== '';

  const start = {
    position: startPosition,
    time: positionToTimeString(startPosition),
  };

  const end = {
    position: endPosition,
    time: positionToTimeString(endPosition),
  };

  return {
    style,
    start,
    end,
    handleMouseDown,
    hasStart,
    hasEnd,
    isSmall,
    isDragging,
  };
}

export default useHandle;
