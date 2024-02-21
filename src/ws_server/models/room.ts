import { User } from "./user";

let allowId: number = 0;

export class Room {
  private _id: number;
  private _players: User[] = [];
  private _isAvailable: boolean = true;

  constructor() {
    this.id = allowId;
    allowId++;
  };

  public get id() {
    return this._id;
  };

  private set id(value: number) {
    this._id = value;
  };

  public get isAvailable() {
    return this._isAvailable;
  };

  private set isAvailable(value: boolean) {
    this._isAvailable = value;
  };

  public setUnavailable = () => {
    this.isAvailable = false;
  };

  public isReady = () => {
    return this._players.length === 2;
  };

  public addPlayer = (player: User) => {
    this._players.push(player);
  };

  public getPlayers = () => {
    return this._players;
  };
}