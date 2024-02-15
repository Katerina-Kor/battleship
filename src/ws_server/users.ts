import WebSocket from "ws";

interface IUserDB {
  username: string;
  password: string,
  id: number,
  ws: WebSocket
}

export const usersDB: IUserDB[] = [];