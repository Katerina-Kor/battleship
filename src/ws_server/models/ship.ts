import { ICeilPosition, IShipPosition } from "../types";


export class Ship {
  private type: string;
  private positions: ICeilPosition[];
  private length: number;
  private isAlive: boolean = true;

  constructor(shipData: IShipPosition) {
    this.type = shipData.type;
    this.positions = this.computeShipPositions(shipData.position, shipData.direction, shipData.length);
    this.length = shipData.length
  }

  public getPositions = () => this.positions

  public getType = () => this.type

  public getLength = () => this.length

  public getIsAlive = () => this.isAlive

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
  }
}