import { WebSocket } from "ws";

let allowId: number = 0;

export class User {
  private username: string;
  private id: number;
  private password: string;
  private winsQuantity: number = 0;
  private isActive: boolean = true;
  private socket: WebSocket | null = null;

  constructor(username: string, password: string, socket: WebSocket) {
    this.username = username;
    this.password = password;
    this.id = allowId;
    allowId++;
    this.socket = socket;
  };

  public getUsername = () => this.username;

  public getId = () => this.id;

  public getSocket = () => this.socket;

  public setActive = () => this.isActive = true;

  public setInactive = () => this.isActive = false;

  public setSocket = (socket: WebSocket) => this.socket = socket; 

  public getWinsQuantity = () => this.winsQuantity;

  public increaseWinsQuantity = () => this.winsQuantity++;

  public getIsActive = () => this.isActive;
}