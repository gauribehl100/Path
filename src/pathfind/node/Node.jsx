import React from 'react';
import './Node.css';

export default function Node({
  row,
  col,
  isStart,
  isFinish,
  isWall,
  onMouseDown,
  onMouseEnter,
  onMouseUp,
}) {
  let extraClassName = '';

  if (isFinish) extraClassName = 'node-finish';
  else if (isStart) extraClassName = 'node-start';
  else if (isWall) extraClassName = 'node-wall';

  return (
    <td
      id={`node-${row}-${col}`}
      className={`node ${extraClassName}`}
      onMouseDown={() => onMouseDown(row, col)}
      onMouseEnter={() => onMouseEnter(row, col)}
      onMouseUp={onMouseUp}
    />
  );
}
