import { IGameCeil } from '../types';

export const getRandomTurn = () => {
  return Math.random() > 0.5 ? 1 : 0;
};

export const getEmptyGameField = () => {
  const ceils: IGameCeil[] = [];

  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      ceils.push({
        x: i,
        y: j,
        touched: false,
      });
    }
  }
  return ceils;
};
