// Returns all nodes in the order in which they were visited.
// Each node stores previousNode so we can reconstruct the shortest path.

export function Dijkstra(grid, startNode, finishNode) {
  const visitedNodesInOrder = [];

  startNode.distance = 0;
  const unvisitedNodes = getAllNodes(grid);

  while (unvisitedNodes.length > 0) {
    sortNodesByDistance(unvisitedNodes);

    const closestNode = unvisitedNodes.shift();

    // Skip walls
    if (closestNode.isWall) continue;

    // If the closest node is unreachable, stop
    if (closestNode.distance === Infinity) {
      return visitedNodesInOrder;
    }

    closestNode.isVisited = true;
    visitedNodesInOrder.push(closestNode);

    // Stop when finish node is reached
    if (closestNode === finishNode) {
      return visitedNodesInOrder;
    }

    updateUnvisitedNeighbors(closestNode, grid);
  }

  return visitedNodesInOrder;
}
