import { WebSocket } from 'ws';
import { User } from '../models';
import { database } from '../database/database';
import { IServerUpdateWinnersData } from '../types';

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
    return this.users.find((user) => user.socket === socket);
  };

  public getAllActiveUsers = () => {
    return this.users.filter((user) => user.isActive);
  };

  public setUserInactive = (user: User) => {
    user.setInactive();
    user.socket = null;
  };

  public checkUserPassword = (user: User, password: string) => {
    return user.password === password;
  };

  public getWinnersList = (): IServerUpdateWinnersData[] => {
    return this.users
      .filter((user) => user.winsQuantity > 0)
      .map((user) => ({
        name: user.username,
        wins: user.winsQuantity,
      }));
  };
}

export const usersController = new UsersController();
