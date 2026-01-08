// A* Pathfinding Step Generator
// Generates AlgoStep[] for visualization

class PriorityQueue {
  constructor() {
    this.items = [];
  }

  enqueue(element, priority) {
    this.items.push({ element, priority });
    this.items.sort((a, b) => a.priority - b.priority);
  }

  dequeue() {
    return this.items.shift();
  }

  isEmpty() {
    return this.items.length === 0;
  }
}

function generateAStarSteps(grid, start, end) {
  const steps = [];
  const rows = grid.length;
  const cols = grid[0].length;

  // Directions: up, down, left, right
  const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];

  // Heuristic function (Manhattan distance)
  function heuristic(a, b) {
    return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
  }

  // Initialize
  const openSet = new PriorityQueue();
  const cameFrom = new Map();
  const gScore = Array(rows).fill().map(() => Array(cols).fill(Infinity));
  const fScore = Array(rows).fill().map(() => Array(cols).fill(Infinity));

  gScore[start[0]][start[1]] = 0;
  fScore[start[0]][start[1]] = heuristic(start, end);

  openSet.enqueue(start, fScore[start[0]][start[1]]);

  steps.push({
    index: steps.length,
    type: 'init',
    state: {
      grid: grid.map(row => [...row]),
      start,
      end,
      openSet: [start],
      closedSet: [],
      current: null,
      path: [],
    },
    description: 'Initializing A* search',
  });

  while (!openSet.isEmpty()) {
    const current = openSet.dequeue().element;
    const [x, y] = current;

    if (x === end[0] && y === end[1]) {
      // Reconstruct path
      const path = [];
      let temp = current;
      while (temp) {
        path.unshift(temp);
        temp = cameFrom.get(temp.toString());
      }

      steps.push({
        index: steps.length,
        type: 'path_found',
        state: {
          grid: grid.map(row => [...row]),
          start,
          end,
          openSet: [],
          closedSet: Array.from(cameFrom.keys()).map(k => k.split(',').map(Number)),
          current,
          path,
        },
        description: 'Path found!',
      });
      break;
    }

    // Add to closed set
    cameFrom.set(current.toString(), cameFrom.get(current.toString()));

    steps.push({
      index: steps.length,
      type: 'visit',
      state: {
        grid: grid.map(row => [...row]),
        start,
        end,
        openSet: openSet.items.map(item => item.element),
        closedSet: Array.from(cameFrom.keys()).map(k => k.split(',').map(Number)),
        current,
        path: [],
      },
      description: `Visiting node (${x}, ${y})`,
    });

    for (const [dx, dy] of directions) {
      const neighbor = [x + dx, y + dy];

      if (neighbor[0] < 0 || neighbor[0] >= rows || neighbor[1] < 0 || neighbor[1] >= cols) continue;
      if (grid[neighbor[0]][neighbor[1]] === 1) continue; // Wall

      const tentativeGScore = gScore[x][y] + 1;

      if (tentativeGScore < gScore[neighbor[0]][neighbor[1]]) {
        cameFrom.set(neighbor.toString(), current);
        gScore[neighbor[0]][neighbor[1]] = tentativeGScore;
        fScore[neighbor[0]][neighbor[1]] = tentativeGScore + heuristic(neighbor, end);

        if (!openSet.items.some(item => item.element[0] === neighbor[0] && item.element[1] === neighbor[1])) {
          openSet.enqueue(neighbor, fScore[neighbor[0]][neighbor[1]]);
        }

        steps.push({
          index: steps.length,
          type: 'update_neighbor',
          state: {
            grid: grid.map(row => [...row]),
            start,
            end,
            openSet: openSet.items.map(item => item.element),
            closedSet: Array.from(cameFrom.keys()).map(k => k.split(',').map(Number)),
            current,
            neighbor,
            g: tentativeGScore,
            h: heuristic(neighbor, end),
            f: fScore[neighbor[0]][neighbor[1]],
          },
          description: `Updating neighbor (${neighbor[0]}, ${neighbor[1]}) with g=${tentativeGScore}, h=${heuristic(neighbor, end)}, f=${fScore[neighbor[0]][neighbor[1]]}`,
        });
      }
    }
  }

  if (!cameFrom.has(end.toString())) {
    steps.push({
      index: steps.length,
      type: 'no_path',
      state: {
        grid: grid.map(row => [...row]),
        start,
        end,
        openSet: [],
        closedSet: Array.from(cameFrom.keys()).map(k => k.split(',').map(Number)),
        current: null,
        path: [],
      },
      description: 'No path found',
    });
  }

  return steps;
}

module.exports = { generateAStarSteps };