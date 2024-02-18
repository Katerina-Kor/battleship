import { WebSocket } from "ws";
import { User } from "./user";

let allowId: number = 0;

export class Room {
  private id: number;
  private player1: User | null = null;
  private player2: User | null = null;
  private isAvailable: boolean = true;

  constructor(player: User) {
    this.id = allowId;
    allowId++;
    this.player1 = player;
  };

  public getPlayer1 = () => this.player1;

  public getPlayer2 = () => this.player2;

  public getId = () => this.id;

  public setUnavailable = () => this.isAvailable = false;

  public setPlayer2 = (player: User) => this.player2 = player;

  public getIsAvailable = () => this.isAvailable;
}