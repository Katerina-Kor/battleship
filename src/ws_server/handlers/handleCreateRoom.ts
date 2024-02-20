import { WebSocket } from "ws";
import { usersController } from "../controllers/usersController";
import { IClientRegData, IServerUpdateRoomData, MessageType } from "../types";
import { prepareServerMessage } from "../utils";
import { Room } from "../models/room";
import { database } from "../database/database";

export const handleCreateRoom = (
  socket: WebSocket
) => {
  const currentUser = usersController.getUserBySocket(socket);
  // TODO: create rooms controller
  const newRoom = new Room();
  newRoom.addPlayer(currentUser);
  database.rooms.push(newRoom);

  const data: IServerUpdateRoomData[] = database.rooms.map(room => {
    return {
      roomId: room.id,
      roomUsers: room.getPlayers().map(player => ({
        name: player.username,
        index: player.id
      }))
    }
  })
  console.log('DATA', typeof data, data);

  const activeUsers = usersController.getAllActiveUsers();

  activeUsers.forEach(({ socket }) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(prepareServerMessage(MessageType.UPDATE_ROOM, data))
    }
  })
}