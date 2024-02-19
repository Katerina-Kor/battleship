import { Game } from "../models/game";
import { Room } from "../models/room";
import { User } from "../models/user";

export interface IDatabase {
  users: User[];
  rooms: Room[];
  games: Game[];
};

export const database: IDatabase = {
  users: [],
  rooms: [],
  games: []
};