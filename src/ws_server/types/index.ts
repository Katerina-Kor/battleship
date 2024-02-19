import { Ship } from "../models/ship";
import { User } from "../models/user";


export enum MessageType {
  REG = 'reg',
  CREATE_GAME = 'create_game',
  START_GAME = 'start_game',
  TURN = 'turn',
  ATTACK = 'attack',
  FINISH = 'finish',
  UPDATE_ROOM = 'update_room',
  UPDATE_WINNERS = 'update_winners',
  CREATE_ROOM = 'create_room',
  ADD_USER_TO_ROOM = 'add_user_to_room',
  ADD_SHIPS = 'add_ships'
};

export interface ICeilPosition {
  x: number;
  y: number;
};

export interface IShipPosition {
  position: ICeilPosition,
  direction: boolean,
  type: 'small' | 'medium' | 'large' | 'huge',
  length: number
};

export interface IGamePlayers {
  user: User;
  ships: Ship[] | null;
  playerId: 0 | 1;
}