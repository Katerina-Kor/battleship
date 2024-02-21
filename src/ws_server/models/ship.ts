import { ICeilPosition, IShipData } from "../types";


export class Ship {
  private type: string;
  private positions: ICeilPosition[];
  private neighboringCells: ICeilPosition[];
  private length: number;
  private isAlive: boolean = true;

  constructor(shipData: IShipData) {
    this.type = shipData.type;
    this.positions = this.computeShipPositions(shipData.position, shipData.direction, shipData.length);
    this.neighboringCells = this.computeShipNeighboringCell(shipData.position, shipData.direction, shipData.length);
    this.length = shipData.length
  }

  public getPositions = () => this.positions

  public getType = () => this.type

  public getLength = () => this.length

  public getIsAlive = () => this.isAlive

  public decreaseLength = () => {
    this.length = this.length - 1;
    if (this.length === 0) {
      this.isAlive = false;
    }
  };

  public getShipNeighboringCells = () => {
    return this.neighboringCells;
  }

  private computeShipPositions(startPosition: ICeilPosition, direction: boolean, length: number) {
    const res: ICeilPosition[] = [];
    res.push(startPosition);

    if (length > 1) {
      for (let i = 1; i < length; i++) {
        const nextPos = direction ? {x: startPosition.x, y: startPosition.y + i} : {x: startPosition.x + i, y: startPosition.y};
        res.push(nextPos);
      }
    }

    return res;
  };

  private computeShipNeighboringCell(startPosition: ICeilPosition, direction: boolean, length: number) {
    const res: ICeilPosition[] = [];
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
}