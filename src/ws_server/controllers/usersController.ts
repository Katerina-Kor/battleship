import { WebSocket } from "ws";
import { User } from "../models/user"
import { database } from "../database/database";

class UsersController {
  private users: User[] = database.users;

  public getUserByUsername = (name: string) => {
    return this.users.find((user) => user.username === name);
  };

  public createNewUser = (name: string, password: string, socket: WebSocket) => {
    const newUser = new User(name, password, socket);
    this.users.push(newUser);
    return newUser;
  };

  public getUserBySocket = (socket: WebSocket) => {
    return this.users.find((user) => user.socket === socket) as User;
  };

  public getAllActiveUsers = () => {
    return this.users.filter((user) => user.isActive)
  };

  public setUserInactive = (socket: WebSocket) => {
    const user = this.getUserBySocket(socket);
    user.setInactive();
    user.socket = null;
  }
}

export const usersController = new UsersController();