export function Bfs(grid, startNode, finishNode) {
  const visitedNodesInOrder = [];
  const queue = [];

  startNode.isVisited = true;
  queue.push(startNode);

  while (queue.length > 0) {
    const currentNode = queue.shift();
    visitedNodesInOrder.push(currentNode);

    if (currentNode === finishNode) {
      return visitedNodesInOrder;
    }

    const { row, col } = currentNode;

    // Up
    if (row > 0) {
      const node = grid[row - 1][col];
      if (!node.isVisited && !node.isWall) {
        node.isVisited = true;
        node.previousNode = currentNode;
        queue.push(node);
      }
    }

    // Down
    if (row < grid.length - 1) {
      const node = grid[row + 1][col];
      if (!node.isVisited && !node.isWall) {
        node.isVisited = true;
        node.previousNode = currentNode;
        queue.push(node);
      }
    }

    // Left
    if (col > 0) {
      const node = grid[row][col - 1];
      if (!node.isVisited && !node.isWall) {
        node.isVisited = true;
        node.previousNode = currentNode;
        queue.push(node);
      }
    }

    // Right
    if (col < grid[0].length - 1) {
      const node = grid[row][col + 1];
      if (!node.isVisited && !node.isWall) {
        node.isVisited = true;
        node.previousNode = currentNode;
        queue.push(node);
      }
    }
  }

  return visitedNodesInOrder;
}
