import { ICellPosition } from '../types';

export const computeShipPositions = (startPosition: ICellPosition, direction: boolean, length: number) => {
  const res: ICellPosition[] = [];

  for (let i = 0; i < length; i++) {
    const nextPos = direction
      ? { x: startPosition.x, y: startPosition.y + i }
      : { x: startPosition.x + i, y: startPosition.y };
    res.push(nextPos);
  }

  return res;
};

export const computeShipNeighboringCell = (startPosition: ICellPosition, direction: boolean, length: number) => {
  const res: ICellPosition[] = [];
  const { x, y } = startPosition;

  if (direction) {
    const topLine = y - 1;
    const leftLine = x - 1;
    const rightLine = x + 1;
    const bottomLine = y + length;
    // top
    if (topLine >= 0) {
      res.push({
        x: x,
        y: topLine,
      });

      if (leftLine >= 0) {
        res.push({
          x: leftLine,
          y: topLine,
        });
      }
      if (rightLine < 10) {
        res.push({
          x: rightLine,
          y: topLine,
        });
      }
    }

    // bottom
    if (bottomLine < 10) {
      res.push({
        x: x,
        y: bottomLine,
      });

      if (leftLine >= 0) {
        res.push({
          x: leftLine,
          y: bottomLine,
        });
      }
      if (rightLine < 10) {
        res.push({
          x: rightLine,
          y: bottomLine,
        });
      }
    }

    // left
    if (leftLine >= 0) {
      for (let i = 0; i < length; i++) {
        res.push({
          x: leftLine,
          y: y + i,
        });
      }
    }

    // right
    if (rightLine < 10) {
      for (let i = 0; i < length; i++) {
        res.push({
          x: rightLine,
          y: y + i,
        });
      }
    }
  } else {
    const topLine = y - 1;
    const leftLine = x - 1;
    const rightLine = x + length;
    const bottomLine = y + 1;
    // left
    if (leftLine >= 0) {
      res.push({
        x: leftLine,
        y: y,
      });

      if (topLine >= 0) {
        res.push({
          x: leftLine,
          y: topLine,
        });
      }
      if (bottomLine < 10) {
        res.push({
          x: leftLine,
          y: bottomLine,
        });
      }
    }

    // right
    if (rightLine < 10) {
      res.push({
        x: rightLine,
        y: y,
      });

      if (topLine >= 0) {
        res.push({
          x: rightLine,
          y: topLine,
        });
      }
      if (bottomLine < 10) {
        res.push({
          x: rightLine,
          y: bottomLine,
        });
      }
    }

    // top
    if (topLine >= 0) {
      for (let i = 0; i < length; i++) {
        res.push({
          x: x + i,
          y: topLine,
        });
      }
    }

    // bottom
    if (bottomLine < 10) {
      for (let i = 0; i < length; i++) {
        res.push({
          x: x + i,
          y: bottomLine,
        });
      }
    }
  }
  return res;
};
