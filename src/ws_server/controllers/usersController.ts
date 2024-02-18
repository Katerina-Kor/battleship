import { WebSocket } from "ws";
import { User } from "../models/user"
import { usersDB } from "../models/usersDB"

export class UsersController {
  private users: User[] = usersDB;

  public getUserByUsername = (name: string) => {
    return this.users.find((user) => user.getUsername() === name);
  };

  public createNewUser = (name: string, password: string, socket: WebSocket) => {
    const newUser = new User(name, password, socket);
    this.users.push(newUser);
    return newUser;
  };

  public getUserBySocket = (socket: WebSocket) => {
    return this.users.find((user) => user.getSocket() === socket) as User;
  }
  
}