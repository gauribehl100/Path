export function Dfs(grid, startNode, finishNode) {
  const visitedNodesInOrder = [];
  const stack = [];

  stack.push(startNode);

  while (stack.length > 0) {
    const currentNode = stack.pop();

    if (currentNode.isVisited || currentNode.isWall) continue;

    currentNode.isVisited = true;
    visitedNodesInOrder.push(currentNode);

    if (currentNode === finishNode) {
      return visitedNodesInOrder;
    }

    const { row, col } = currentNode;

    // Push neighbors (order matters for visualization)
    if (col < grid[0].length - 1) {
      const node = grid[row][col + 1];
      if (!node.isVisited) {
        node.previousNode = currentNode;
        stack.push(node);
      }
    }

    if (col > 0) {
      const node = grid[row][col - 1];
      if (!node.isVisited) {
        node.previousNode = currentNode;
        stack.push(node);
      }
    }

    if (row < grid.length - 1) {
      const node = grid[row + 1][col];
      if (!node.isVisited) {
        node.previousNode = currentNode;
        stack.push(node);
      }
    }

    if (row > 0) {
      const node = grid[row - 1][col];
      if (!node.isVisited) {
        node.previousNode = currentNode;
        stack.push(node);
      }
    }
  }

  return visitedNodesInOrder;
}
