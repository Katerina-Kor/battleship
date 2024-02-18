import { WebSocket } from "ws";

export enum ResponseType {
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

export interface IUserDB {
  username: string;
  password: string,
  id: number,
  ws: WebSocket
};

export interface IShipPosition {
  position: {
    x: number,
    y: number
  },
  direction: boolean,
  type: 'small' | 'medium' | 'large' | 'huge',
  length: number
}