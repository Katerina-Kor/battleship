import { Ship } from './ship';
import { IGamePlayer, IShipData } from "../types";
import { getRandomTurn } from "../utils";
import { BotUser } from './user';

let allowId: number = 0;

export class Game {
  private _id: number;
  private players: IGamePlayer[];
  private _isReady: boolean = false;
  private _turn: 0 | 1;

  constructor(players: IGamePlayer[], turn?: 0 | 1) {
    this.id = allowId;
    allowId++;
    this.players = players;
    this.turn = turn !== undefined ? turn : getRandomTurn();
  };

  public get id() {
    return this._id;
  };

  private set id(value: number) {
    this._id = value;
  };

  public get turn() {
    return this._turn;
  };

  private set turn(value: 0 | 1) {
    this._turn = value;
  };

  public get isReady() {
    return this._isReady;
  };

  private set isReady(value: boolean) {
    this._isReady = value;
  };

  public changeTurnToNext = () => {
    if (this.turn === 0) {
      this.turn = 1;
    } else {
      this.turn = 0;
    }
  };

  public getPlayerById = (playerId: 0 | 1) => this.players[playerId];

  public setPlayerShips = (playerId: 0 | 1, shipsData: IShipData[]) => {
    const ships: Ship[] = [];
    shipsData.forEach((ship: IShipData) => {
      const shipInstance = new Ship(ship);
      ships.push(shipInstance);
    })
    this.players[playerId].ships = ships;
    this.players[playerId].shipsData = shipsData;

    if (this.players.every((player) => player.ships)) {
      this.isReady = true;
    };
  };

  public getPlayers = () => {
    return this.players[1] instanceof BotUser ? this.players.slice(0, 1) : this.players;
  };

  public getPlayerShipsData = (playerId: 0  | 1) => {
    return this.players[playerId].shipsData;
  };

};
