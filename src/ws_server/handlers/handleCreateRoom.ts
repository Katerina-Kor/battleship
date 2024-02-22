import { WebSocket } from "ws";
import { usersController } from "../controllers/usersController";
import { roomsController } from '../controllers/roomsController';
import { sendUpdateRoomMessage } from "../utils/sendMessage";

export const handleCreateRoom = (
  socket: WebSocket
) => {
  const currentUser = usersController.getUserBySocket(socket);

  if (roomsController.checkUserAlreadyInRoom(currentUser)) return;

  const createdRoom = roomsController.createRoom();
  roomsController.addUserToRoom(createdRoom, currentUser);

  const roomsData = roomsController.getRoomsData();

  const activeUsers = usersController.getAllActiveUsers();

  activeUsers.forEach(({ socket }) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      sendUpdateRoomMessage(socket, roomsData);
    };
  });
};
