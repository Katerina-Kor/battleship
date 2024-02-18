import { WebSocket } from "ws";
import { User } from "./user";
import { IShipPosition } from "../types";
import { Room } from "./room";

let allowId: number = 0;

export class Game {
  private id: number;
  private player1: {
    user: User,
    shipsPosition: IShipPosition[] | null
  };
  private player2: {
    user: User,
    shipsPosition: IShipPosition[] | null
  };
  private isReady: boolean = false;
  private turn: number;

  constructor(room: Room) {
    this.id = allowId;
    allowId++;
    this.player1 = {
      user: room.getPlayer1() as User,
      shipsPosition: null
    };
    this.player2 = {
      user: room.getPlayer2() as User,
      shipsPosition: null
    };
    this.turn = this.getPlayer1().user.getId();
  };

  public getPlayer1 = () => this.player1;

  public getPlayer2 = () => this.player2;

  public getPlayerById = (id: number) => this.player1.user.getId() === id ? this.player1 : this.player2

  public getId = () => this.id;

  public checkIsReady = () => {
    if (this.player1.shipsPosition && this.player2.shipsPosition) {
      this.isReady = true;
    };

    return this.isReady
  };

  public getNextTurn = () => {
    return this.turn;
  }

  public getIsReady = () => this.isReady;

  public setReady = () => this.isReady = true;

  public setPlayer1ShipsPosition = (positions: IShipPosition[]) => this.player1.shipsPosition = positions;

  public setPlayer2ShipsPosition = (positions: IShipPosition[]) => this.player2.shipsPosition = positions;
}