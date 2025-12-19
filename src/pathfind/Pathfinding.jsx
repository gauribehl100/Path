import React, { useState, useEffect } from 'react';
import Node from '../pathfind/node/Node';
import { Dijkstra } from '../algorithms/Dijkstra';
import { Dfs } from '../algorithms/Dfs';
import { Bfs } from '../algorithms/Bfs';
import './Pathfinding.css';

export default function Pathfinding() {

  const [grid, setGrid] = useState([]);
  const [mouseIsPressed, setMouseIsPressed] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  const [isStartNode, setIsStartNode] = useState(false);
  const [isFinishNode, setIsFinishNode] = useState(false);
  const [isWallNode, setIsWallNode] = useState(false);

  const [currRow, setCurrRow] = useState(0);
  const [currCol, setCurrCol] = useState(0);

  const [START_NODE_ROW, setStartRow] = useState(5);
  const [START_NODE_COL, setStartCol] = useState(5);
  const [FINISH_NODE_ROW, setFinishRow] = useState(5);
  const [FINISH_NODE_COL, setFinishCol] = useState(15);

  const ROW_COUNT = 25;
  const COLUMN_COUNT = 35;

  /*  INIT GRID */

  useEffect(() => {
    setGrid(createGrid());
  }, []);

  function createGrid() {
    const grid = [];
    for (let row = 0; row < ROW_COUNT; row++) {
      const currentRow = [];
      for (let col = 0; col < COLUMN_COUNT; col++) {
        currentRow.push(createNode(row, col));
      }
      grid.push(currentRow);
    }
    return grid;
  }

  function createNode(row, col) {
    return {
      row,
      col,
      isStart: row === START_NODE_ROW && col === START_NODE_COL,
      isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
      distance: Infinity,
      isVisited: false,
      isWall: false,
      previousNode: null,
      isNode: true,
    };
  }

  /*  MOUSE EVENTS  */

  function mouseDown(row, col) {
    if (isRunning) return;

    const className = document.getElementById(`node-${row}-${col}`).className;

    setMouseIsPressed(true);
    setCurrRow(row);
    setCurrCol(col);

    if (className === 'node node-start') {
      setIsStartNode(true);
    }
    else if (className === 'node node-finish') {
      setIsFinishNode(true);
    }
    else {
      setIsWallNode(true);
      setGrid(toggleWall(grid, row, col));
    }
  }

  function mouseEnter(row, col) {
    if (!mouseIsPressed || isRunning) return;

    const className = document.getElementById(`node-${row}-${col}`).className;

    if (isStartNode && className !== 'node node-wall') {
      document.getElementById(`node-${currRow}-${currCol}`).className = 'node';
      document.getElementById(`node-${row}-${col}`).className = 'node node-start';
      setCurrRow(row);
      setCurrCol(col);
      setStartRow(row);
      setStartCol(col);
    }

    else if (isFinishNode && className !== 'node node-wall') {
      document.getElementById(`node-${currRow}-${currCol}`).className = 'node';
      document.getElementById(`node-${row}-${col}`).className = 'node node-finish';
      setCurrRow(row);
      setCurrCol(col);
      setFinishRow(row);
      setFinishCol(col);
    }

    else if (isWallNode) {
      setGrid(toggleWall(grid, row, col));
    }
  }

  function mouseUp() {
    setMouseIsPressed(false);
    setIsStartNode(false);
    setIsFinishNode(false);
    setIsWallNode(false);
  }

  /* CLEAR */

  function clearGrid() {
    if (!isRunning) {
      setGrid(createGrid());
    }
  }

  function clearWalls() {
    if (isRunning) return;

    const newGrid = grid.map(row =>
      row.map(node => ({ ...node, isWall: false }))
    );
    setGrid(newGrid);
  }

  /*  VISUALIZING*/

  function visualize(algo) {
    if (isRunning) return;

    setIsRunning(true);

    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];

    let visited;
    if (algo === 'Dijkstra') visited = Dijkstra(grid, startNode, finishNode);
    if (algo === 'BFS') visited = Bfs(grid, startNode, finishNode);
    if (algo === 'DFS') visited = Dfs(grid, startNode, finishNode);

    const path = getPath(finishNode);
    animate(visited, path);
  }

  function animate(visited, path) {
    visited.forEach((node, i) => {
      setTimeout(() => {
        const el = document.getElementById(`node-${node.row}-${node.col}`);
        if (el && !el.className.includes('start') && !el.className.includes('finish')) {
          el.className = 'node node-visited';
        }
      }, i * 10);
    });

    setTimeout(() => {
      path.forEach((node, i) => {
        setTimeout(() => {
          const el = document.getElementById(`node-${node.row}-${node.col}`);
          if (el && !el.className.includes('start') && !el.className.includes('finish')) {
            el.className = 'node node-shortest-path';
          }
          if (i === path.length - 1) setIsRunning(false);
        }, i * 40);
      });
    }, visited.length * 10);
  }

  /*  RENDER */

  return (
    <div>
      <table className="grid-container" onMouseLeave={mouseUp}>
        <tbody className="grid">
          {grid.map((row, r) => (
            <tr key={r}>
              {row.map((node, c) => (
                <Node
                  key={`${r}-${c}`}
                  {...node}
                  onMouseDown={() => mouseDown(node.row, node.col)}
                  onMouseEnter={() => mouseEnter(node.row, node.col)}
                  onMouseUp={mouseUp}
                />
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={clearGrid}>Clear Grid</button>
      <button onClick={clearWalls}>Clear Walls</button>
      <button onClick={() => visualize('Dijkstra')}>Dijkstra</button>
      <button onClick={() => visualize('BFS')}>BFS</button>
      <button onClick={() => visualize('DFS')}>DFS</button>
    </div>
  );
}

/*  HELPERS */

function toggleWall(grid, row, col) {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  if (!node.isStart && !node.isFinish) {
    newGrid[row][col] = { ...node, isWall: !node.isWall };
  }
  return newGrid;
}

function getPath(finishNode) {
  const path = [];
  let current = finishNode;
  while (current) {
    path.unshift(current);
    current = current.previousNode;
  }
  return path;
}
