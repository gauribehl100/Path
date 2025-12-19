import React, { useState, useEffect } from 'react';
import Node from '../pathfind/node/Node';
import { Dijkstra } from '../algorithms/Dijkstra';
import { Bfs } from '../algorithms/Bfs';
import { Dfs } from '../algorithms/Dfs';
import './Pathfinding.css';

export default function Pathfinding() {

  const ROWS = 25;
  const COLS = 35;

  const [grid, setGrid] = useState([]);
  const [mouseDown, setMouseDown] = useState(false);
  const [mode, setMode] = useState(null); // 'start' | 'finish' | 'wall'
  const [running, setRunning] = useState(false);

  const [start, setStart] = useState({ row: 5, col: 5 });
  const [finish, setFinish] = useState({ row: 5, col: 15 });

  /* ---------- INIT GRID ---------- */

  useEffect(() => {
    setGrid(buildGrid(start, finish));
  }, []);

  function buildGrid(start, finish) {
    const g = [];
    for (let r = 0; r < ROWS; r++) {
      const row = [];
      for (let c = 0; c < COLS; c++) {
        row.push({
          row: r,
          col: c,
          isStart: r === start.row && c === start.col,
          isFinish: r === finish.row && c === finish.col,
          isWall: false,
          isVisited: false,
          distance: Infinity,
          previousNode: null,
        });
      }
      g.push(row);
    }
    return g;
  }

  /* ---------- MOUSE EVENTS ---------- */

  function onDown(row, col) {
    if (running) return;

    const node = grid[row][col];
    setMouseDown(true);

    if (node.isStart) setMode('start');
    else if (node.isFinish) setMode('finish');
    else {
      setMode('wall');
      toggleWall(row, col);
    }
  }

  function onEnter(row, col) {
    if (!mouseDown || running) return;

    if (mode === 'wall') toggleWall(row, col);

    if (mode === 'start') moveStart(row, col);

    if (mode === 'finish') moveFinish(row, col);
  }

  function onUp() {
    setMouseDown(false);
    setMode(null);
  }

  /* ---------- GRID UPDATES ---------- */

  function toggleWall(row, col) {
    setGrid(g =>
      g.map(r =>
        r.map(n =>
          n.row === row && n.col === col && !n.isStart && !n.isFinish
            ? { ...n, isWall: !n.isWall }
            : n
        )
      )
    );
  }

  function moveStart(row, col) {
    setGrid(g =>
      g.map(r =>
        r.map(n => ({
          ...n,
          isStart: n.row === row && n.col === col,
        }))
      )
    );
    setStart({ row, col });
  }

  function moveFinish(row, col) {
    setGrid(g =>
      g.map(r =>
        r.map(n => ({
          ...n,
          isFinish: n.row === row && n.col === col,
        }))
      )
    );
    setFinish({ row, col });
  }

  /* ---------- CLEAR ---------- */

  function clearGrid() {
    if (!running) setGrid(buildGrid(start, finish));
  }

  function clearWalls() {
    if (running) return;
    setGrid(g => g.map(r => r.map(n => ({ ...n, isWall: false }))));
  }

  /* ---------- VISUALIZATION ---------- */

  function visualize(type) {
    if (running) return;
    setRunning(true);

    const startNode = grid[start.row][start.col];
    const finishNode = grid[finish.row][finish.col];

    let visited;
    if (type === 'Dijkstra') visited = Dijkstra(grid, startNode, finishNode);
    if (type === 'BFS') visited = Bfs(grid, startNode, finishNode);
    if (type === 'DFS') visited = Dfs(grid, startNode, finishNode);

    const path = buildPath(finishNode);
    animate(visited, path);
  }

  function animate(visited, path) {
    visited.forEach((node, i) => {
      setTimeout(() => {
        setGrid(g =>
          g.map(r =>
            r.map(n =>
              n.row === node.row && n.col === node.col
                ? { ...n, isVisited: true }
                : n
            )
          )
        );
      }, i * 10);
    });

    setTimeout(() => {
      path.forEach((node, i) => {
        setTimeout(() => {
          setGrid(g =>
            g.map(r =>
              r.map(n =>
                n.row === node.row && n.col === node.col
                  ? { ...n, isPath: true }
                  : n
              )
            )
          );
          if (i === path.length - 1) setRunning(false);
        }, i * 40);
      });
    }, visited.length * 10);
  }

  function buildPath(end) {
    const path = [];
    let cur = end;
    while (cur) {
      path.unshift(cur);
      cur = cur.previousNode;
    }
    return path;
  }

  /* ---------- RENDER ---------- */

  return (
    <div>
      <table className="grid-container" onMouseLeave={onUp}>
        <tbody className="grid">
          {grid.map((row, r) => (
            <tr key={r}>
              {row.map((node, c) => (
                <Node
                  key={`${r}-${c}`}
                  {...node}
                  onMouseDown={() => onDown(node.row, node.col)}
                  onMouseEnter={() => onEnter(node.row, node.col)}
                  onMouseUp={onUp}
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
