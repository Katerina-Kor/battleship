import { WebSocket } from "ws";
import { usersController } from "../controllers/usersController";
import { roomsController } from '../controllers/roomsController';
import { MessageType } from "../types";
import { prepareServerMessage } from "../utils";

export const handleCreateRoom = (
  socket: WebSocket
) => {
  const currentUser = usersController.getUserBySocket(socket);

  const createdRoom = roomsController.createRoom();
  roomsController.addUserToRoom(createdRoom, currentUser);

  const data = roomsController.getRoomsData();
  console.log('DATA', typeof data, data);

  const activeUsers = usersController.getAllActiveUsers();

  activeUsers.forEach(({ socket }) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(prepareServerMessage(MessageType.UPDATE_ROOM, data))
    }
  })
}