import { computeShipNeighboringCell } from './shipsHelpers';
import { IShipData } from '../types';

export interface IRandomGameCeil {
  x: number;
  y: number;
  empty: boolean;
}

export interface ICellPosition {
  x: number;
  y: number;
}

const getEmptyGameField = () => {
  const ceils: IRandomGameCeil[] = [];

  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      ceils.push({
        x: i,
        y: j,
        empty: true,
      });
    }
  }
  return ceils;
};

const botField = getEmptyGameField();

const getRandomCell = (): ICellPosition => {
  const freeCells = botField.filter((cell) => cell.empty === true);
  const randomCellIndex = Math.round(Math.random() * freeCells.length - 1);
  const cell = botField[randomCellIndex];
  return {
    x: cell.x,
    y: cell.y,
  };
};

const getRandomDirection = (): boolean => {
  return Math.random() > 0.5 ? true : false;
};

const getShipType = (num: number) => {
  let type: 'small' | 'medium' | 'large' | 'huge';

  if (num === 4) {
    type = 'huge';
  } else if (num === 3) {
    type = 'large';
  } else if (num === 2) {
    type = 'medium';
  } else {
    type = 'small';
  }

  return type;
};

export const getRandomShips = () => {
  // index = ship quantity, number - deck quantity
  const shipsInitialData = [0, 4, 3, 2, 1];
  const ships: IShipData[] = [];

  shipsInitialData.forEach((data, index) => {
    let shipsQuantity = index;

    outer: while (shipsQuantity) {
      const cells: ICellPosition[] = [];
      const cell = getRandomCell();
      const direction = getRandomDirection();
      cells.push(cell);
      let isValid: boolean = true;

      for (let i = 1; i < data; i++) {
        const nextCell = direction ? { x: cell.x, y: cell.y + i } : { x: cell.x + i, y: cell.y };
        if (nextCell.x > 9 || nextCell.y > 9) {
          isValid = false;
          continue outer;
        }
        const index = nextCell.x * 10 + nextCell.y;
        if (botField[index].empty === false) {
          isValid = false;
          continue outer;
        }
        cells.push(nextCell);
      }

      const otherCells: ICellPosition[] = computeShipNeighboringCell({ x: cell.x, y: cell.y }, direction, data);

      if (isValid === true) {
        cells.forEach((cell) => (botField[cell.x * 10 + cell.y].empty = false));
        otherCells.forEach((cell) => (botField[cell.x * 10 + cell.y].empty = false));
        ships.push({
          position: cells[0],
          direction,
          type: getShipType(data),
          length: data,
        });
        shipsQuantity--;
      }
    }
  });
  return ships;
};
