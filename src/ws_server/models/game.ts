import { Ship } from './ship';
import { IGamePlayers } from "../types";
import { getRandomTurn } from "../utils";

let allowId: number = 0;

export class Game {
  private _id: number;
  private players: IGamePlayers[];
  private _isReady: boolean = false;
  private _turn: 0 | 1;

  constructor(players: IGamePlayers[]) {
    this.id = allowId;
    allowId++;
    this.players = players;
    this.turn = getRandomTurn();
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

  public setPlayerShips = (playerId: 0 | 1, ships: Ship[]) => {
    this.players[playerId].ships = ships;

    if (this.players.every((player) => player.ships)) {
      this.isReady = true;
    };
  };

  public getPlayers = () => {
    return this.players;
  };

};
