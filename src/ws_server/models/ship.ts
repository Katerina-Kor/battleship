import { ICellPosition, IShipData } from '../types';
import { computeShipNeighboringCell, computeShipPositions } from '../utils';

export class Ship {
  private type: string;
  private positions: ICellPosition[];
  private neighboringCells: ICellPosition[];
  private length: number;
  private isAlive: boolean = true;

  constructor(shipData: IShipData, positions?: ICellPosition[], neighboringCells?: ICellPosition[]) {
    this.type = shipData.type;
    this.positions = positions
      ? positions
      : computeShipPositions(shipData.position, shipData.direction, shipData.length);
    this.neighboringCells = neighboringCells
      ? neighboringCells
      : computeShipNeighboringCell(shipData.position, shipData.direction, shipData.length);
    this.length = shipData.length;
  }

  public getPositions = () => this.positions;

  public getType = () => this.type;

  public getLength = () => this.length;

  public getIsAlive = () => this.isAlive;

  public decreaseLength = () => {
    this.length = this.length - 1;
    if (this.length === 0) {
      this.isAlive = false;
    }
  };

  public getShipNeighboringCells = () => {
    return this.neighboringCells;
  };
}
