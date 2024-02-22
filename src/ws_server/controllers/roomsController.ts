import { database } from "../database/database";
import { Room } from "../models/room";
import { User } from "../models/user";
import { IServerUpdateRoomData } from "../types";

class RoomsController {
  private rooms: Room[] = database.rooms;

  public createRoom = () => {
    const newRoom = new Room();
    this.rooms.push(newRoom);
    return newRoom;
  };

  public addUserToRoom = (roomData: number | Room, user: User) => {
    if (typeof roomData === 'number') {
      const room = this.getRoomById(roomData);
      room.addPlayer(user);
    } else {
      roomData.addPlayer(user);
    }
  };

  public checkUserAlreadyInRoom = (user: User, particularRoom?: Room) => {
    let roomWithUser;
    if (particularRoom) {
      roomWithUser = particularRoom.isUserInRoom(user);
    } else {
      roomWithUser = this.rooms.find(room => room.isUserInRoom(user));
    };
    return roomWithUser ? true : false;
  }

  public closeRoom = (roomData: number | Room) => {
    if (typeof roomData === 'number') {
      const room = this.getRoomById(roomData);
      room.setUnavailable();
    } else {
      roomData.setUnavailable();
    }
  };

  public getRoomById = (roomId: number) => {
    return this.rooms.find((room) => room.id === roomId) as Room
  };

  public getUsersInRoom = (roomData: number | Room) => {
    if (typeof roomData === 'number') {
      const room = this.getRoomById(roomData);
      return room.getPlayers();
    } else {
      return roomData.getPlayers();
    }
  }

  public getRoomsData = () => {
    const data: IServerUpdateRoomData[] = this.rooms
      .filter(room => room.isAvailable)
      .map(room => {
      return {
        roomId: room.id,
        roomUsers: room.getPlayers().map(player => ({
          name: player.username,
          index: player.id
        }))
      }
    });
    return data;
  };
}

export const roomsController = new RoomsController();