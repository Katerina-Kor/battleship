import { WebSocket } from "ws";

let allowId: number = 0;

export class User {
  private _username: string;
  private _id: number;
  private _password: string;
  private _winsQuantity: number = 0;
  private _isActive: boolean = true;
  private _socket: WebSocket | null = null;

  constructor(username: string, password: string, socket: WebSocket) {
    this.username = username;
    this.password = password;
    this.id = allowId;
    allowId++;
    this.socket = socket;
  };

  public get username() {
    return this._username;
  };

  private set username(value: string) {
    this._username = value;
  };

  public get password() {
    return this._password;
  };

  private set password(value: string) {
    this._password = value;
  };

  public get id() {
    return this._id;
  };

  private set id(value: number) {
    this._id = value;
  };

  public get socket(): WebSocket | null {
    return this._socket;
  };

  public set socket(value: WebSocket | null) {
    this._socket = value;
  };

  public get winsQuantity() {
    return this._winsQuantity;
  };

  private set winsQuantity(value: number) {
    this._winsQuantity = value;
  };

  public get isActive() {
    return this._isActive;
  };

  private set isActive(value: boolean) {
    this._isActive = value;
  };

  public setActive = (socket: WebSocket) => {
    this.isActive = true;
    this.socket = socket;
  };

  public setInactive = () => {
    this.isActive = false;
  };

  public increaseWinsQuantity = () => {
    this.winsQuantity++;
  };
}