import { Ship } from "../models/ship";
import { User } from "../models/user";


export enum MessageType {
  REG = 'reg',
  CREATE_GAME = 'create_game',
  START_GAME = 'start_game',
  TURN = 'turn',
  ATTACK = 'attack',
  RANDOM_ATTACK = 'randomAttack',
  FINISH = 'finish',
  UPDATE_ROOM = 'update_room',
  UPDATE_WINNERS = 'update_winners',
  CREATE_ROOM = 'create_room',
  ADD_USER_TO_ROOM = 'add_user_to_room',
  ADD_SHIPS = 'add_ships'
};

export enum ShipStatus {
  MISS = 'miss',
  KILLED = 'killed',
  SHOT = 'shot',
}

export interface ICeilPosition {
  x: number;
  y: number;
};

export interface IShipData {
  position: ICeilPosition,
  direction: boolean,
  type: 'small' | 'medium' | 'large' | 'huge',
  length: number
};

export interface IGamePlayers {
  user: User;
  ships: Ship[] | null;
  shipsData: IShipData[] | null,
  playerId: 0 | 1;
};


export interface IClientRegData {
  name: string,
  password: string,
};

export interface IClientRegMessage {
  type: MessageType.REG,
  data: IClientRegData,
  id: 0,
};

export interface IClientCreateRoomMessage {
  type: MessageType.CREATE_ROOM,
  data: '',
  id: 0,
};

export interface IClientAddUserToRoomData {
  indexRoom: number,
};

export interface IClientAddUserToRoomMessage {
  type: MessageType.ADD_USER_TO_ROOM,
  data: IClientAddUserToRoomData,
  id: 0,
};

export interface IClientAddShipsData {
  gameId: number,
  ships: IShipData[],
  indexPlayer: number,
};

export interface IClientAddShipsMessage {
  type: MessageType.ADD_SHIPS,
  data: IClientAddShipsData,
  id: 0,
};

export interface IClientAttackData {
  gameId: number,
  x: number,
  y: number,
  indexPlayer: number,
};

export interface IClientAttackMessage {
  type: MessageType.ATTACK,
  data: IClientAttackData,
  id: 0,
};

export interface IClientRandomAttackData {
  gameId: number,
  indexPlayer: number,
};

export interface IClientRandomAttackMessage {
  type: MessageType.RANDOM_ATTACK,
  data: IClientRandomAttackData,
  id: 0,
};

export type ClientMessage =
  IClientRegMessage |
  IClientCreateRoomMessage |
  IClientAddUserToRoomMessage |
  IClientAddShipsMessage |
  IClientAttackMessage |
  IClientRandomAttackMessage;


export interface IServerRegData {
  name: string,
  index: number,
  error: boolean,
  errorText: string,
};

export interface IServerRegMessage {
  type: MessageType.REG,
  data: IServerRegData,
  id: 0,
};

export interface IServerUpdateWinnersData {
  name: string,
  wins: number,
};

export interface IServerUpdateWinnersMessage {
  type: MessageType.UPDATE_WINNERS,
  data: IServerUpdateWinnersData[],
  id: 0,
};

export interface IServerCreateGameData {
  idGame: number,
  idPlayer: number,
};

export interface IServerCreateGameMessage {
  type: MessageType.CREATE_GAME,
  data: IServerCreateGameData,
  id: 0,
};

export interface IRoomUsersData {
  name: string,
  index: number,
}

export interface IServerUpdateRoomData {
  roomId: number,
  roomUsers: IRoomUsersData[]
};

export interface IServerUpdateRoomMessage {
  type: MessageType.UPDATE_ROOM,
  data: IServerUpdateRoomData[],
  id: 0,
};

export interface IServerStartGameData {
  ships: IShipData[],
  currentPlayerIndex: number,
};

export interface IServerStartGameMessage {
  type: MessageType.START_GAME,
  data: IServerStartGameData,
  id: 0,
};

export interface IServerAttackData {
  position: ICeilPosition,
  currentPlayer: number,
  status: ShipStatus
};

export interface IServerAttackMessage {
  type: MessageType.ATTACK,
  data: IServerAttackData,
  id: 0,
};

export interface IServerTurnData {
  currentPlayer: number,
};

export interface IServerTurnMessage {
  type: MessageType.TURN,
  data: IServerTurnData,
  id: 0,
};

export interface IServerFinishData {
  winPlayer: number,
};

export interface IServerFinishMessage {
  type: MessageType.FINISH,
  data: IServerFinishData,
  id: 0,
};

export type ServerMessageData =
  IServerRegData |
  IServerUpdateWinnersData |
  IServerCreateGameData |
  IServerUpdateRoomData[] |
  IServerStartGameData | 
  IServerAttackData |
  IServerTurnData |
  IServerFinishData;

  export type ServerMessage =
  IServerRegMessage |
  IServerUpdateWinnersMessage |
  IServerCreateGameMessage |
  IServerUpdateRoomMessage |
  IServerStartGameMessage |
  IServerAttackMessage |
  IServerTurnMessage |
  IServerFinishMessage;