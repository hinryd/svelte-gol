import { get, writable } from "svelte/store";

export let cellSize = writable(7);

export const gptNext = (grid: boolean[][]) => {
  const newGrid: boolean[][] = [];

  for (let yIndex = 0; yIndex < grid.length; yIndex++) {
    const row: boolean[] = [];

    for (let xIndex = 0; xIndex < grid[yIndex].length; xIndex++) {
      const topLeft = grid[yIndex - 1]?.[xIndex - 1];
      const top = grid[yIndex - 1]?.[xIndex];
      const topRight = grid[yIndex - 1]?.[xIndex + 1];
      const left = grid[yIndex][xIndex - 1];
      const right = grid[yIndex][xIndex + 1];
      const bottomLeft = grid[yIndex + 1]?.[xIndex - 1];
      const bottom = grid[yIndex + 1]?.[xIndex];
      const bottomRight = grid[yIndex + 1]?.[xIndex + 1];
      const neighbours = [
        topLeft,
        top,
        topRight,
        left,
        right,
        bottomLeft,
        bottom,
        bottomRight,
      ].filter(Boolean).length;

      let newCellState = false;

      if (neighbours === 2) {
        newCellState = grid[yIndex][xIndex];
      } else if (neighbours === 3) {
        newCellState = true;
      }

      row.push(newCellState);
    }

    newGrid.push(row);
  }

  return newGrid;
};

export const betterNext = (grid: boolean[][]) => {
  let newGrid: boolean[][] = [];
  for (let yIndex = 0; yIndex < grid.length; yIndex++) {
    let row: boolean[] = [];
    for (let xIndex = 0; xIndex < grid[yIndex].length; xIndex++) {
      let topLeft = grid[yIndex - 1]?.[xIndex - 1];
      let top = grid[yIndex - 1]?.[xIndex];
      let topRight = grid[yIndex - 1]?.[xIndex + 1];
      let left = grid[yIndex][xIndex - 1];
      let right = grid[yIndex][xIndex + 1];
      let bottomLeft = grid[yIndex + 1]?.[xIndex - 1];
      let bottom = grid[yIndex + 1]?.[xIndex];
      let bottomRight = grid[yIndex + 1]?.[xIndex + 1];
      let neighbours =
        [topLeft, top, topRight, left, right, bottomLeft, bottom, bottomRight]
          .filter(Boolean).length;

      if (neighbours === 2) {
        row.push(grid[yIndex][xIndex]);
      } else if (neighbours === 3) {
        row.push(true);
      } else {
        row.push(false);
      }
    }
    newGrid.push(row);
  }
  return newGrid;
};

export const next = (grid: (0 | 1)[][]) => {
  const combinePositions = ({ y, x }): number[][] =>
    [-1, 0, 1].reduce(
      (acc, _y, _, offset) =>
        offset.reduce(
          (b, _x) => (_x || _y ? [...b, [y + _y, x + _x]] : b),
          acc,
        ),
      [],
    );
  const newKey = (size: number) => (key: number) => {
    if (key === -1) {
      return size - 1;
    }
    if (key === size) {
      return 0;
    }
    return key;
  };
  const newKeys = (size: number, keys: number[]) => keys.map(newKey(size));
  const getIn = (grid) => (position: number[]) =>
    (([y, x]) => grid[y][x])(newKeys(grid.length, position));

  return grid.map((row, y) =>
    row.map((isAlive, x) => {
      const neighbours = combinePositions({ y, x })
        .map(getIn(grid))
        .filter(Boolean).length;

      if (neighbours == 2) {
        return isAlive;
      } else if (neighbours == 3) {
        return 1;
      } else {
        return 0;
      }
    })
  );
};

export const random = () => {
  const height = window.innerHeight;
  const width = window.innerWidth;
  const size = get(cellSize);
  const gridHeight = Math.floor(height / size);
  const gridWidth = Math.floor(width / size);
  const grid = Array.from(
    { length: gridHeight },
    () => Array.from({ length: gridWidth }, () => Math.random() < 0.2),
  );
  return grid;
};

export const fps = (() => {
  const { subscribe, set, update } = writable(0);
  let times = [];
  return {
    subscribe,
    calculate: () => {
      const now = performance.now();
      while (times.length > 0 && times[0] <= now - 1000) {
        times.shift();
      }
      times.push(now);
      set(times.length);
    },
  };
})();
