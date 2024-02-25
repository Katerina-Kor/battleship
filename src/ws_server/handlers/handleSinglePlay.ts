export interface IRandomGameCeil {
  x: number,
  y: number,
  empty: boolean
};

export interface IRandomPos {
  x: number,
  y: number,
  position?: boolean
};

const getEmptyGameField = () => {
  const ceils: IRandomGameCeil[] = [];

  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      ceils.push({
        x: i,
        y: j,
        empty: true
      })
    }
  };
  return ceils;
};

const botField = getEmptyGameField();

const getRandomPosition = (): IRandomPos => {
  const freeCells = botField.filter((cell) => cell.empty === true);
  const randomCellIndex = Math.round(Math.random() * freeCells.length - 1);
  const cell = freeCells[randomCellIndex];
  const randomPosition = Math.random() > 0.5 ? true: false;
  return {
    x: cell.x,
    y: cell.y,
    position: randomPosition
  }
};

const randomShips = () => {
  // index = кол-во, number - число палуб
  const shipsInitialData = [0, 4, 3, 2, 1];
  const ships: IRandomPos[][] = [];

  shipsInitialData.forEach((data, index) => {
    let shipsQuantity = index;

    outer: while (shipsQuantity) {
      console.log('quantity', shipsQuantity, data, index);
      const cells: IRandomPos[] = [];
      const nearCells = [];
      const cell = getRandomPosition();
      cells.push(cell);
      let isValid: boolean = true;
      console.log('initial pos', cell);

      for (let i = 1; i < data; i++) {
        const nextCell = cell.position ? {x: cell.x, y: cell.y + i} : {x: cell.x + i, y: cell.y};
        if (nextCell.x > 9 || nextCell.y > 9) {
          console.log('ping', nextCell)
          isValid = false;
          continue outer;
        };
        const index = nextCell.x * 10 +  nextCell.y;
        if (botField[index].empty === false) {
          isValid = false;
          continue outer;
        };
        cells.push(nextCell);
      };

      const otherCells: IRandomPos[] = computeShipNeighboringCell({x: cell.x, y: cell.y}, cell.position as boolean, data);
      console.log('other cells', otherCells);

      if (isValid === true) {
        cells.forEach(cell => botField[cell.x * 10 + cell.y].empty = false);
        otherCells.forEach(cell => botField[cell.x * 10 + cell.y].empty = false);
        ships.push(cells);
        shipsQuantity--;
      }
    }
  });
  console.log('END', ships);
};

const computeShipNeighboringCell = (startPosition: IRandomPos, direction: boolean, length: number) => {
  const res: IRandomPos[] = [];
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
        y: topLine
      });

      if (leftLine >= 0) {
        res.push({
          x: leftLine,
          y: topLine
        });
      };
      if (rightLine < 10) {
        res.push({
          x: rightLine,
          y: topLine
        });
      };
    };

    // bottom
    if (bottomLine < 10) {
      res.push({
        x: x,
        y: bottomLine
      });

      if (leftLine >= 0) {
        res.push({
          x: leftLine,
          y: bottomLine
        });
      };
      if (rightLine < 10) {
        res.push({
          x: rightLine,
          y: bottomLine
        });
      };
    };

    // left
    if (leftLine >= 0) {
      for (let i = 0; i < length; i++) {
        res.push({
          x: leftLine,
          y: y + i
        });
      }
    };

    // right
    if (rightLine < 10) {
      for (let i = 0; i < length; i++) {
        res.push({
          x: rightLine,
          y: y + i
        });
      }
    };

  } else {
    const topLine = y - 1;
    const leftLine = x - 1;
    const rightLine = x + length;
    const bottomLine = y + 1; 
    // left
    if (leftLine >= 0) {
      res.push({
        x: leftLine,
        y: y
      });

      if (topLine >= 0) {
        res.push({
          x: leftLine,
          y: topLine
        });
      };
      if (bottomLine < 10) {
        res.push({
          x: leftLine,
          y: bottomLine
        });
      };
    };

    // right
    if (rightLine < 10) {
      res.push({
        x: rightLine,
        y: y
      });

      if (topLine >= 0) {
        res.push({
          x: rightLine,
          y: topLine
        });
      };
      if (bottomLine < 10) {
        res.push({
          x: rightLine,
          y: bottomLine
        });
      };
    };

    // top
    if (topLine >= 0) {
      for (let i = 0; i < length; i++) {
        res.push({
          x: x + i,
          y: topLine
        });
      }
    };

    // bottom
    if (bottomLine < 10) {
      for (let i = 0; i < length; i++) {
        res.push({
          x: x + i,
          y: bottomLine
        });
      }
    };
  }
  return res;
};

randomShips();
